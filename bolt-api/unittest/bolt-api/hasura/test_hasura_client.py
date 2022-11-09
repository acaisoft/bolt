from graphql.error import GraphQLSyntaxError
from pytest import raises

from services.hasura import hce


def test_missing_query(app, fake_hasura):
    with raises(GraphQLSyntaxError):
        with app.app_context():
            resp = hce(app.config, '')


def test_common_query(app, fake_hasura):
    with app.app_context():
        print(app.config.get('HASURA_GQL'))
        resp = hce(app.config, 'query {configuration{id}}')

    assert resp == {'configuration': [{'id': 'test'}]}

