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

from flask import Blueprint, request, jsonify, current_app

from services import const
from services.hasura import hce
from services.logger import setup_custom_logger

logger = setup_custom_logger(__file__)

bp = Blueprint('webhooks_execution', __name__)


@bp.route('/update', methods=['POST'])
def execution_update():
    req_body = request.get_json()
    event = req_body.get('event')
    assert event and event.get('op') == 'UPDATE', f'invalid event input: {str(event)}'
    new = event.get('data', {}).get('new')
    if new.get('status') in (const.TESTRUN_FINISHED, const.TESTRUN_SUCCEEDED,
                             const.TESTRUN_FAILED, const.TESTRUN_ERROR, const.TESTRUN_TERMINATED):
        # mark as performed successfully
        resp = hce(current_app.config, '''mutation ($confId:uuid!) {
            update_configuration(_set:{performed:true}, where:{id:{_eq:$confId}}) { affected_rows }
            update_test_creator(where:{test_sources:{configurations:{id:{_eq:$confId}}}}, _set:{performed:true}) { affected_rows }
            update_repository(where:{test_sources:{configurations:{id:{_eq:$confId}}}}, _set:{performed:true}) { affected_rows }
        }''', {'confId': new.get('configuration_id')})
        assert resp['update_configuration'].get('affected_rows') is not None, f'unexpected error: {str(resp)}'
        # calculate request totals now
        err = update_execution_totals_per_request(current_app.config, new.get('id'))
        if err is None:
            update_execution_totals(current_app.config, new.get('id'))
    return jsonify({})


def update_execution_totals_per_request(config, execution_id):
    # copy last entry of each execution_request to execution_request_totals (they're incremental data)
    resp = hce(config, '''query ($eid:uuid!) {
    execution_by_pk(id:$eid) {
        execution_requests (
          distinct_on:identifier
          order_by:{identifier:asc, timestamp:desc}
        ) 
        {
          execution_id, identifier, timestamp, method, name,
          average_content_size, average_response_time, 
          max_response_time, median_response_time, 
          min_response_time, num_failures, num_requests, requests_per_second
        }
      }
    }''', variable_values={'eid': execution_id})
    err = resp.get('errors', None)
    if err is not None:
        logger.error(f'error fetching execution_requests by max timestamp: {str(err)}')
        return err

    data = resp['execution_by_pk']['execution_requests']
    if not data:
        return False

    totals_response = hce(config, '''mutation ($data:[execution_request_totals_insert_input!]!) {
        insert_execution_request_totals(
            objects: $data,
            on_conflict: {
                constraint: execution_request_totals_pkey
                update_columns: [
                    average_content_size, average_response_time, max_response_time, median_response_time, 
                    min_response_time, num_failures, num_requests, requests_per_second, timestamp
                ]
            }
        ) { affected_rows }
    }''', variable_values={'data': data})
    err = totals_response.get('errors', None)
    if err is not None:
        logger.error(f'error inserting execution_request_totals: {str(err)}')
        return err

    return None


def update_execution_totals(config, execution_id):
    # aggregate execution_request_totals into execution fields
    response = hce(current_app.config, '''query ($execution_id:uuid!) {
        execution_request_totals_aggregate(where:{execution_id:{_eq:$execution_id}}){
            aggregate {
                sum {num_requests}
                sum {num_failures}
                sum {requests_per_second}
                avg {average_response_time}
                min {min_response_time}
                max {max_response_time}
            }
        }
    }''', variable_values={
        'execution_id': execution_id,
    })
    err = response.get('errors', None)
    if err is not None:
        logger.error(f'error calculating request totals on execution: {str(err)}')
        return err

    aggs = response['execution_request_totals_aggregate']['aggregate']
    total = aggs['sum']['num_requests']
    fails = aggs['sum']['num_failures']

    if total is not None or fails is not None:
        response = hce(current_app.config, '''mutation (
            $execution_id:uuid!, 
            $total_requests:Int!, 
            $passed_requests:Int!, 
            $failed_requests:Int!,
        ) {
            update_execution(
                where:{id:{_eq:$execution_id}}
                _set:{
                    total_requests: $total_requests
                    passed_requests: $passed_requests
                    failed_requests: $failed_requests
                }
            ) { affected_rows }
        }''', variable_values={
            'execution_id': execution_id,
            'total_requests': total,
            'failed_requests': fails,
            'passed_requests': int(total) - int(fails),
        })
        return response.get('errors', None)
