# Copyright (c) 2022 Acaisoft
#
# Permission is hereby granted, free of charge, to any person obtaining a copy of
# this software and associated documentation files (the "Software"), to deal in
# the Software without restriction, including without limitation the rights to
# use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
# the Software, and to permit persons to whom the Software is furnished to do so,
# subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
# FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
# COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
# IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
# CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import uuid

from flask import current_app
from schematics import types

from services import const
from services.hasura import hce
from services.keycloak.users import create_user_with_role, list_users, user_assign_roles


def user_create(email, role, project=None):
    """
    Create a user in keycloak with given roles, optionally assign to given project
    """
    e = types.EmailType(max_length=256)
    e.validate(email)
    if project:
        p = types.UUIDType()
        p.validate(project)
    r = types.BaseType(choices=const.ROLE_CHOICE)
    r.validate(role)

    if not project:
        assert role == const.ROLE_TENANT_ADMIN, f'a user without project must have a "tenantadmin" role'

    if project:
        project_query = hce(current_app.config, '''query ($project:uuid!) {
            project_by_pk (id:$project) {
                is_deleted
                name
                userProjects { user_id }
            }
        }''', {'project': project})
        assert project_query['project_by_pk'], f'invalid project id f{project}: {project_query}'

    current_app.logger.info('adding keycloak user')
    user_id = create_user_with_role(current_app.config, email, role)
    assert user_id, f'expected a non-empty keycloak user_id instead of {user_id}'

    if project:
        current_app.logger.info('adding user-project relation')
        hce(current_app.config, '''mutation ($data:user_project_insert_input!) {
            insert_user_project(objects: [$data]) { affected_rows }
        }''', {'data': {'user_id': user_id, 'project_id': project}})

    return user_id


def user_create_registration_token(project, role, requested_by_uuid=None):
    """
    Enables registration in given project with given default role
    :param project: project to assign new registeree to
    :param role: role to assign to user, if no other is available
    :param requested_by_uuid: optional uuid of the user requesting the token
    :return: registration token
    """
    p = types.UUIDType()
    p.validate(project)
    r = types.BaseType(choices=const.ROLE_CHOICE)
    r.validate(role)

    current_app.logger.info('generating registration token')
    token = str(uuid.uuid4())
    invitation_token = token[9:23]
    q_data = {
        'project_id': project,
        'user_role': role,
        'token': token,
        'invitation_token': invitation_token,
    }

    if requested_by_uuid:
        p.validate(requested_by_uuid)
        q_data['created_by'] = requested_by_uuid

    query = hce(current_app.config, '''mutation ($data:[user_registration_token_insert_input!]!) {
        insert_user_registration_token(
            objects:$data
        ) {
            returning { token }
        }
    }''', {'data': q_data})
    assert query['insert_user_registration_token'], f'unexpected error: {str(query)}'
    return token, invitation_token


def user_register(email, invitation_token):
    """
    Registers a user using a registration_token from @user_create_registration_token
    :param email: user email
    :param invitation_token: invitation_token token
    :return: user id
    """
    p = types.EmailType()
    p.validate(email)
    current_app.logger.info('validating registration token')
    r = types.StringType(max_length=14, min_length=14)
    r.validate(invitation_token)
    resp = hce(current_app.config, '''query ($st:String!) {
        user_registration_token ( where: {invitation_token: {_eq:$st} }) {
            project_id
            user_role
        }
    }''', {'st': invitation_token})
    assert len(resp['user_registration_token']) == 1, f'invalid token'
    project_id = resp['user_registration_token'][0]['project_id']
    user_role = resp['user_registration_token'][0]['user_role']

    user_id = user_create(email=email, role=user_role, project=project_id)
    return user_id


def disable_invitation(project_id=None):
    """
    Disables invitation for project or all projects (deletes all invitation tokens for given project(s)).
    :param project_id: optional, None equals all projects
    :return:
    """
    if project_id:
        current_app.logger.info(f'disabling registration for project {project_id}')
        resp = hce(current_app.config, '''mutation ($pid:uuid!) {
            delete_user_registration_token (where:{project_id:{_eq:$pid}}) { affected_rows }
        }''', {'pid': project_id})
        assert resp.get('errors', None) is None, f'cant close registration: {str(resp)}'
    else:
        current_app.logger.info(f'disabling registration for all projects')
        resp = hce(current_app.config, '''mutation {
            delete_user_registration_token (where:{user_role:{_neq:"nop"}}) { affected_rows }
        }''', {'pid': project_id})
        assert resp.get('errors', None) is None, f'cant close registration: {str(resp)}'


def user_unassign_from_project(user_id, project_id):
    p = types.UUIDType()
    p.validate(user_id)
    p.validate(project_id)

    return hce(current_app.config, '''mutation ($user_id:String!, $project_id:UUID!) {
        delete_user_project(where:{
            user_id:{_eq:$user_id}
            project_id:{_eq:$project_id}
        }) { returning { user_id project_id } }
    }''', {
        'user_id': user_id,
        'project_id': project_id,
    })


def list_users_in_project(project_id):
    p = types.UUIDType()
    p.validate(project_id)

    response = hce(current_app.config, '''query ($project:uuid!) {
        user_project (where:{project_id:{_eq:$project}}) { user_id }
    }''', {'project': project_id})
    assert response['user_project'], f'invalid project id f{project_id}: {response}'

    user_ids = set([x['user_id'] for x in response['user_project']])

    current_app.logger.info(f'looking up {len(user_ids)} users: {user_ids}')
    k_users = list_users(current_app.config)

    return [x for x in k_users if x.get('id', None) in user_ids]


def user_roles_update(user_id, new_roles):
    p = types.UUIDType()
    p.validate(user_id)
    r = types.BaseType(choices=const.ROLE_CHOICE)
    r.validate(new_roles)

    return user_assign_roles(current_app.config, user_id, new_roles)
