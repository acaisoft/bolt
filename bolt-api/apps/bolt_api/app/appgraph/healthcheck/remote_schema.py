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


class RemoteSchemaInterface(graphene.Interface):
    state = graphene.String(description='Healthcheck response')


class RemoteSchemaResponse(graphene.ObjectType):
    class Meta:
        description = ''
        interfaces = (RemoteSchemaInterface,)


class RemoteSchemaQueries(graphene.ObjectType):
    """
    Used entirely to avoid remote schema mismatch due to known issue
    that causes Hasura to not retry initializing remote schema
    https://github.com/hasura/graphql-engine/issues/5126
    """

    remote_schema_healthcheck = graphene.Field(
        RemoteSchemaResponse,
        name='remote_schema_healthcheck',
        description='Dummy remote schema healthcheck.',
    )

    @staticmethod
    def resolve_remote_schema_healthcheck(self, info):

        return RemoteSchemaResponse(state='Alive')
