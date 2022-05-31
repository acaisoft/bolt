import os

import pytest
from flask import Flask
from flask.testing import FlaskClient

from apps.bolt_api.app import create_app


@pytest.fixture()
def app() -> Flask:
    os.environ["SECRETS_FILE_PATH"] = "../unittest/fixtures/data/test_secrets.py"
    mocked_app = create_app()
    mocked_app.secret_key = 'secret'
    mocked_app.config['SESSION_TYPE'] = 'filesystem'
    yield mocked_app


@pytest.fixture()
def app_critical_config() -> Flask:
    os.environ["SECRETS_FILE_PATH"] = "../unittest/fixtures/data/bare_minimum.py"
    mocked_app = create_app()
    mocked_app.secret_key = 'secret'
    mocked_app.config['SESSION_TYPE'] = 'filesystem'
    yield mocked_app


@pytest.fixture()
def client(app: Flask) -> FlaskClient:
    return app.test_client()


@pytest.fixture()
def client_critical_config(app_critical_config: Flask) -> FlaskClient:
    return app_critical_config.test_client()
