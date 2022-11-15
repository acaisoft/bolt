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

from unittest import mock

import jwt
import pytest

from apps.bolt_api.app.utils.token import generate_token

EXPECTED_TOKEN = {'exp': mock.ANY, 'allowed-origins': ['*'],
                  'realm_access': {'roles': ['offline_access', 'uma_authorization']},
                  'resource_access': {'bolt-portal': {'roles': ['manager', 'reader', 'tester', 'tenantadmin']},
                                      'account': {'roles': ['manage-account', 'manage-account-links', 'view-profile']}},
                  'scope': 'openid profile email', 'email_verified': True,
                  'https://hasura.io/jwt/claims': {'x-hasura-default-role': 'tenantadmin',
                                                   'x-hasura-allowed-roles': ['tenantadmin', 'manager', 'tester',
                                                                              'reader'],
                                                   'x-hasura-user-id': '96fa4735-f862-4cb9-b0df-f09c008e02e4'},
                  'name': 'Bolt Dev', 'preferred_username': 'bolt+dev@acaisoft.com', 'given_name': 'Bolt',
                  'family_name': 'Dev', 'email': 'bolt+dev@acaisoft.com'}


def decode_token(token, app):
    return jwt.decode(token, app.config.get("JWT_AUTH_PUB_KEY"), algorithms='RS256')


def test_generate_token(app):
    token = generate_token(app.config)
    assert EXPECTED_TOKEN == decode_token(token, app)


def test_custom_payload_token(app):
    expected_payload = {"test": "test"}
    token = generate_token(app.config, payload=expected_payload)
    assert expected_payload == decode_token(token, app)


def test_missing_config(app_critical_config):
    with pytest.raises(Exception) as ex:
        generate_token(app_critical_config.config)
    assert str(ex.value) == "JWT_AUTH_PRIV_KEY is missing in config"