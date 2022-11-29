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

from pytest import fixture
from requests import HTTPError

from apps.bolt_api.app.remote_schema_check import HEALTHY_REMOTE_SCHEMA
from .hasura_handler import hasura_handler, RemoteSchemaHandler
from .hasura_handler import get_error as hasura_error
from .test_const import ERROR_MESSAGE_AUTH0, ERROR_MESSAGE_HASURA


def auth0_get_token(request, context, **kwargs):
    return {
        "access_token": "legitimate_token"
    }


auth0_identity = {
    "user_id": "test_id",
    "identities": [
        {
            "connection": "google-oauth2"
        }
    ]
}

auth0_multiple_google_acc = [
    auth0_identity,
    auth0_identity
]

auth0_single_google_acc = [
    auth0_identity
]


@fixture
def fake_auth0(requests_mock):
    requests_mock.post("http://auth0/oauth/token", json=auth0_get_token)
    requests_mock.get("http://auth0/api/v2/users-by-email?email=test@acaisoft.com", json={})
    requests_mock.get("http://auth0/api/v2/users-by-email?email=multiple_google@acaisoft.com",
                      json=auth0_multiple_google_acc)
    requests_mock.get("http://auth0/api/v2/users-by-email?email=single_google@acaisoft.com",
                      json=auth0_single_google_acc)
    requests_mock.get("http://auth0/api/v2/roles?name_filter=tenantadmin", json=[{"id": "role_id"}])
    requests_mock.get("http://auth0/api/v2/roles?name_filter=nonexistent", json=[])
    requests_mock.post("http://auth0/api/v2/roles/role_id/users", json={})


def raise_auth0_err(*args):
    raise HTTPError(ERROR_MESSAGE_AUTH0)


def raise_hasura_err(*args):
    raise HTTPError(ERROR_MESSAGE_HASURA)


@fixture
def fake_broken_auth0_token(requests_mock):
    requests_mock.post("http://auth0/oauth/token", json=raise_auth0_err)


@fixture
def fake_broken_auth0_list_email(requests_mock):
    requests_mock.post("http://auth0/oauth/token", json=auth0_get_token)
    requests_mock.get("http://auth0/api/v2/users-by-email?email=test@acaisoft.com", json=raise_auth0_err)


@fixture
def fake_broken_auth0_get_role(requests_mock):
    requests_mock.post("http://auth0/oauth/token", json=auth0_get_token)
    requests_mock.get("http://auth0/api/v2/users-by-email?email=single_google@acaisoft.com",
                      json=auth0_single_google_acc)
    requests_mock.get("http://auth0/api/v2/roles?name_filter=tenantadmin", json=raise_auth0_err)


@fixture
def fake_hasura(requests_mock):
    requests_mock.post("http://hasura/v1alpha1/graphql", json=hasura_handler)
    requests_mock.post("http://localhost:8080/v1alpha1/graphql", json=hasura_handler)


@fixture
def fake_hasura_synced(requests_mock):
    """
    Mocks Hasura that has complete remote schema
    """
    requests_mock.post("http://localhost:8080/v1alpha1/graphql", json=HEALTHY_REMOTE_SCHEMA)


@fixture
def fake_hasura_dead(requests_mock):
    """
    Mocks Hasura that is dead
    """
    requests_mock.post("http://localhost:8080/v1alpha1/graphql", json=raise_hasura_err)


@fixture
def fake_hasura_desync(requests_mock):
    """
    Mocks Hasura that is dead
    """
    requests_mock.post("http://localhost:8080/v1alpha1/graphql", json=hasura_error(0, "Not Found"))


@fixture
def fake_hasura_desync_repairable(requests_mock):
    """
    Mocks Hasura that has inconsistent schema, but able to sync it eventually
    """
    rs_handler = RemoteSchemaHandler()
    requests_mock.post("http://localhost:8080/v1alpha1/graphql", text=raise_hasura_err)
    requests_mock.post("http://localhost:8080/v1/query", json=rs_handler.handle)
