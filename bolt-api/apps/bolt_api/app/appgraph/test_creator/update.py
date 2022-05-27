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

import graphene
from flask import current_app

from services import const
from apps.bolt_api.app.appgraph.test_creator import types, validate
from services import gql_util
from services.hasura import hce


class Update(validate.Validate):
    """Validates and updates the test_creator json testrun definition. Returns updated id."""

    class Arguments:
        id = graphene.UUID(
            required=True,
            description='Test creator id.')
        name = graphene.String(
            required=False,
            description='Name.')
        data = graphene.String(
            required=False,
            description='Json data.')
        max_wait = graphene.Int(
            required=False,
            description='Maximum response wait time.')
        min_wait = graphene.Int(
            required=False,
            description='Minimum response wait time.')
        type_slug = graphene.String(
            description=f'Configuration type: "{const.TESTTYPE_CHOICE}"')

    Output = types.TestCreatorInterface

    def mutate(self, info, id, name=None, data=None, max_wait=None, min_wait=None, type_slug=None):
        id = str(id)

        role, user_id = gql_util.get_request_role_userid(info, (const.ROLE_ADMIN, const.ROLE_TENANT_ADMIN, const.ROLE_MANAGER, const.ROLE_TESTER))

        original = hce(current_app.config, '''query ($objId:uuid!, $userId:uuid!) {
            test_creator (where:{
                    id:{_eq:$objId}
                    project:{
                        userProjects:{user_id:{_eq:$userId}}
                        is_deleted: {_eq:false}
                    }
            }) {
                id
                name
                performed
                project_id
                test_source_id
                max_wait
                min_wait
                type_slug
                data
            }
        }''', variable_values={
            'objId': id,
            'userId': user_id,
        })
        assert len(original['test_creator']) == 1, f'test_creator {id} does not exist'

        original = original['test_creator'][0]
        project_id = original['project_id']
        test_source_id = original['test_source_id']
        new_id = str(uuid.uuid4())

        if not data:
            data = original['data']
        if not name:
            name = original['name']
        if not max_wait:
            max_wait = original['max_wait']
        if not min_wait:
            min_wait = original['min_wait']
        if not type_slug:
            type_slug = original['type_slug']

        query_params = validate.Validate.validate(info, name, data, project_id, max_wait, min_wait, type_slug, validate_unique_name=False)

        query_params['id'] = new_id
        query_params['test_source_id'] = test_source_id
        query_params['previous_version_id'] = id

        query = '''mutation ($oldId:uuid!, $newId:uuid!, $data:[test_creator_insert_input!]!) {
            insert_test_creator(
                objects: $data
            ) {
                returning { id } 
            }
            update_test_source (
                where:{test_creator_id:{_eq:$oldId}}
                _set:{test_creator_id:$newId}
            ) { affected_rows }
        }'''

        conf_response = hce(current_app.config, query, variable_values={
            'data': query_params,
            'oldId': id,
            'newId': new_id,
        })
        assert conf_response['insert_test_creator'], f'cannot save creator ({str(conf_response)})'

        return types.TestCreatorType(id=new_id)
