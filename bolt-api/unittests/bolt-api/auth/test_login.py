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

import html

import pytest

LOGIN_ROUTE = '/auth/login'
REDIRECT_URL = "http://mocked_redirect"
CORRECT_LOGIN = {
    "login": "user",
    "password": "password"
}
BAD_USER = {
    "login": "test",
    "password": "password"
}
BAD_PASSWORD = {
    "login": "user",
    "password": "test"
}
BAD_CREDENTIALS = {
    "login": "test",
    "password": "test"
}


def test_login_get_no_priv_key(app_critical_config, client_critical_config):
    resp = client_critical_config.get(LOGIN_ROUTE)
    assert 'Service is not configured properly' in resp.text


def test_login_get_missing_redirect_url(app, client):
    resp = client.get(LOGIN_ROUTE)
    assert 'Expected "redirect_url" parameter in URL' in html.unescape(resp.text)


def test_login_get(app, client):
    resp = client.get(f'{LOGIN_ROUTE}?redirect_url={REDIRECT_URL}')
    assert resp.status_code == 200


def test_login(app, client, requests_mock):
    requests_mock.get(REDIRECT_URL, text="redirected")
    resp = client.post(
        f'{LOGIN_ROUTE}?redirect_url={REDIRECT_URL}',
        data=CORRECT_LOGIN)
    assert resp.location == REDIRECT_URL
    cookies = client.cookie_jar._cookies
    assert 'localhost.local' in cookies
    cookies = cookies['localhost.local']
    assert '/' in cookies
    cookies = cookies['/']
    assert 'AUTH_TOKEN' in cookies
    assert 'APP_URL' in cookies
    assert cookies['APP_URL'].value == REDIRECT_URL


@pytest.mark.parametrize(
    "credentials",
    [
        BAD_USER,
        BAD_PASSWORD,
        BAD_CREDENTIALS
    ]
)
def test_login_bad_credentials(app, client, credentials):
    resp = client.post(
        f'{LOGIN_ROUTE}?redirect_url={REDIRECT_URL}',
        data=credentials)
    assert 'Invalid credentials' in resp.text

