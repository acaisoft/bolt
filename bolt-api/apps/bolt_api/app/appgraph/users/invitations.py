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

import graphene
from flask import current_app

from services import const, gql_util
from apps.bolt_api.app.appgraph.users import types
from services.hasura import hce
from services.logger import setup_custom_logger
from services.user_management import user_management

logger = setup_custom_logger(__file__)


class GetProjectInvitationToken(graphene.Mutation):
    """Creates a user registration token for given project."""

    class Arguments:
        project_id = graphene.UUID(
            required=True,
            description='Project ID.')
        role = graphene.String(
            required=True,
            description='Default user role.')

    Output = gql_util.OutputInterfaceFactory(types.GetProjectInvitationInterface, 'GetRegToken')

    def mutate(self, info, project_id, role):
        project_id = str(project_id)

        req_role, req_user_id = gql_util.get_request_role_userid(info, (const.ROLE_ADMIN, const.ROLE_TENANT_ADMIN, const.ROLE_MANAGER))

        assert role != const.ROLE_ADMIN, f'cannot register superadmin accounts'

        if req_role == const.ROLE_MANAGER:
            # manager cant allow registration of admins or other managers
            assert role not in (const.ROLE_ADMIN, const.ROLE_TENANT_ADMIN, const.ROLE_MANAGER), \
                f'manager can only allow registration of non-managerial roles'

        if req_role == const.ROLE_TENANT_ADMIN:
            # admins still cannot allow registration of other admins, admins should only be assignable manually
            assert role not in (const.ROLE_ADMIN, const.ROLE_TENANT_ADMIN), \
                f'admins can not allow registration of admin roles'

        projects = hce(current_app.config, '''query ($pid:uuid!, $uid:uuid!) {
            project(where:{
                id:{_eq:$pid}
                is_deleted:{_eq:false}
                userProjects:{user_id:{_eq:$uid}}
            }) { id }
        }''', {
            'pid': project_id,
            'uid': req_user_id,
        })
        assert len(projects['project']) == 1, f'invalid project id {project_id}'

        full_token, short_token = user_management.user_create_registration_token(str(project_id), role, requested_by_uuid=req_user_id)

        return gql_util.OutputValueFromFactory(GetProjectInvitationToken, {'returning': [{
            'token': short_token,
        }]})


class RegisterUser(graphene.Mutation):
    """Registers a user using an invitation token."""

    class Arguments:
        email = graphene.String(
            required=True,
            description='User email.')
        token = graphene.String(
            required=True,
            description='Invitation token.')

    Output = gql_util.OutputInterfaceFactory(types.SimpleStatusInterface, 'RegisterUser')

    def mutate(self, info, email, token):

        user_id = user_management.user_register(email, token)
        logger.info(f'successfully registered new user {user_id} for token {token} and email {email}')

        return gql_util.OutputValueFromFactory(RegisterUser, {'returning': [{
            'success': True,
        }]})


class DisableInvitation(graphene.Mutation):
    """Disable registration in project."""

    class Arguments:
        project_id = graphene.UUID(
            required=True,
            description='Project ID.')

    Output = gql_util.OutputInterfaceFactory(types.SimpleStatusInterface, 'DisableInvitation')

    def mutate(self, info, project_id):
        project_id = str(project_id)

        req_role, req_user_id = gql_util.get_request_role_userid(info, (const.ROLE_ADMIN, const.ROLE_TENANT_ADMIN, const.ROLE_MANAGER))

        projects = hce(current_app.config, '''query ($pid:uuid!, $uid:uuid!) {
            project(where:{
                id:{_eq:$pid}
                is_deleted:{_eq:false}
                userProjects:{user_id:{_eq:$uid}}
            }) { id }
        }''', {
            'pid': project_id,
            'uid': req_user_id,
        })
        assert len(projects['project']) == 1, f'invalid project id {project_id}'

        user_management.disable_registration(project_id)
        logger.info(f'successfully closed registration for {project_id}')

        return gql_util.OutputValueFromFactory(DisableInvitation, {'returning': [{
            'success': True,
        }]})
