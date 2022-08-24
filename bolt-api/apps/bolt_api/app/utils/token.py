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

from typing import Optional

import jwt
from datetime import datetime, timedelta
from flask import Config

from services import const


def generate_token(config: Config, priv_key: Optional[str] = None, payload: Optional[dict] = None) -> str:
    """
    Generates token that is digestible by Hasura.
    Just a boilerplate containing hardcoded, critical payload needed to authenticate user
    :param config: flask app config
    :param priv_key: (optional) private key to sign token with. Will be taken from config if not passed explicitly.
    :param payload: (optional) payload to encode in token. Defaults to critical set of variables needed to authenticate
    with Hasura
    :return: str: jwt token
    """
    if priv_key is None:
        priv_key = config.get(const.JWT_AUTH_PRIV_KEY, False)
        if not priv_key:
            raise Exception(f'{const.JWT_AUTH_PRIV_KEY} is missing in config')
    expires = datetime.utcnow() + timedelta(hours=config.get(const.JWT_VALID_PERIOD))
    if payload is None:
        payload = {
            "exp": expires,
            "allowed-origins": [
                "*"
            ],
            "realm_access": {
                "roles": [
                    "offline_access",
                    "uma_authorization"
                ]
            },
            "resource_access": {
                "bolt-portal": {
                    "roles": [
                        "manager",
                        "reader",
                        "tester",
                        "tenantadmin"
                    ]
                },
                "account": {
                    "roles": [
                        "manage-account",
                        "manage-account-links",
                        "view-profile"
                    ]
                }
            },
            "scope": "openid profile email",
            "email_verified": True,
            "https://hasura.io/jwt/claims": {
                "x-hasura-default-role": "tenantadmin",
                "x-hasura-allowed-roles": [
                    "tenantadmin",
                    "manager",
                    "tester",
                    "reader"
                ],
                "x-hasura-user-id": config.get('AUTH_USER_ID')
            },
            "name": "Bolt Dev",
            "preferred_username": "bolt+dev@acaisoft.com",
            "given_name": "Bolt",
            "family_name": "Dev",
            "email": "bolt+dev@acaisoft.com"
        }

    algorithm = config.get(const.JWT_ALGORITHM, 'RS256')

    return jwt.encode(payload, priv_key, algorithm=algorithm)
