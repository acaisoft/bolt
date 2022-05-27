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
from unittest.mock import create_autospec

import falcon
import pytest
from falcon import testing
from falcon.testing import Result

from src.app import create_app
from src.services import KubernetesServiceABC


@pytest.fixture(scope="module")
def kubernetes_service():
    return create_autospec(KubernetesServiceABC)


@pytest.fixture
def cli(kubernetes_service):
    app = create_app(kubernetes_service)
    return testing.TestClient(app)


def test_create_workflow_1(cli, kubernetes_service):
    data = {
        "tenant_id": "world-corp",
        "project_id": "test-project",
        "repository_url": "git@exmaple.git/repo/123",
        "branch": "master",
        "execution_id": "execution-identifier",
        "auth_token": "some_token",
        "duration_seconds": 123,
        "job_pre_start": {"env_vars": {"foo": "bar"}},
        "job_post_stop": {"env_vars": {"foo": "bar"}},
        "job_monitoring": {"env_vars": {"foo": "bar"}},
        "job_load_tests": {
            "env_vars": {"foo": "bar"},
            "workers": 5,
            "users": 10,
            "host": "google.com",
            "port": 8000,
        },
        "no_cache": True,
    }

    response: Result = cli.simulate_post("/workflows", body=json.dumps(data).encode())

    kubernetes_service.create_argo_workflow.assert_called_once()
    assert response.status == falcon.HTTP_OK
