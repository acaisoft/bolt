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
import json

from flask import current_app
from services import gql_util
from services.hasura import hce
from apps.bolt_api.app.appgraph.argo.parser import ArgoFlowParser


class ExecutionLogInterface(graphene.Interface):
    data = graphene.JSONString()
    argo_id = graphene.String()


class CreateExecutionLog(graphene.Mutation):

    class Arguments:
        data = graphene.JSONString()
        argo_id = graphene.String()

    Output = gql_util.OutputInterfaceFactory(ExecutionLogInterface, 'Create')

    @staticmethod
    def validate(argo_id):
        assert type(argo_id) is str, 'argo_id must be string'

    def mutate(self, info, data, argo_id):
        CreateExecutionLog.validate(argo_id)
        query = '''
            mutation ($data: json, $argo_id: String) {
                insert_argo_execution_log (objects: [{data: $data, argo_id: $argo_id}]){
                    affected_rows
                }
            }
        '''
        if type(data) is str:
            data = json.loads(data)
        hce(current_app.config, query, variable_values={'data': data, 'argo_id': argo_id})
        try:
            parser = ArgoFlowParser(argo_id=argo_id)
            parser.parse_argo_statuses(data)
        except Exception:
            pass
        return gql_util.OutputValueFromFactory(CreateExecutionLog, {'returning': [{}]})
