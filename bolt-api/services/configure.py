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

import logging
import os

from flask import Flask
import sentry_sdk
from prometheus_flask_exporter import PrometheusMetrics
from sentry_sdk.integrations.flask import FlaskIntegration


def configure(app: Flask):
    # common flask app configuration
    app.logger.setLevel(logging.DEBUG if app.debug else logging.INFO)

    conf_file_path = os.environ.get("CONFIG_FILE_PATH", "localhost-config.py")
    app.config.from_pyfile(conf_file_path)

    secrets_file_path = os.environ.get("SECRETS_FILE_PATH", "localhost-secrets.py")
    app.config.from_pyfile(secrets_file_path)

    google_service_account = app.config.get("GOOGLE_APPLICATION_CREDENTIALS")
    if google_service_account:
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = google_service_account

    os.environ["DEBUG_METRICS"] = "1"
    metrics = PrometheusMetrics(app, defaults_prefix="bolt_api")
    app.extensions["metrics"] = metrics

    sentry_dsn = app.config.get("SENTRY_DSN")
    if sentry_dsn and not app.debug:
        logging.info(f"sentry logging to {sentry_dsn.split('@')[-1]}")
        sentry_sdk.init(sentry_dsn, integrations=[FlaskIntegration()])

    config_ver = app.config.get("CONFIG_VERSION")
    secrets_ver = app.config.get("SECRETS_VERSION")

    app.logger.info(f"app configured using {conf_file_path} v{config_ver} and {secrets_file_path} v{secrets_ver}")


def validate(app, required_config_vars, required_env_vars):
    missing = []
    missing_env = []
    for var_name in required_config_vars:
        if app.config.get(var_name) is None:
            missing.append(var_name)
    for var_name in required_env_vars:
        if os.environ.get(var_name) is None:
            missing_env.append(var_name)
    if missing:
        raise EnvironmentError(
            f"{len(missing)} undefined config variable{'s' if len(missing) > 1 else ''}: {', '.join(missing)}"
        )
    if missing_env:
        raise EnvironmentError(
            f"{len(missing_env)} undefined ENV variable{'s' if len(missing_env) > 1 else ''}: "
            f"{', '.join(missing_env)}"
        )
    for env_var in required_env_vars:
        app.config[env_var] = os.environ.get(env_var)

    app.logger.info("config valid")


def validate_storage_service(app, supported_storage_services, storage_service_var):
    missing = []
    storage_service = app.config.get(storage_service_var)
    if storage_service not in supported_storage_services:
        raise EnvironmentError(
            f"{storage_service_var} config variable needs to be one of: {', '.join(list(supported_storage_services))}"
        )
    for var_name in supported_storage_services[storage_service]["vars"]:
        if app.config.get(var_name) is None:
            missing.append(var_name)
    if missing:
        raise EnvironmentError(
            f"{len(missing)} undefined config variable{'s' if len(missing) > 1 else ''} for {storage_service} service:\n"
            f"{', '.join(missing)}"
        )
    app.logger.info("storage config valid")
