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

from services.hasura import generate_hasura_token
from jwt import decode
import re


UUID_REGEX = re.compile('[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}')


def test_auth0_token(app_auth0, fake_auth0):
    with app_auth0.app_context():
        token, eid = generate_hasura_token(execution_id='test_id')
    assert token == 'legitimate_token'
    assert eid == 'test_id'


def test_internal_token(app):
    with app.app_context():
        token, eid = generate_hasura_token(execution_id='test_id')
    claims = decode(jwt=token, key=app.config.get('JWT_AUTH_PUB_KEY'), algorithms=[app.config.get('JWT_ALGORITHM')])\
        .get('https://hasura.io/jwt/claims', {})
    assert claims.get('x-hasura-default-role') == 'testrunner'
    assert eid == 'test_id'


def test_internal_token_new_id(app):
    with app.app_context():
        token, eid = generate_hasura_token()
    claims = decode(jwt=token, key=app.config.get('JWT_AUTH_PUB_KEY'), algorithms=[app.config.get('JWT_ALGORITHM')])\
        .get('https://hasura.io/jwt/claims', {})
    match = UUID_REGEX.match(claims.get('x-hasura-testruner-id', ''))
    assert match is not None
    assert match.pos == 0
    assert eid == claims.get('x-hasura-testruner-id', '')


def test_internal_token_custom_role(app):
    with app.app_context():
        token, eid = generate_hasura_token(role='reportgenerator')
    claims = decode(jwt=token, key=app.config.get('JWT_AUTH_PUB_KEY'), algorithms=[app.config.get('JWT_ALGORITHM')])\
        .get('https://hasura.io/jwt/claims', {})
    match = UUID_REGEX.match(claims.get('x-hasura-reportgenerator-id', ''))
    assert claims.get('x-hasura-default-role', '') == 'reportgenerator'
    assert claims.get('x-hasura-allowed-roles', []) == ['reportgenerator']
    assert match is not None
    assert match.pos == 0
    assert eid == claims.get('x-hasura-reportgenerator-id', '')
    assert 'x-hasura-tenantadmin-id' not in claims