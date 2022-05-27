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

from services import const, gql_util
from apps.bolt_api.app.appgraph.users import types
from services.user_management import user_management


class UserAddRole(graphene.Mutation):
    """Grant given user given role"""

    class Arguments:
        user_id = graphene.UUID()
        roles = graphene.List(
            graphene.String,
            description='List of new user roles.')

    Output = gql_util.OutputInterfaceFactory(types.UserInterface, 'Roles')

    def mutate(self, info, user_id, roles):
        req_role, req_user_id = gql_util.get_request_role_userid(info, (const.ROLE_ADMIN, const.ROLE_TENANT_ADMIN))

        for r in roles:
            assert r in const.ROLE_CHOICE, f'invalid role: {r}'

        user_id = str(user_id)
        user_data = user_management.user_roles_update(user_id, roles)
        return gql_util.OutputValueFromFactory(UserAddRole, {'returning': [user_data]})