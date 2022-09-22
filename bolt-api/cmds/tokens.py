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

import click
import jwt
from flask.cli import with_appcontext

from services import const
from services.hasura.hasura import generate_hasura_token


@click.command(name='job_token')
@click.option('--role', default=const.ROLE_TESTRUNNER)
@click.option('--execution_id')
@with_appcontext
def job_token(role: str = None, execution_id: str = None):
    """
    Request generation of Auth0 token with given role, for given execution_id (optional)
    """
    token, execution_id = generate_hasura_token(role=role, execution_id=execution_id)
    claims = jwt.decode(token, options={"verify_signature": False})
    print(f'> execution_id:\n{execution_id}')
    print(f'> access_token:\n{token}')
    print('> claims:')
    print(json.dumps(claims, indent=4))
