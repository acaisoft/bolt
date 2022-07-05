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

# REGION BUILDERS
def report_model(config_data, date, time_svg, requests, execution_id, notes, metrics_svg, distribution):
    return {'config': config_data_model(config_data['configuration_snapshot']),
            'time_plots': time_svg,
            'date': date,
            'url': f'http://console.bolt.acaisoft.io/projects/'
                   f'{config_data["configuration_snapshot"]["project_id"]}/configs/'
                   f'{config_data["configuration_id"]}/runs/'
                   f'{execution_id}',
            'notes': notes,
            'distribution': distribution,
            'requests': requests,
            'id': execution_id,
            'metrics_plots': metrics_svg
            }


def config_data_model(config_data):
    return {'name': config_data['name'],
            'params': list_of_params(config_data),
            'source': config_data['test_source']['repository']['url'],
            'envvars': list_of_envars(config_data)}


def request_data_model(request_data, pie_svg, distribution_svg):
    return {
        'name': request_data['name'],
        'method': request_data['method'],
        'req_second': request_data['requests_per_second'],
        'total': request_data['num_requests'],
        'min_time_label': seconds_form(request_data['min_response_time']),
        'max_time_label': seconds_form(request_data['max_response_time']),
        'avg_time_label': seconds_form(request_data['average_response_time']),
        'pie_svg': pie_svg,
        'distribution_svg': distribution_svg,
        'errors': request_data['errors']
    }


# ENDREGION

# REGION UTILS
def seconds_form(value):
    if value > 1000:
        return f'{value / 1000} s.'
    else:
        return f'{value} ms.'


def list_of_envars(cd):
    return {ev['name']: ev['value'] for ev in cd['configuration_envvars']} if len(
        cd['configuration_envvars']) > 0 else None


def list_of_params(conf):
    cp = conf['configuration_parameters']
    params = {'load': {}, 'pre': {}, 'post': {}, 'monitoring': {}}
    if conf['has_load_tests']:
        params['load']['duration'] = list(filter(lambda d: d['parameter_slug'] in 'load_tests_duration', cp))[0][
            'value']
        params['load']['rampup'] = list(filter(lambda d: d['parameter_slug'] in 'load_tests_rampup', cp))[0]['value']
        params['load']['users'] = list(filter(lambda d: d['parameter_slug'] in 'load_tests_users', cp))[0]['value']
        params['load']['host'] = list(filter(lambda d: d['parameter_slug'] in 'load_tests_host', cp))[0]['value']
    else:
        del (params['load'])
    if conf['has_monitoring']:
        params['monitoring']['duration'] = list(filter(lambda d: d['parameter_slug'] in 'monitoring_duration', cp))[0][
            'value']
        params['monitoring']['interval'] = list(filter(lambda d: d['parameter_slug'] in 'monitoring_interval', cp))[0][
            'value']
    else:
        del (params['monitoring'])
    if conf['has_pre_test']:
        params['pre'] = "TODO"
    else:
        del (params['pre'])
    if conf['has_post_test']:
        params['post'] = "TODO"
    else:
        del (params['post'])
    return params

# ENDREGION
