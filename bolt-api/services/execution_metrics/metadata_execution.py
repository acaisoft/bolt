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

from math import ceil
from services.hasura import hce
from services import const


def _even_select(sequence, num):
    length = len(sequence)
    if length > num:
        seq_no_first_last = sequence[1:-1]
        return [sequence[0]] + [seq_no_first_last[int(ceil(i * length / num))] for i in range(num - 2)] + [sequence[-1]]
    else:
        return sequence


def _filter_points(data):
    try:
        metrics_data = data['execution_metrics_metadata'][0]['execution']['execution_metrics_data']
    except LookupError:
        return []
    filtered_metrics_data = _even_select(metrics_data, const.MAX_GRAPH_POINTS)
    return filtered_metrics_data


def get_executions_by_execution_id(config, execution_id):
    query = '''query ($eid: uuid!) {
      execution_metrics_metadata(where: {execution_id: {_eq: $eid}}) {
        execution {
          execution_metrics_data(order_by: {timestamp: asc}) {
            data
          }
        }
      }
    }
    '''

    query_params = {'eid': str(execution_id),}

    resp = hce(config,  query, query_params)

    metrics_data = _filter_points(resp)

    return metrics_data


def get_executions_by_execution_id_by_timestamp(config, execution_id, start, end):
    query = '''query ($eid: uuid!, $start: timestamptz!, $end: timestamptz!) {
      execution_metrics_metadata(where: {execution_id: {_eq: $eid}}) {
        execution {
          execution_metrics_data(order_by: {timestamp: asc}, where: {timestamp: {_gte: $start, _lte: $end}}) {
            data
          }
        }
      }
    }
    '''

    query_params = {
        'eid': str(execution_id),
        'start': str(start),
        'end': str(end),
    }

    resp = hce(config, query, query_params)

    metrics_data = _filter_points(resp)

    return metrics_data
