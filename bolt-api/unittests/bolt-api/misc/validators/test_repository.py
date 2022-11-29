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

import pytest

from pytest import raises
from services.validators import validate_accessibility

VALID_REPOS = [
    "git@bucket.com:repo.git",
    "git:bucket.com:repo.git",
    "http://url.com:repo.git",
    "https://url.com:repo.git",
    "ssh://url.com:repo.git",
    "git@bucket.com:repo.git",
    "http://url.com:repo.git",
    "https://url.com:repo.git",
    "ssh://url.com:repo.git",
]

def test_validate_repository_malformed(app):
    url = "this is definitely not a repo"
    with (
        app.app_context(),
        raises(AssertionError) as ae
    ):
        validate_accessibility(app.config, url)
    assert ae.value.args[0] == f"invalid repository url ({url})"


@pytest.mark.parametrize("repo_url", VALID_REPOS)
def test_validate_repository_ok(app, repo_url, fake_cmd_zero):
    with (
        app.app_context()
    ):
        url = validate_accessibility(app.config, repo_url)
    assert url == repo_url


@pytest.mark.parametrize("repo_url", VALID_REPOS)
def test_validate_repository_inaccessible(app, repo_url, fake_cmd_nonzero):
    with (
        app.app_context(),
        raises(AssertionError) as ae
    ):
        validate_accessibility(app.config, repo_url)
    assert ae.value.args[0] == "repository is not accessible"

