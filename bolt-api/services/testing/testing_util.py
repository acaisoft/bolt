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

    recorded_project_id = 'daf50e01-4037-4587-8305-2523dad5ebfd'
    recorded_repo_id = 'daf50e01-4037-4587-8305-2523dad5ebfd'
    recorded_config_id = '6535ab77-78cf-4953-bad7-5e11cea8fbf1'
    recorded_cloned_config_id = 'bb56e2c4-e1d9-4bcb-aeb1-8ff915f7cb18'
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

    def generate_hasura_token(self, *args, **kwargs):
        return 'test_token', self.recorded_execution_id

    @contextmanager
    def patch(self, name: str):
        """
        Wraps mock method to clean up long, absolute package paths from tests
        """
        mocks = {
            'workflows': (
                'kubernetes.client.api.custom_objects_api.CustomObjectsApi.create_namespaced_custom_object',
                self.create_namespaced_custom_object
            ),
            'token': (
                'services.hasura.hasura.generate_hasura_token',
                self.generate_hasura_token
            ),
            'storage_gcp': (
                'cloudstorage.drivers.google.GoogleStorageDriver',
                get_storage_client_prototype(f'reports/{self.recorded_execution_id}.pdf')
            )
        }
        with mock.patch(*mocks.get(name, None)) as m:
            yield m
