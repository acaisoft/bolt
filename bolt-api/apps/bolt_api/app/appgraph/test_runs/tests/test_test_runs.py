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

from services import const
from services.testing.testing_util import BoltCase


class TestTestRunsMutations(BoltCase):

    def setUp(self) -> None:
        super().setUp()
        # disable keycloack integration as that communication returns random ids not suitable for vcr
        os.environ['SELFSIGNED_TOKEN_FOR_TESTRUNNER'] = '1'
        os.environ['SELFSIGNED_TOKEN_EXECUTION_ID'] = self.recorded_execution_id

    def tearDown(self) -> None:
        os.unsetenv('SELFSIGNED_TOKEN_FOR_TESTRUNNER')
        os.unsetenv('SELFSIGNED_TOKEN_EXECUTION_ID')

    def test_start_test_run(self):
        """Check that starting a run goes through all the motions."""
        resp = self.gql_client('''mutation ($conf_id:UUID!) {
            testrun_start (
                conf_id:$conf_id
                debug:true
            ) { execution_id hasura_token }
        }''', {'conf_id': self.recorded_config_id})
        self.assertIsNone(resp.errors(), 'expected no errors')
        out = resp.json()['data']['testrun_start']
        self.assertEqual(out['execution_id'], self.recorded_execution_id)
        self.assertTrue(self.vcr.all_played, 'not all expected requests have been made')

    def test_status(self):
        resp = self.gql_client('''query ($exid:UUID!) {
              testrun_status(execution_id:$exid) { status }
        }''', {'exid': self.recorded_execution_id})
        self.assertIsNone(resp.errors(), 'expected no errors')
        self.assertEqual(resp.json()['data']['testrun_status']['status'], const.TESTRUN_PREPARING)

    def test_testrun_repository_key(self):
        resp = self.gql_client('''query {
            testrun_repository_key
        }''', None)
        self.assertIsNone(resp.errors(), 'expected no errors')
        self.assertTrue(resp.json()['data']['testrun_repository_key'].startswith('ssh-rsa AAAA'), 'expected ssh key')
