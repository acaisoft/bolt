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
import threading
from time import sleep
from urllib import parse

import requests
from requests import Response

from services import const
from services.logger import setup_custom_logger

logger = setup_custom_logger(__file__)

HEALTHY_REMOTE_SCHEMA = {'data': {'remote_schema_healthcheck': {'state': 'Alive'}}}


def verify_remote_schema_state(app):
    """
    Used in case of Hasura potentially being up before API. This causes Hasura to ignore its retry on gathering the
    remote schema from Bolt API. In such case we take action and ask Hasura to reload schema.
    Related to known issues in Hasura:
    https://github.com/hasura/graphql-engine/issues/5126
    https://github.com/hasura/graphql-engine/issues/8396
    """
    url = app.config.get(const.HASURA_GQL)
    access_key = app.config.get('HASURA_GRAPHQL_ACCESS_KEY')
    bidir_thread = threading.Thread(target=validate_dummy_mutation, args=(url, access_key))
    logger.info('Checking remote schema state')
    bidir_thread.start()


def validate_dummy_mutation(url, access_key):
    response: Response = Response()
    headers = {
        'X-Hasura-Access-Key': access_key,
        'X-Hasura-User-Id': const.HASURA_CLIENT_USER_ID,
        'X-Hasura-Role': 'admin',
    }

    query = '''query {
          remote_schema_healthcheck { state }
    }'''
    try:
        response = requests.post(
            url=url,
            headers=headers,
            data=json.dumps({'query': query}),
            timeout=5
        ).json()
    except Exception:
        logger.info('Hasura is not up. Remote schema sync will happen naturally.')
    else:
        if response == HEALTHY_REMOTE_SCHEMA:
            logger.info('Hasura is up and remote schema is healthy.')
        else:
            request_remote_schema_reload(url, access_key)


def request_remote_schema_reload(url, access_key, debug=True):
    logger.info('Requesting remote schema reload.')
    headers = {
        'X-Hasura-Access-Key': access_key,
        'X-Hasura-User-Id': const.HASURA_CLIENT_USER_ID,
        'X-Hasura-Role': 'admin',
    }
    retry_max = 3
    retry_count = 0
    success = False
    while retry_count < retry_max and not success:
        response = None
        try:
            response = requests.post(
                url=parse.urlparse(url)._replace(path='/v1/query').geturl(),
                headers=headers,
                data=json.dumps({
                    'type': 'reload_remote_schema',
                    'args': {
                        'name': const.HASURA_REMOTE_SCHEMA_NAME
                    }
                })
            ).json()
            if response == {'message': 'success'}:
                success = True
                logger.info('Remote Schema successfully reloaded.')
            else:
                raise Exception
        except Exception:
            retry_count += 1
            logger.warn(f'Attempt {retry_count} of {retry_max}:\n'
                        f'Remote Schema load failed.')
            if retry_count < retry_max:
                logger.warn('Retrying...')
                sleep(3)
            else:
                logger.warn('This is a high risk of severe functionality loss.')
        if debug:
            logger.info(response)
