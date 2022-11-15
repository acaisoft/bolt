import uuid
from unittest import mock

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
