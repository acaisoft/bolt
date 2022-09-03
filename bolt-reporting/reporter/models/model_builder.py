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

from api.api_actions import APIClient
from models.report_models import request_data_model, report_model
from plots.plot_builder import single_execution_plots_svg, request_distribution_svg, request_success_ratio_svg, \
    metrics_svg_plots, endpoint_details_svg
from dateutil import parser


def get_metrics_data(execution_id: str, api: APIClient):
    print('Get metrics data started.')
    metrics_data = api.get_execution_metrics(execution_id)['data']['execution_metrics_data']
    for md in metrics_data:
        md['data']['timestamp'] = md['timestamp']
    print('Get metrics data ended.')
    return metrics_data


def prepare_single_execution_model(execution_id: str, api: APIClient, notes=None, metrics_charts=None):
    # REGION GETTING DATA
    requests_data = api.get_execution_endpoints(execution_id)['data']['execution_request_totals']
    #requests_errors = api.get_endpoint_errors(execution_id)['data']['result_error']
    distribution_data = {
        r['identifier']: api.get_request_distribution(r['identifier'])['data']['execution_distribution']
        for r in requests_data}
    detailed_endpoint_data = api.get_detailed_endpoint_data(execution_id)['data']['execution_requests']
    errors_cumulated_data = api.get_errors_details(execution_id)['data']['execution_errors']
    exec_users_data = api.get_execution_results(execution_id)['data']['result_aggregate']
    config_data = api.get_execution_config(execution_id)['data']['execution_by_pk']
    if metrics_charts:
        metrics_data = get_metrics_data(execution_id)
        metrics_meta_data = api.get_execution_metrics_metadata(execution_id)['data']['execution_metrics_metadata'][0][
            'chart_configuration']
        metrics_svg = metrics_svg_plots(metrics_data, metrics_meta_data, metrics_charts)
    else:
        metrics_svg = None

    # Uncomment it when DB will be ready
    # errors_in_time_data = {
    #    r['identifier']: API.get_endpoint_failures_in_time(r['identifier']).JSON for r in requests_data
    # }
    # ENDREGION
    time_svg = single_execution_plots_svg(exec_users_data)
    requests = [
        prepare_request_model(
            r, distribution_data[r['identifier']][0], errors_cumulated_data, detailed_endpoint_data
        ) for r in requests_data
    ]
    start_date = parser.parse(exec_users_data[0]['timestamp']).strftime("%Y/%m/%d, %H:%M:%S")
    return report_model(config_data=config_data, date=start_date, time_svg=time_svg, requests=requests,
                        execution_id=execution_id, notes=notes, metrics_svg=metrics_svg,
                        distribution=[v[0] for k, v in distribution_data.items()])


def prepare_request_model(request_data, distribution_data, errors_data, detailed_endpoint_data):
    request_data['distribution'] = distribution_data
    request_data['errors'] = filter_request_errors(request_data, errors_data)
    request_data['detailed'] = filter_detailed_data(request_data, detailed_endpoint_data)
    return request_data_model(
        request_data,
        request_success_ratio_svg(request_data),
        request_distribution_svg(request_data),
        endpoint_details_svg(request_data)
    )


# REGION UTILS
def filter_request_errors(rd, errors):
    request_errors = list(filter(lambda x: x['method'] == rd['method'] and x['name'] == rd['name'], errors))
    total = sum([e['number_of_occurrences'] for e in request_errors])
    for e in request_errors:
        e['percent'] = round((e['number_of_occurrences'] / total) * 100, 2)
    return request_errors


def filter_detailed_data(rd, details):
    endpoint_details = list(filter(lambda x: x['method'] == rd['method'] and x['name'] == rd['name'], details))
    return endpoint_details

# ENDREGION
