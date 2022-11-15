from pytest import fixture
from requests import HTTPError

from .hasura_handler import hasura_handler
from .test_const import ERROR_MESSAGE_AUTH0


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


def raise_err(*args):
    raise HTTPError(ERROR_MESSAGE_AUTH0)


@fixture
def fake_broken_auth0_token(requests_mock):
    requests_mock.post("http://auth0/oauth/token", json=raise_err)


@fixture
def fake_broken_auth0_list_email(requests_mock):
    requests_mock.post("http://auth0/oauth/token", json=auth0_get_token)
    requests_mock.get("http://auth0/api/v2/users-by-email?email=test@acaisoft.com", json=raise_err)


@fixture
def fake_broken_auth0_get_role(requests_mock):
    requests_mock.post("http://auth0/oauth/token", json=auth0_get_token)
    requests_mock.get("http://auth0/api/v2/users-by-email?email=single_google@acaisoft.com",
                      json=auth0_single_google_acc)
    requests_mock.get("http://auth0/api/v2/roles?name_filter=tenantadmin", json=raise_err)


@fixture
def fake_hasura(requests_mock):
    requests_mock.post("http://hasura/v1alpha1/graphql", json=hasura_handler)
    requests_mock.post("http://localhost:8080/v1alpha1/graphql", json=hasura_handler)
