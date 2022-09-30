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

import uuid

from flask import current_app

from apps.bolt_api.app.auth0_client import Auth0Client
from apps.bolt_api.app.utils.token import generate_token
from services import const
from services.logger import setup_custom_logger

logger = setup_custom_logger(__file__)


def generate_hasura_token(
        role: str = const.ROLE_TESTRUNNER,
        execution_id: str = None
) -> tuple[str, str]:
    """
    Returns a token for use by a testrunner, granting access to a single execution.
    Token's generated through either Auth0 service, or self-signed here.

    :param role: hasura role token needs to be issued for
    :param execution_id: execution id to include in the token. Will generate new if missing.

    :return: tuple: jwt token, testrunner id
    """
    if execution_id is None:
        execution_id = str(uuid.uuid1())

    selfsigned = current_app.config.get(const.AUTH_PROVIDER) == 'BOLT'
    if selfsigned:
        logger.info("Generating Hasura access token inside service")
        match role:
            case const.ROLE_REPORTGENERATOR:
                runner_id = {"x-hasura-reportgenerator-id": execution_id}
            case _:
                runner_id = {"x-hasura-testruner-id": execution_id}
        payload = {
            "https://hasura.io/jwt/claims": {
                "x-hasura-allowed-roles": [role],
                "x-hasura-default-role": role,
                "x-hasura-user-id": current_app.config.get(const.AUTH_USER_ID),
                **runner_id
            }}
        token = generate_token(current_app.config, payload=payload)
    else:
        logger.info("Generating Hasura access token via Auth0")
        token = Auth0Client(management_token=False).get_auth0_access_token(role=role, execution_id=execution_id)
    return token, execution_id

