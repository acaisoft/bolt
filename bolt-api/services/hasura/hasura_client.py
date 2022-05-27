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
import os

import requests
from gql import Client, gql
from gql.transport.requests import RequestsHTTPTransport
from graphql import print_ast
from graphql.execution import ExecutionResult

from services import const

_client = None


class VerboseHTTPTransport(RequestsHTTPTransport):
    # RequestsHTTPTransport hides error messages for statuses in 400-range, this copypasta returns them instead

    def execute(self, document, variable_values=None, timeout=None):
        query_str = print_ast(document)
        payload = {
            'query': query_str,
            'variables': variable_values or {}
        }

        data_key = 'json' if self.use_json else 'data'
        post_args = {
            'headers': self.headers,
            'auth': self.auth,
            'timeout': timeout or self.default_timeout,
            data_key: payload
        }
        request = requests.post(self.url, **post_args)

        if request.status_code >= 500:
            request.raise_for_status()

        result = request.json()
        assert 'errors' in result or 'data' in result, 'Received non-compatible response "{}"'.format(result)
        return ExecutionResult(
            errors=result.get('errors'),
            data=result.get('data')
        )


def hasura_client(config=None):
    global _client
    if not _client:
        # fallback to environment variables if app config is not specified
        if not config:
            config = os.environ

        target = config.get('HASURA_GQL')
        assert target, 'HASURA_GQL is not set'
        access_key = config.get('HASURA_GRAPHQL_ACCESS_KEY')
        assert access_key, 'HASURA_GRAPHQL_ACCESS_KEY is not set'

        _client = Client(
            retries=0,
            transport=VerboseHTTPTransport(
                url=target,
                use_json=True,
                headers={
                    'X-Hasura-Access-Key': access_key,
                    'X-Hasura-User-Id': const.HASURA_CLIENT_USER_ID,
                    'X-Hasura-Role': 'admin',
                },
            )
        )
    return _client


def hasura_client_with_user(config=None, user_id=None, role=None):
    if not config:
        config = os.environ
    target = config.get('HASURA_GQL')
    assert target, 'HASURA_GQL is not set'
    access_key = config.get('HASURA_GRAPHQL_ACCESS_KEY')
    assert access_key, 'HASURA_GRAPHQL_ACCESS_KEY is not set'
    client = Client(
        retries=0,
        transport=VerboseHTTPTransport(
            url=target,
            use_json=True,
            headers={
                'X-Hasura-Access-Key': access_key,
                'X-Hasura-User-Id': user_id or const.HASURA_CLIENT_USER_ID,
                'X-Hasura-Role': role or 'admin',
            },
        )
    )
    return client


def hce(config, query, *args, **kwargs):
    if type(query) is str:
        if config.get('HCE_DEBUG', False):
            print(query)
            print(json.dumps(args))
            print(json.dumps(kwargs))
        query = gql(query)
    return hasura_client(config).execute(query, *args, **kwargs)


def hce_with_user(config, query, user_id=None, role=None, *args, **kwargs):
    if type(query) is str:
        if config.get('HCE_DEBUG', False):
            print(query)
            print(json.dumps(args))
            print(json.dumps(kwargs))
        query = gql(query)
    return hasura_client_with_user(config, user_id, role).execute(query, *args, **kwargs)
