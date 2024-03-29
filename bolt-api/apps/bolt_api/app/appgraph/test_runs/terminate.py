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
import requests

from flask import current_app

from apps.bolt_api.app.workflow import KubernetesService, WorkflowsResource
from services import const, gql_util
from services.hasura import hce
from services.logger import setup_custom_logger

logger = setup_custom_logger(__file__)


class TestrunTerminateInterface(graphene.Interface):
    message = graphene.String(description='message with text status')
    ok = graphene.Boolean(description='boolean status true | false')


class TestrunTerminateObject(graphene.ObjectType):
    class Meta:
        interfaces = (TestrunTerminateInterface,)


class TestrunTerminate(graphene.Mutation):
    class Arguments:
        argo_name = graphene.String(required=True)

    Output = TestrunTerminateInterface

    @staticmethod
    def terminate_flow(argo_name):
        try:
            workflow = WorkflowsResource(KubernetesService(current_app.config))
            workflow.terminate(argo_name)
            logger.info(f'Workflow {argo_name} was successfully terminated.')
            return True, 'Workflow was successfully terminated'
        except Exception as ex:
            logger.info(f'Error during terminating workflow. {ex}')
            return False, f'Error during terminating workflow. {ex}'

    @staticmethod
    def update_execution_status(argo_name):
        query = '''
            mutation ($argo_name: String, $status: String) {
                update_execution(where: {argo_name: {_eq: $argo_name}}, _set: {status: $status}) {
                    affected_rows
                }
            }
        '''
        response = hce(current_app.config, query, {'argo_name': argo_name, 'status': 'TERMINATED'})
        try:
            rows_updated = response['update_execution']['affected_rows']
            logger.info(f'Updated rows during terminating: {rows_updated}')
            return True if rows_updated == 1 else False
        except KeyError:
            logger.exception(f'Error during updating execution status (TERMINATE)')
            return False

    def mutate(self, info, argo_name):
        role, user_id = gql_util.get_request_role_userid(
            info, (const.ROLE_ADMIN, const.ROLE_TENANT_ADMIN, const.ROLE_MANAGER, const.ROLE_TESTER))
        # TestrunTerminate.validate_user_assigned_to_project(argo_name, user_id)
        logger.info(f'Executed mutation `testrun_terminate` | {argo_name} | {role} | {user_id}')
        TestrunTerminate.update_execution_status(argo_name)
        ok, message = TestrunTerminate.terminate_flow(argo_name)
        out = TestrunTerminateObject(message=message, ok=ok)
        return out
