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


class MissingVariableError(Exception):
    def __init__(self, missing_count, missing_vars, variant):
        super().__init__(
            f"{missing_count} undefined variable{'s' if missing_count > 1 else ''} "
            f"for {variant}:\n"
            f"{', '.join(missing_vars)}"
        )


def setup_logging(app: Flask):
    app.logger.setLevel(logging.DEBUG if app.debug else logging.INFO)
    app.logger.info("Logging setup complete")


def load_config_files(app: Flask):
    conf_file_path = os.environ.get("CONFIG_FILE_PATH", "localhost-config.py")
    app.config.from_pyfile(conf_file_path)

    secrets_file_path = os.environ.get("SECRETS_FILE_PATH", "localhost-secrets.py")
    app.config.from_pyfile(secrets_file_path)

    app.logger.info(f"Config files loaded from {conf_file_path} and {secrets_file_path}")


def setup_google_credentials(app: Flask):
    google_service_account = app.config.get("GOOGLE_APPLICATION_CREDENTIALS")
    if google_service_account:
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = google_service_account
    app.logger.info("Google credentials setup complete")


def setup_metrics(app: Flask):
    os.environ["DEBUG_METRICS"] = "1"
    metrics = PrometheusMetrics(app, defaults_prefix="bolt_api")
    app.extensions["metrics"] = metrics
    app.logger.info("Metrics setup complete")


def initialize_sentry(app: Flask):
    sentry_dsn = app.config.get("SENTRY_DSN")
    if sentry_dsn and not app.debug:
        logging.info(f"sentry logging to {sentry_dsn.split('@')[-1]}")
        sentry_sdk.init(sentry_dsn, integrations=[FlaskIntegration()])
    app.logger.info("Sentry initialization complete")


def configure(app: Flask):
    setup_logging(app)
    load_config_files(app)
    setup_google_credentials(app)
    setup_metrics(app)
    initialize_sentry(app)
    app.logger.info("App configuration complete")


def validate(app, required_config_vars, required_env_vars):
    missing = [var_name for var_name in required_config_vars if var_name not in app.config]
    missing_env = [var_name for var_name in required_env_vars if var_name not in os.environ]
    if missing:
        raise MissingVariableError(len(missing), missing, "config")
    if missing_env:
        raise MissingVariableError(len(missing_env), missing_env, "env")
    for env_var in required_env_vars:
        app.config[env_var] = os.environ.get(env_var)
    app.logger.info("Config validation complete")


def validate_conditional_config(
        app: Flask,
        supported_choices: dict,
        chosen_variant_var: str,
        config_kind: str
):
    """
    Validate grouped configuration variables, like storage or auth provider, that change depending on chosen variant.

    :param app: Flask | application object instance, post-configuration
    :param supported_choices: const nested dictionary containing supported choices for given config group
    :param chosen_variant_var: config string representing desired configuration group
    :param config_kind: string defining config group, just for logging purposes

    :raises: EnvironmentError
    :raises: ConfigurationError
    """
    missing_vars = []
    missing_env = []
    chosen_variant = app.config.get(chosen_variant_var)
    if chosen_variant not in supported_choices:
        raise ConfigurationError(
            f"{chosen_variant_var} config variable needs to be one of: {', '.join(list(supported_choices))}"
        )
    for var_name in supported_choices[chosen_variant].get("vars", []):
        if app.config.get(var_name) is None:
            missing_vars.append(var_name)
    for env_name in supported_choices[chosen_variant].get("env", []):
        if not os.environ.get(env_name):
            missing_env.append(env_name)
    if missing_env:
        raise MissingVariableError(len(missing_env), missing_env, chosen_variant)
    if missing_vars:
        raise MissingVariableError(len(missing_vars), missing_vars, chosen_variant)
    app.logger.info(f"{config_kind} config validation complete")
