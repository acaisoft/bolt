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

from apps.bolt_api.app.appgraph.extension.types import ExtensionParamInput, ExtensionType
from services import const, gql_util
from services import validators
from services.hasura import hce


class UpdateValidate(graphene.Mutation):
    """Validates single extension."""

    class Arguments:
        id = graphene.UUID()
        params = graphene.List(
            ExtensionParamInput,
            required=True,
            description='Extension parameters.')

    Output = gql_util.ValidationInterface

    @staticmethod
    def validate(info, id, params):
        obj_id = str(id)

        role, user_id = gql_util.get_request_role_userid(info, (const.ROLE_ADMIN, const.ROLE_TENANT_ADMIN, const.ROLE_MANAGER))

        resp = hce(current_app.config, '''query ($obj_id:uuid!, $user_id:uuid!) {
            configuration_extension(where:{
                id:{ _eq:$obj_id }
                configuration:{
                    is_deleted:{ _eq:false }
                    project:{
                        is_deleted:{ _eq:false }
                        userProjects:{user_id:{ _eq:$user_id }}
                    }
                }
            }) {
                id type
            }
        }''', {
            'user_id': user_id,
            'obj_id': obj_id,
        })
        assert resp['configuration_extension'], f'configuration extension not found'

        validators.validate_single_extension({
            'type': resp['configuration_extension'][0]['type'],
            'extension_params': params,
        })

        query = []
        for ep in params:
            query.append({
                'configuration_extension_id': obj_id,
                'name': ep['name'],
                'value': ep['value'],
            })

        return query

    def mutate(self, info, id, params):
        UpdateValidate.validate(info, id, params)
        return gql_util.ValidationResponse(ok=True)


class Update(UpdateValidate):
    """Updates all extension parameters in one go."""

    Output = gql_util.OutputTypeFactory(ExtensionType, 'Update')

    def mutate(self, info, id, params):
        query_params = UpdateValidate.validate(info, id, params)

        query = '''mutation ($oid:uuid!, $data:[extension_params_insert_input!]!) {
            delete_extension_params(where:{
                configuration_extension_id:{ _eq:$oid }
            }) { affected_rows }
            
            insert_extension_params(objects: $data) {
                affected_rows
                returning {
                    id
                    name
                    value
                    configuration_extension_id
                }
            }
        }'''

        resp = hce(current_app.config, query, variable_values={'oid': str(id), 'data': query_params})
        assert resp['insert_extension_params'], f'cannot update parameters ({str(resp)})'

        resp = hce(current_app.config, '''query ($oid:uuid!) {
            configuration_extension(where:{id:{ _eq:$oid }}) {
                id
                configuration_id
                type_slug:type
                params:extension_params {
                    name
                    value
                }
            }
        }''', variable_values={'oid': str(id)})

        return gql_util.OutputValueFromFactory(Update, {'returning': resp['configuration_extension']})
