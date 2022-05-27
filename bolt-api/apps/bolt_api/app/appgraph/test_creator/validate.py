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
from services.hasura.hasura_client import hce
from services import validators


class Validate(graphene.Mutation):
    """Validates test_creator json testrun definition.
    Example json data:
    data:"{\"test_type\":\"set\", \"endpoints\":[{\"name\": \"test\", \"method\": \"get\", \"url\": \"/test\"}]}",
    """

    class Arguments:
        name = graphene.String(
            required=True,
            description='Name.')
        data = graphene.String(
            required=True,
            description='Json data.')
        project_id = graphene.UUID(
            required=True,
            description='Project id to associate with.')
        max_wait = graphene.Int(
            required=True,
            description='Maximum response wait time.')
        min_wait = graphene.Int(
            required=True,
            description='Minimum response wait time.')
        type_slug = graphene.String(
            description=f'Configuration type: "{const.TESTTYPE_CHOICE}"')

    Output = gql_util.ValidationInterface

    @staticmethod
    def validate(info, name, data, project_id, max_wait, min_wait, type_slug, validate_unique_name=True):
        assert type_slug in const.TESTTYPE_CHOICE, f'invalid type_slug {type_slug}'
        project_id = str(project_id)
        role, user_id = gql_util.get_request_role_userid(info, (const.ROLE_ADMIN, const.ROLE_TENANT_ADMIN, const.ROLE_MANAGER, const.ROLE_TESTER))

        name = validators.validate_text(name)

        # validate configuration exists and user has access to it
        creators = hce(current_app.config, '''
            query ($userId: uuid!, $project_id: uuid!, $name:String!) {
                project (where: {
                    id: {_eq: $project_id}, 
                    is_deleted: {_eq:false},
                    userProjects: {user_id: {_eq: $userId}}
                }) {
                    name
                }

                test_source(where:{
                    project:{
                        userProjects:{user_id:{_eq:$userId}},
                        is_deleted: {_eq:false},
                        id: {_eq:$project_id},
                    }
                    test_creator:{name:{_eq:$name}}
                }) {
                    id
                }
            }
        ''', {
            'userId': user_id,
            'project_id': project_id,
            'name': name,
        })
        assert len(creators['project']) == 1, f'project does not exist'
        if validate_unique_name:
            assert len(creators['test_source']) == 0, f'name {name} is in use'

        # validate configuration body
        validators.validate_test_creator(data, min_wait=min_wait, max_wait=max_wait)

        return {
            'name': name,
            'project_id': project_id,
            'data': data,
            'max_wait': max_wait,
            'min_wait': min_wait,
            'created_by_id': user_id,
        }

    def mutate(self, info, name, data, project_id, max_wait, min_wait, type_slug):
        Validate.validate(info, name, data, project_id, max_wait, min_wait, type_slug)
        return gql_util.ValidationResponse(ok=True)