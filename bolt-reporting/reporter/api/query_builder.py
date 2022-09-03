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

def query(query_content):
    return {'query': f'{query_content}'}


def prepare_fields(fields):
    return f'{{{",".join(fields)}}}'


def query_content(fields, table, conditions):
    return f'query {{{table}({conditions}){prepare_fields(fields)}}}'


def execution_endpoints(ex_id):
    fields = ['identifier', 'method', 'name', 'timestamp', 'requests_per_second',
              'num_failures', 'num_requests', 'num_requests', 'min_response_time', 'average_response_time',
              'max_response_time']
    table = 'execution_request_totals'
    conditions = f'where: {{execution_id: {{_eq: "{ex_id}"}}}}'
    return query(query_content(fields=fields, table=table, conditions=conditions))


def endpoint_errors(ex_id):
    fields = ['error_type', 'name', 'number_of_occurrences']
    table = 'result_error'
    conditions = f'where: {{execution_id: {{_eq: "{ex_id}"}}}}'
    return query(query_content(fields=fields, table=table, conditions=conditions))


def detailed_endpoint_data(ex_id):
    fields = ['timestamp', 'identifier', 'name', 'method', 'average_response_time', 'min_response_time',
              'max_response_time', 'total_content_length', 'num_requests', 'id']
    table = 'execution_requests'
    conditions = f'where: {{execution_id: {{_eq: "{ex_id}"}}}}'
    return query(query_content(fields=fields, table=table, conditions=conditions))


def endpoint_distribution(request_id):
    fields = ['p100', 'p50', 'p66', 'p75', 'p80', 'p90', 'p95', 'p98', 'p99', 'method', 'name']
    table = 'execution_distribution'
    conditions = f'where: {{identifier: {{_eq: "{request_id}"}}}} limit: 1, order_by: {{timestamp: desc}}'
    return query(query_content(fields=fields, table=table, conditions=conditions))


def errors_query(execution_id):
    fields = ['id', 'number_of_occurrences', 'name', 'method', 'exception_data', 'timestamp']
    table = 'execution_errors'
    conditions = f'where: {{execution_id: {{_eq: "{execution_id}"}}}}, ' \
                 f'order_by: {{timestamp: asc}}'
    return query(query_content(fields=fields, table=table, conditions=conditions))


def execution_results(execution_id):
    fields = ['number_of_fails', 'number_of_successes', 'number_of_users', 'average_response_time', 'timestamp']
    table = 'result_aggregate'
    conditions = f'where: {{execution_id: {{_eq: "{execution_id}"}}}}, order_by: {{timestamp: asc}}'
    return query(query_content(fields=fields, table=table, conditions=conditions))


def execution_config(execution_id):
    fields = ['configuration_id', 'configuration_snapshot']
    table = 'execution_by_pk'
    conditions = f'id: "{execution_id}"'
    return query(query_content(fields=fields, table=table, conditions=conditions))


def execution_metrics(execution_id):
    fields = ['data', 'timestamp']
    table = 'execution_metrics_data'
    conditions = f'where: {{execution_id: {{_eq: "{execution_id}"}}}}'
    return query(query_content(fields=fields, table=table, conditions=conditions))


def execution_metrics_metadata(execution_id):
    fields = ['chart_configuration']
    table = 'execution_metrics_metadata'
    conditions = f'where: {{execution_id: {{_eq: "{execution_id}"}}}}'
    return query(query_content(fields=fields, table=table, conditions=conditions))


def set_report_generation_status(ex_id, status):
    mutation_content = f'''
        mutation update {{
          update_execution_by_pk(pk_columns: {{id: "{ex_id}"}}, _set: {{report: "{status}"}}) {{
            id
          }}
        }}'''
    return query(mutation_content)
