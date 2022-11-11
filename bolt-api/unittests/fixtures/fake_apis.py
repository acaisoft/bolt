from pytest import fixture
from .hasura_handler import hasura_handler


@fixture
def fake_auth0(requests_mock):
    requests_mock.post("http://auth0/oauth/token", text='{"access_token":"legitimate_token"}')


@fixture
def fake_hasura(requests_mock):
    requests_mock.post("http://hasura/v1alpha1/graphql", text=hasura_handler)
    requests_mock.post("http://localhost:8080/v1alpha1/graphql", text=hasura_handler)
