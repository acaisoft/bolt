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

import os
import re

import flask
import marshmallow

from services import const
from services.logger import setup_custom_logger
from services.validators import schemas

logger = setup_custom_logger(__name__)


def validate_repository(user_id, repo_config):
    """
    >>> validate_repository('u1', {
    ...  "url": "http://url.url/url",
    ...  "configuration_type": { "slug_name": "extreme_load" },
    ...  "project": {
    ...    "userProjects": [
    ...      { "user_id": "4f2e6f44-9db9-47fd-a5c4-6c129ea70cc7" },
    ...    ]
    ...  }
    ... })
    Traceback (most recent call last):
    ...
    AssertionError: user has no access to project
    >>> validate_repository('u1', {
    ...  "url": "http://url.url/url",
    ...  "configuration_type": { "slug_name": "extreme_load" },
    ...  "project": {
    ...    "userProjects": [
    ...      { "user_id": "4f2e6f44-9db9-47fd-a5c4-6c129ea70cc7" },
    ...      { "user_id": "u1" },
    ...    ]
    ...  }
    ... })
    >>> validate_repository('u1', {"url": "abc"})
    Traceback (most recent call last):
    ...
    AssertionError: invalid repository url (abc)
    """
    regex = '((git|ssh|http(s)?)|(git@[\w\.]+))(:(//)?)([\w\.@\:/\-~]+)(\.git)(/)?'
    assert re.match(regex, repo_config['url']), f'invalid repository url ({repo_config["url"]})'

    if user_id:
        assert is_user_project_valid(user_id, repo_config['project'])


def is_user_project_valid(user_id, project_config):
    for up in project_config['userProjects']:
        if up['user_id'] == user_id:
            return True

    raise AssertionError('user has no access to project')


def validate_accessibility(app_config: flask.config.Config, repository_url: str) -> str:
    if repository_url.startswith(const.MOCK_REPOSITORY):
        return repository_url

    repository_url = repository_url.strip()
    regex = '((git|ssh|http(s)?)|(git@[\w\.]+))(:(//)?)([\w\.@\:/\-~]+)(\.git)(/)?'
    assert re.match(regex, repository_url), f'invalid repository url ({repository_url})'


    logger.info(f'validating repository is accessible {repository_url}')
    input_data = {'repository_url': repository_url}
    try:
        schemas.ValidateRepositorySchema().load(data=input_data)
    except marshmallow.ValidationError as e:
        # catches remote not reachable/resolvable
        logger.info(f'repo connectivity check failure: {str(e)}')
        raise AssertionError('repository is not reachable')
    else:
        # catches remote not accessible
        return_code = os.system(f'git ls-remote {repository_url}')
        is_repository_valid = return_code == 0
        assert is_repository_valid, f'repository is not accessible'

    return repository_url


if __name__ == '__main__':
    import doctest

    doctest.testmod()
