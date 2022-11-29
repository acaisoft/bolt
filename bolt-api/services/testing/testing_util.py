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

import json
import logging
import os
from contextlib import contextmanager
from unittest import mock
from uuid import UUID

import sys
import unittest

import vcr
from werkzeug.test import Client
from werkzeug.wrappers import Response

from apps.bolt_api.app import create_app
from services import const
from unittests.fixtures.data.test_storage_client import get_storage_client_prototype

logging.basicConfig()
vcr_log = logging.getLogger("vcr")
vcr_log.setLevel(logging.INFO)


class BoltResponse(Response):
    """
    Helper for parsing graphql responses.
    """

    def json(self):
        return json.loads(self.data)

    def errors(self):
        return self.json().get('errors', None)

    def one(self, query_name):
        """helper returning first entry from 'repsonse.data.<query_name>.returning' """
        return self.returning(query_name)[0]

    def returning(self, query_name):
        """helper returning contents from 'repsonse.data.<query_name>.returning' """
        return self.json()['data'][query_name]['returning']


class BoltCase(unittest.TestCase):
    """
    Testcase with vcr and custom graphql client.
    To record responses Hasura must be up and running in development mode.
    """

    recorded_project_id = '26ae0b53-a9e5-41f9-8804-9f7e06f923b0'
    recorded_repo_id = '26ae0b53-a9e5-41f9-8804-9f7e06f923b0'
    recorded_config_id = '790b386a-51e0-4f6a-96db-52a3ac7b82e8'
    recorded_cloned_config_id = '14e1dbd0-512a-48ee-b7fd-ff5bcc562914'
    recorded_e2e_config_id = 'd66341eb-099a-4138-817a-24a4c589377d'
    recorded_e2e_run_id = 'bea05e03-aa11-43ea-a390-a2ea774a4b5d'
    recorded_execution_id = '0765dd5e-61b1-11ed-811c-000c299af887'
    nonexistent_item = '96e1223c-8dc3-486a-881a-776952454cd4'
    user_role = const.ROLE_ADMIN

    def setUp(self) -> None:
        super().setUp()
        # setup flask client
        os.environ["SECRETS_FILE_PATH"] = "../unittests/fixtures/data/test_secrets.py"
        self.application = create_app(test=True)
        self.application.secret_key = 'secret'
        self.application.config['SESSION_TYPE'] = 'filesystem'
        self.client = Client(application=self.application, response_wrapper=BoltResponse)
        # setup vcr context manager
        self.vcr_cassette_name = f'{self.__class__.__name__}.{self._testMethodName}.yaml'
        _vcr = vcr.VCR(
            serializer='yaml',
            cassette_library_dir=self.cassette_path(),
            record_mode='once',
            match_on=['uri', 'method', 'raw_body'],
            filter_headers=['authorization'],
            decode_compressed_response=True
        ).use_cassette(self.vcr_cassette_name)
        self.vcr = _vcr.__enter__()
        self.addCleanup(_vcr.__exit__)

    def gql_client(self, query, qargs):
        """
        Helper utility for sending authenticated graphql requests to flask app over werkzeug client.
        """
        body = {
            'query': query,
            'variables': qargs
        }
        headers = {
            'X-Hasura-Access-Key': const.HASURA_DEVELOPMENT_ACCESS_KEY,
            'X-Hasura-User-Id': const.HASURA_CLIENT_USER_ID,
            'X-Hasura-Role': self.user_role,
        }
        response = self.client.post(
            path='/graphql',
            headers=headers,
            content_type='application/json',
            data=json.dumps(body),
            environ_overrides={const.SELFTEST_FLAG: const.SELFTEST_FLAG},
        )
        print(response)
        print(response.json())
        return response

    def cassette_path(self):
        parent_here = os.path.dirname(os.path.abspath(sys.modules[self.__class__.__module__].__file__))
        return os.path.join(parent_here, 'fixtures')

    # Mocks, fakes and patches
    @staticmethod
    def get_current_datetime():
        return '00/00/0000 - 00:00:00'

    @staticmethod
    def create_namespaced_custom_object(*args, **kwargs):
        return {
            "metadata": {"name": "bolt-0000"}
        }

    @staticmethod
    def delete_namespaced_pod(*args, **kwargs):
        return {}

    @staticmethod
    def list_namespaced_pod(*args, **kwargs):
        class Structure:
            def __init__(self, entries):
                self.__dict__.update(entries)
        pods = {
            "items": [
                {
                    "metadata": {
                        "name": "worker",
                        "labels": {}
                    },
                    "status": {
                        "phase": "RUNNING"
                    }
                },
                {
                    "metadata": {
                        "name": "worker",
                        "labels": {}
                    },
                    "status": {
                        "phase": "TEARING_DOWN"
                    }
                },
                {
                    "metadata": {
                        "name": "master",
                        "labels": {}
                    },
                    "status": {
                        "phase": "RUNNING"
                    }
                }
            ]
        }
        pods_obj = json.loads(json.dumps(pods), object_hook=Structure)
        pods_obj.items[0].metadata.labels = {"prevent-bolt-termination": "true"}
        pods_obj.items[1].metadata.labels = {"prevent-bolt-termination": "false"}
        pods_obj.items[2].metadata.labels = {"prevent-bolt-termination": "false"}
        return pods_obj

    def generate_hasura_token(self, *args, **kwargs):
        return 'test_token', self.recorded_execution_id

    def fake_uuid_factory(self, uuid_values: list[UUID]):
        class FakeUUID:
            def __init__(self, values):
                self._index = 0
                self.values = values

            def uuid4(self):
                faked = self.values[self._index]
                self._index += 1
                return faked
        return FakeUUID(uuid_values)

    @contextmanager
    def patch(self, name: str, uuids=None):
        """
        Wraps mock method to clean up long, absolute package paths from tests
        """
        mocks = {
            'workflows_create': (
                'kubernetes.client.api.custom_objects_api.CustomObjectsApi.create_namespaced_custom_object',
                self.create_namespaced_custom_object
            ),
            'workflows_list_pods': (
                'kubernetes.client.api.core_v1_api.CoreV1Api.list_namespaced_pod',
                self.list_namespaced_pod
            ),
            'workflows_terminate': (
                'kubernetes.client.api.core_v1_api.CoreV1Api.delete_namespaced_pod',
                self.delete_namespaced_pod
            ),
            'token': (
                'services.hasura.hasura.generate_hasura_token',
                self.generate_hasura_token
            ),
            'storage_gcp': (
                'cloudstorage.drivers.google.GoogleStorageDriver',
                get_storage_client_prototype(f'reports/{self.recorded_execution_id}.pdf')
            ),
            'junit_parser': (
                'apps.bolt_api.app.external_tests.parsers.junit_parser.uuid',
                self.fake_uuid_factory(uuids)
            )
        }
        with mock.patch(*mocks.get(name, None)) as m:
            yield m
