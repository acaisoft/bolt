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

from services import gql_util, const
from services.execution_metrics.metadata_execution import get_executions_by_execution_id, \
    get_executions_by_execution_id_by_timestamp


class ExecutionMetricsDataItem(graphene.ObjectType):
    data = graphene.JSONString()


class ExecutionMetricsDataResponse(graphene.ObjectType):
    metrics_data = graphene.List(ExecutionMetricsDataItem)


class ExecutionMetricsQueries(graphene.ObjectType):
    metrics_data_by_execution_id = graphene.Field(
        ExecutionMetricsDataResponse,
        execution_id=graphene.UUID(required=True),
    )

    metrics_data_by_execution_id_by_timestamp = graphene.Field(
        ExecutionMetricsDataResponse,
        execution_id=graphene.UUID(required=True),
        start=graphene.DateTime(required=True),
        end=graphene.DateTime(required=True),
    )

    def resolve_metrics_data_by_execution_id(self, info, execution_id):
        _ = gql_util.get_request_role_userid(info, const.ROLE_CHOICE)
        metrics_data = get_executions_by_execution_id(current_app.config, execution_id)

        out = [ExecutionMetricsDataItem(**i) for i in metrics_data]

        return ExecutionMetricsDataResponse(metrics_data=out)

    def resolve_metrics_data_by_execution_id_by_timestamp(self, info, execution_id, start, end):
        _ = gql_util.get_request_role_userid(info, const.ROLE_CHOICE)
        metrics_data = get_executions_by_execution_id_by_timestamp(current_app.config, execution_id, start, end)

        out = [ExecutionMetricsDataItem(**i) for i in metrics_data]

        return ExecutionMetricsDataResponse(metrics_data=out)
