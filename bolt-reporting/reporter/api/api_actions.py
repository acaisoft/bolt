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

from time import sleep

import requests
from api.query_builder import *


class APIClient:

    def __init__(self, url: str, token: str):
        self.SESSION = requests.Session()
        self.URL = url
        self.SESSION.headers['Content-Type'] = 'application/json'
        self.SESSION.headers['authorization'] = f'Bearer {token}' if not token.startswith('Bearer ') else token

    def logout(self):
        del self.SESSION.headers['x-hasura-access-key']
        del self.SESSION.headers['X-Hasura-User-ID']

    def finish(self):
        self.SESSION.close()

    def __graphQL(self, payload):
        r = self.SESSION.post(self.URL, json=payload).json()
        if 'errors' in r:
            raise Exception(r['errors'][0]['message'])
        return r

    def get_execution_endpoints(self, execution_id):
        print('Get execution data started.')
        data = self.__graphQL(payload=execution_endpoints(execution_id))
        print('Get execution data ended.')
        return data

    def get_endpoint_errors(self, execution_id):
        data = self.__graphQL(payload=endpoint_errors(execution_id))
        return data

    def get_request_distribution(self, request_id):
        print('Get distribution data started.')
        data = self.__graphQL(payload=endpoint_distribution(request_id))
        print('Get distribution data ended.')
        return data

    def get_errors_details(self, execution_id):
        print('Get errors data started.')
        data = self.__graphQL(payload=errors_query(execution_id))
        print('Get errors data ended.')
        return data

    def get_execution_results(self, execution_id):
        print('Get results data started.')
        data = self.__graphQL(payload=execution_results(execution_id))
        print('Get results data ended.')
        return data

    def get_execution_config(self, execution_id):
        print('Get config data started.')
        data = self.__graphQL(payload=execution_config(execution_id))
        print('Get config data ended.')
        return data


    def get_execution_metrics(self, execution_id):
        return self.__graphQL(payload=execution_metrics(execution_id))

    def get_execution_metrics_metadata(self, execution_id):
        print('Get metrics metadata started.')
        data = self.__graphQL(payload=execution_metrics_metadata(execution_id))
        print('Get metrics metadata ended.')
        return data

    def update_report_status(self, execution_id, status):
        print(f'Setting report generation status for {execution_id} to {status}')
        self.__graphQL(payload=set_report_generation_status(execution_id, status))
