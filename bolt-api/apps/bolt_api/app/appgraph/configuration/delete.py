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

from apps.bolt_api.app.appgraph.configuration import types
from services import const, gql_util
from services.hasura import hce


class Delete(graphene.Mutation):
    """Soft-deletes a configuration."""

    class Arguments:
        pk = graphene.UUID(description='ID of the project to delete.')

    Output = gql_util.OutputTypeFactory(types.ConfigurationType, 'Delete')

    def mutate(self, info, pk):
        _, user_id = gql_util.get_request_role_userid(info, (const.ROLE_ADMIN, const.ROLE_TENANT_ADMIN, const.ROLE_MANAGER))

        query = '''mutation ($pk:uuid!, $userId:String!) {
            update_configuration(
                where:{
                    id:{_eq:$pk}
                    is_deleted:{_eq:false}
                    project:{
                        userProjects: {user_id: {_eq:$userId}},
                        is_deleted: {_eq:false}
                    }
                },
                _set: {is_deleted:true}
            ) {
                affected_rows
                returning { id name type_slug project_id test_source_id } 
            }
        }'''

        query_response = hce(current_app.config, query, {
            'pk': str(pk),
            'userId': user_id,
        })
        assert query_response['update_configuration'] and query_response['update_configuration']['affected_rows'] == 1, \
            f'configuration not found ({str(query_response)})'

        return gql_util.OutputValueFromFactory(Delete, query_response['update_configuration'])
