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

from flask import Flask

from apps.bolt_api.app import appgraph, healthcheck, webhooks, auth
from services.configure import configure, validate, validate_conditional_config
from services.logger import setup_custom_logger
from services import const
from services.hasura import hasura_client


logger = setup_custom_logger(__name__)


def create_app(test_config=None):

    app = Flask(__name__, instance_relative_config=True)

    configure(app)

    if app.config.get('DEBUG_SERVER') is not None:
        import pydevd_pycharm
        pydevd_pycharm.settrace(
            app.config.get('DEBUG_SERVER'),
            port=app.config.get('DEBUG_PORT', 6060),
            stdoutToServer=True,
            stderrToServer=True
        )

    for handler in ('graphql.execution.executor', 'graphql.execution.utils'):
        ll = logging.getLogger(handler)
        if ll:
            ll.addFilter(IgnoreGraphQLErrors(debug=app.debug))

    if test_config:
        app.config.from_object(test_config)

    validate(app, const.REQUIRED_BOLT_API_CONFIG_VARS, const.REQUIRED_ENV_VARS)

    validate_conditional_config(app, const.STORAGE_PROVIDERS, const.STORAGE_SERVICE, "Storage provider")
    validate_conditional_config(app, const.AUTH, const.AUTH_PROVIDER, "Authentication provider")

    ## initialize the hasura client
    hasura_client(app.config)

    ## this app's graphs
    appgraph.register_app(app)

    ## healthchecks
    healthcheck.register_app(app)

    ## webhooks
    webhooks.register_app(app)

    ## auth
    auth.register_app(app)

    logger.info('application ready')
    return app


class IgnoreGraphQLErrors(logging.Filter):
    """
    python-graphene logs every intercepted exception twice with loglevel EXCEPTION, which gets picked up by Sentry.
    This silences these logs unless we're in debug mode.
    """
    debug = False

    def __init__(self, name='', debug=False):
        self.debug = debug
        super().__init__(name)

    def filter(self, record:logging.LogRecord):
        if record:
            if record.exc_info and record.exc_info[0] is AssertionError and not self.debug:
                return 0
            if 'graphql.error.located_error.GraphQLLocatedError' in record.getMessage():
                return 0
        return 1

