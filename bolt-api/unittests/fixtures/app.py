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

import pytest
from flask import Flask
from flask.testing import FlaskClient

from apps.bolt_api.app import create_app


def get_app():
    mocked_app = create_app(test=True)
    mocked_app.secret_key = 'secret'
    mocked_app.config['SESSION_TYPE'] = 'filesystem'
    return mocked_app


@pytest.fixture()
def app() -> Flask:
    os.environ["SECRETS_FILE_PATH"] = "../unittests/fixtures/data/test_secrets.py"
    yield get_app()


@pytest.fixture()
def app_auth0() -> Flask:
    os.environ["SECRETS_FILE_PATH"] = "../unittests/fixtures/data/test_secrets_auth0.py"
    yield get_app()


@pytest.fixture()
def app_critical_config() -> Flask:
    os.environ["SECRETS_FILE_PATH"] = "../unittests/fixtures/data/bare_minimum.py"
    yield get_app()


@pytest.fixture()
def app_critical_config_auth0() -> Flask:
    os.environ["SECRETS_FILE_PATH"] = "../unittests/fixtures/data/bare_minimum_auth0.py"
    yield get_app()


@pytest.fixture()
def client(app: Flask) -> FlaskClient:
    return app.test_client()


@pytest.fixture()
def client_auth0(app_auth0: Flask) -> FlaskClient:
    return app_auth0.test_client()


@pytest.fixture()
def client_critical_config(app_critical_config: Flask) -> FlaskClient:
    return app_critical_config.test_client()


@pytest.fixture()
def client_critical_config_auth0(app_critical_config_auth0: Flask) -> FlaskClient:
    return app_critical_config_auth0.test_client()
