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

from apps.bolt_api.app.appgraph.repository import types
from services import const, gql_util
from services import validators
from services.hasura import hce


class UpdateValidate(graphene.Mutation):
    """Validates repository configuration."""

    class Arguments:
        id = graphene.UUID()
        name = graphene.String(
            required=False)
        repository_url = graphene.String(
            required=False,
            description='Repository address.')
        type_slug = graphene.String(
            required=False,
            description=f'Configuration type: "{const.TESTTYPE_LOAD}"')

    Output = gql_util.ValidationInterface

    @staticmethod
    def validate(info, id, name=None, repository_url=None, type_slug=None):
        role, user_id = gql_util.get_request_role_userid(info, (const.ROLE_ADMIN, const.ROLE_TENANT_ADMIN, const.ROLE_MANAGER, const.ROLE_TESTER))

        if name:
            name = validators.validate_text(name)

        query = hce(current_app.config, '''query ($repoName:String!, $repoUrl:String!, $repoId:uuid!, $userId:uuid!, $confType:String) {
            uniqueName: repository(where:{
                name:{_eq:$repoName},
                is_deleted: {_eq:false},
                project: {
                    userProjects: {user_id: {_eq:$userId}},
                    is_deleted: {_eq:false}
                }
            }) { id }

            uniqueUrl: repository(where:{
                url:{_eq:$repoUrl},
                is_deleted: {_eq:false},
                project: {
                    userProjects: {user_id: {_eq:$userId}},
                    is_deleted: {_eq:false}
                }
            }) { id }

            configuration_type(where:{slug_name:{_eq:$confType}}, limit:1) { id }

            repository(
                where:{
                    id:{_eq:$repoId},
                    is_deleted: {_eq:false},
                    project: {
                        userProjects: {user_id: {_eq:$userId}},
                        is_deleted: {_eq:false}
                    }
                }
            ) {
                name
                url
                type_slug
                performed
            }

            }''', variable_values={
            'userId': user_id,
            'repoName': name or '',
            'repoUrl': repository_url or '',
            'repoId': str(id),
            'confType': type_slug or '',

        })
        assert len(query.get('repository')) == 1, f'repository {str(id)} does not exists'

        query_data = {}
        was_performed = query['repository'][0]['performed']

        if name and name != query['repository'][0]['name']:
            assert len(query.get('uniqueName')) == 0, f'repository with this name already exists'
            query_data['name'] = name

        if type_slug and repository_url != query['repository'][0]['type_slug']:
            assert len(query.get('configuration_type',
                                 [])) == 1, f'invalid type_slug "{type_slug}", valid choices are: {const.TESTTYPE_LOAD}'
            assert not was_performed, \
                f'cannot change type_slug, a test has been performed using this repository'
            query_data['type_slug'] = type_slug

        if repository_url and repository_url != query['repository'][0]['url']:
            assert not was_performed, \
                f'cannot change repository_url, a test has been performed using this repository'
            assert len(query.get('uniqueUrl')) == 0, f'repository with this url already exists'
            query_data['url'] = validators.validate_accessibility(current_app.config, repository_url)

        return query_data

    def mutate(self, info, id, name=None, repository_url=None, type_slug=None):
        UpdateValidate.validate(info, id, name, repository_url, type_slug)
        return gql_util.ValidationResponse(ok=True)


class Update(UpdateValidate):
    """Validates and updates repository name."""

    Output = gql_util.OutputInterfaceFactory(types.RepositoryInterface, 'Update')

    def mutate(self, info, id, name=None, repository_url=None, type_slug=None):

        query_params = UpdateValidate.validate(info, id, name, repository_url, type_slug)

        query = '''mutation ($id:uuid!, $data:repository_set_input!) {
            update_repository(
                where:{id:{_eq:$id}},
                _set: $data
            ) {
                returning { id name repository_url:url project_id type_slug } 
            }
        }'''

        query_response = hce(current_app.config, query, variable_values={'id': str(id), 'data': query_params})
        assert query_response['update_repository'], f'cannot save repository ({str(query_response)})'

        return gql_util.OutputValueFromFactory(Update, query_response['update_repository'])
