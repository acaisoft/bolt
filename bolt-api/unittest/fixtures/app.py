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
    os.environ["SECRETS_FILE_PATH"] = "../unittest/fixtures/data/test_secrets.py"
    yield get_app()


@pytest.fixture()
def app_auth0() -> Flask:
    os.environ["SECRETS_FILE_PATH"] = "../unittest/fixtures/data/test_secrets_auth0.py"
    yield get_app()


@pytest.fixture()
def app_critical_config() -> Flask:
    os.environ["SECRETS_FILE_PATH"] = "../unittest/fixtures/data/bare_minimum.py"
    yield get_app()


@pytest.fixture()
def app_critical_config_auth0() -> Flask:
    os.environ["SECRETS_FILE_PATH"] = "../unittest/fixtures/data/bare_minimum_auth0.py"
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
