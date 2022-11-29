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

from apps.bolt_api.app.appgraph.project import types
from services import const, gql_util
from services import validators
from services.hasura import hce


class UpdateValidate(graphene.Mutation):
    """Validates project update parameters."""

    class Arguments:
        id = graphene.UUID(
            description='Project id')
        name = graphene.String(
            required=False,
            description='Name, unique for user.')
        description = graphene.String(
            required=False,
            description='Project description.')
        image_url = graphene.String(
            required=False,
            description='Project logo.')

    Output = gql_util.ValidationInterface

    @staticmethod
    def validate(info, id, name=None, description=None, image_url=None):
        role, user_id = gql_util.get_request_role_userid(info, (const.ROLE_ADMIN, const.ROLE_TENANT_ADMIN, const.ROLE_MANAGER,))

        if name:
            name = validators.validate_text(name)

        projects = hce(current_app.config, '''query ($projId:uuid!, $userId:String!, $name:String!) {
            original: project_by_pk(id:$projId) { id name }
            
            uniqueName: project (where:{
                name:{_eq:$name},
                is_deleted: {_eq:false}, 
                userProjects:{user_id:{_eq:$userId}}
            }) {
                name
            }
        }''', {
            'projId': str(id),
            'userId': user_id,
            'name': name or '',
        })
        assert projects.get('original'), f'project {str(id)} does not exist'

        query_params = {}

        if name and name != projects.get('original')['name']:
            query_params['name'] = name.strip()
            assert len(projects.get('uniqueName', None)) == 0, f'project with this name already exists'

        if description:
            validators.validate_text(description, key='description', required=False)
            query_params['description'] = description.strip()

        if image_url:
            validators.validate_url(image_url, key='image_url', required=False)
            query_params['image_url'] = image_url.strip()

        return query_params

    def mutate(self, info, id, name=None, description=None, image_url=None):
        UpdateValidate.validate(info, id, name, description, image_url)
        return gql_util.ValidationResponse(ok=True)


class Update(UpdateValidate):
    """Validates and updates a project."""

    Output = gql_util.OutputInterfaceFactory(types.ProjectInterface, 'Update')

    def mutate(self, info, id, name=None, description=None, image_url=None):

        query_params = UpdateValidate.validate(info, id, name, description, image_url)

        if query_params.get('image_url'):
            query_params['image_url'] = Update.process_upload(query_params['image_url'])

        query = '''mutation ($id:uuid!, $data:project_set_input!) {
            update_project(
                where:{id:{_eq:$id}},
                _set: $data
            ) {
                returning { id name description image_url } 
            }
        }'''

        conf_response = hce(current_app.config, query, variable_values={'id': str(id), 'data': query_params})
        assert conf_response['update_project'], f'cannot update project ({str(conf_response)})'

        return gql_util.OutputValueFromFactory(Update, conf_response['update_project'])
