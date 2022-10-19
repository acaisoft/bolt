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
import datetime
import requests

GRAPHQL_URL = os.environ['BOLT_GRAPHQL_URL']
EXECUTION_ID = os.environ['BOLT_EXECUTION_ID']
HASURA_TOKEN = os.environ['BOLT_HASURA_TOKEN']


def send_stage_log(message, stage, level='info'):
    ts = datetime.datetime.utcnow().replace(tzinfo=datetime.timezone.utc).isoformat()
    query = '''
    mutation ($log_entry:execution_stage_log_insert_input!) {
        insert_execution_stage_log(objects:[$log_entry]) { affected_rows }
    }
    '''
    body = {
        'query': query,
        'variables': {
            'log_entry': {
                'timestamp': ts,
                'stage': stage,
                'level': level,
                'msg': message,
            }
        }
    }
    headers = {'Authorization': f'Bearer {HASURA_TOKEN}'}
    response = requests.post(GRAPHQL_URL, json=body, headers=headers)
    assert response.json().get('data') == {'insert_execution_stage_log': {'affected_rows': 1}}
    response.raise_for_status()


def set_execution_status(status):
    query = '''
        mutation ($id: uuid, $status: String) {
            update_execution (where: {id: {_eq: $id}}, _set: {status: $status}) {
                affected_rows
            }
        }
    '''
    body = {
        'query': query,
        'variables': {
            'id': EXECUTION_ID,
            'status': status.upper()
        }
    }
    headers = {'Authorization': f'Bearer {HASURA_TOKEN}'}
    response = requests.post(GRAPHQL_URL, json=body, headers=headers)
    assert response.json().get('data') == {'update_execution': {'affected_rows': 1}}
    response.raise_for_status()
