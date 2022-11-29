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


SESSION_ROUTE = '/auth/session'


def test_session_no_cookies(app, client):
    expected_message = "Missing cookies:<br>AUTH_TOKEN<br>APP_URL</p>"
    resp = client.get(SESSION_ROUTE)
    assert expected_message in resp.text
    assert resp.status_code == 401


def test_session_no_token_cookie(app, client):
    expected_message = "Missing cookies:<br>AUTH_TOKEN</p>"
    client.set_cookie("localhost", "APP_URL", "http://test/")
    resp = client.get(SESSION_ROUTE)
    assert expected_message in resp.text
    assert resp.status_code == 401


def test_session_no_url_cookie(app, client):
    expected_message = "Missing cookies:<br>APP_URL</p>"
    client.set_cookie("localhost", "AUTH_TOKEN", "test_token")
    resp = client.get(SESSION_ROUTE)
    assert expected_message in resp.text
    assert resp.status_code == 401


def test_session(app, client):
    test_token = "test_token"
    test_url = "http://test/"
    expected_headers = [
        ('Content-Type', 'application/json'),
        ('Content-Length', '28'),
        ('Set-Cookie', 'AUTH_TOKEN=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/'),
        ('Set-Cookie', 'APP_URL=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/'),
        ('Access-Control-Allow-Origin', test_url),
        ('Access-Control-Allow-Credentials', 'true')
    ]
    expected_message = {"AUTH_TOKEN": test_token}
    client.set_cookie("localhost", "APP_URL", test_url)
    client.set_cookie("localhost", "AUTH_TOKEN", test_token)
    resp = client.get(SESSION_ROUTE)
    assert resp.json == expected_message
    assert resp.status_code == 200
    assert list(resp.headers) == expected_headers
