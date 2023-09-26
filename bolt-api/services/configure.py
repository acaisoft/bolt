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


class ConfigurationError(OSError):
    ...


def check_missing_vars(var_names, getter):
    return [var_name for var_name in var_names if getter(var_name) is None]


def configure_logging(app: Flask):
    app.logger.setLevel(logging.DEBUG if app.debug else logging.INFO)


def load_config_files(app: Flask):
    conf_file_path = os.environ.get("CONFIG_FILE_PATH", "localhost-config.py")
    app.config.from_pyfile(conf_file_path)

    secrets_file_path = os.environ.get("SECRETS_FILE_PATH", "localhost-secrets.py")
    app.config.from_pyfile(secrets_file_path)

    return conf_file_path, secrets_file_path


def configure_metrics(app: Flask):
    os.environ["DEBUG_METRICS"] = app.config.get("DEBUG_METRICS", "1")
    metrics = PrometheusMetrics(app, defaults_prefix="bolt_api")
    app.extensions["metrics"] = metrics


def configure_sentry(app: Flask):
    sentry_dsn = app.config.get("SENTRY_DSN")
    if sentry_dsn and not app.debug:
        logging.info(f"sentry logging to {sentry_dsn.split('@')[-1]}")
        sentry_sdk.init(sentry_dsn, integrations=[FlaskIntegration()])


def configure(app: Flask):
    configure_logging(app)
    conf_file_path, secrets_file_path = load_config_files(app)
    configure_metrics(app)
    configure_sentry(app)

    config_ver = app.config.get("CONFIG_VERSION")
    secrets_ver = app.config.get("SECRETS_VERSION")

    app.logger.info(f"app configured using {conf_file_path} v{config_ver} and {secrets_file_path} v{secrets_ver}")


def validate(app, required_config_vars, required_env_vars):
    missing = check_missing_vars(required_config_vars, app.config.get)
    missing_env = check_missing_vars(required_env_vars, os.environ.get)

    if missing:
        error_message = f"{len(missing)} undefined config variable{'s' if len(missing) > 1 else ''}: {', '.join(missing)}"
        app.logger.error(error_message)
        raise EnvironmentError(error_message)

    if missing_env:
        error_message = f"{len(missing_env)} undefined ENV variable{'s' if len(missing_env) > 1 else ''}: {', '.join(missing_env)}"
        app.logger.error(error_message)
        raise EnvironmentError(error_message)

    for env_var in required_env_vars:
        app.config[env_var] = os.environ.get(env_var)

    app.logger.info("config valid")


def validate_conditional_config(
        app: Flask,
        supported_choices: dict,
        chosen_variant_var: str,
        config_kind: str
):
    missing_vars = []
    missing_env = []
    chosen_variant = app.config.get(chosen_variant_var)
    if chosen_variant not in supported_choices:
        error_message = f"{chosen_variant_var} config variable needs to be one of: {', '.join(list(supported_choices))}"
        app.logger.error(error_message)
        raise ConfigurationError(error_message)

    if "vars" in supported_choices[chosen_variant]:
        missing_vars = check_missing_vars(supported_choices[chosen_variant]["vars"], app.config.get)

    if "env" in supported_choices[chosen_variant]:
        missing_env = check_missing_vars(supported_choices[chosen_variant]["env"], os.environ.get)

    if missing_env:
        error_message = f"{len(missing_env)} undefined environment variable{'s' if len(missing_env) > 1 else ''} for {chosen_variant}:\n{', '.join(missing_env)}"
        app.logger.error(error_message)
        raise EnvironmentError(error_message)

    if missing_vars:
        error_message = f"{len(missing_vars)} undefined configuration variable{'s' if len(missing_vars) > 1 else ''} for {chosen_variant}:\n{', '.join(missing_vars)}"
        app.logger.error(error_message)
        raise ConfigurationError(error_message)

    app.logger.info(f"{config_kind} config valid")
