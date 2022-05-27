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

import os

import graphene
from flask import current_app

from services import const, gql_util, testruns


class TestrunStartInterface(graphene.Interface):
    """Holds testrun_start response."""
    execution_id = graphene.UUID(description='id of started execution')
    hasura_token = graphene.String(description='jon auth token')


class TestrunStartObject(graphene.ObjectType):
    class Meta:
        interfaces = (TestrunStartInterface,)


class TestrunStart(graphene.Mutation):
    """Starts tests for given configuration. Returns id of "execution" entry to track tests progress.
    Call testrun_status to check on job progress.
    """
    class Arguments:
        conf_id = graphene.UUID(required=True, description='configuration to start tests for')
        no_cache = graphene.Boolean(required=False, description='ignore caches')
        debug = graphene.Boolean(required=False, description='use debugging tokens')

    Output = TestrunStartInterface

    def mutate(self, info, conf_id, no_cache=False, debug=False):
        role, user_id = gql_util.get_request_role_userid(
            info, (const.ROLE_ADMIN, const.ROLE_TENANT_ADMIN, const.ROLE_MANAGER, const.ROLE_TESTER))

        if debug and role == const.ROLE_ADMIN:
            os.environ['SELFSIGNED_TOKEN_FOR_TESTRUNNER'] = "1"

        execution_id, hasura_token = testruns.start(current_app.config, str(conf_id), user_id, no_cache)

        out = TestrunStartObject(execution_id=execution_id)
        if debug and role == const.ROLE_ADMIN:
            os.unsetenv('SELFSIGNED_TOKEN_FOR_TESTRUNNER')

        if role == const.ROLE_ADMIN:
            out.hasura_token = hasura_token
        return out
