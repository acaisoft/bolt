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

from services.hasura import hce
from services.testing.testing_util import BoltCase


class TestReportGenerator(BoltCase):
    def test_generate_report(self):
        with (
            self.patch('workflows_create'),
            self.patch('token'),
            self.patch('storage_gcp')
        ):
            resp = self.gql_client('''mutation ($id: UUID!) {
                testrun_get_report(execution_id: $id) {
                    __typename
                    data
                }
            }''', {
                'id': self.recorded_execution_id
            })
            self.assertIsNone(resp.errors(), 'expected no errors')
            hce_resp = hce(self.application.config, '''query ($id: uuid!) {
                execution_by_pk(id: $id) {
                    report
                }
            }''', {
                'id': self.recorded_execution_id
            })
            hce_out = hce_resp['execution_by_pk']
            self.assertEqual(hce_out['report'], 'generating', 'Report generation was not triggered')

    def test_download_existing_report(self):
        with (
            self.patch('storage_gcp')
        ):
            resp = self.gql_client('''mutation ($id: UUID!) {
                testrun_get_report(execution_id: $id) {
                    data
                }
            }''', {
                'id': self.recorded_execution_id
            })
            self.assertIsNone(resp.errors(), 'expected no errors')
            self.assertEqual(resp.json()['data']['testrun_get_report']['data'], 'This is download URL',
                             'Download URL was not returned.')

    def test_download_missing_exc_report(self):
        with (
            self.patch('storage_gcp')
        ):
            resp = self.gql_client('''mutation ($id: UUID!) {
                testrun_get_report(execution_id: $id) {
                    data
                }
            }''', {
                'id': self.nonexistent_item
            })
            self.assertEqual(f'Execution {self.nonexistent_item} not found.', resp.errors()[0]['message'])
