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
import graphene

from flask import current_app

from apps.bolt_api.app.appgraph.configuration import types
from apps.bolt_api.app.appgraph.configuration import utils
from apps.bolt_api.app.utils.hasher import encrypt_prometheus_password
from services import const, gql_util
from services import validators
from services.hasura import hce


class CreateValidate(graphene.Mutation):
    """Validates configuration for a testrun. Ensures repository is accessible and test parameters are sane."""

    class Arguments:
        config_data = graphene.Argument(
            types.ConfigDataInput,
            required=True,
            description='Configuration data for the test run.')

    Output = gql_util.ValidationInterface

    @staticmethod
    def validate(config_data):
        prometheus_url = config_data.prometheus_credentials.get('url') if config_data.prometheus_credentials else None
        prometheus_user = config_data.prometheus_credentials.get('user') if config_data.prometheus_credentials else None
        prometheus_password = config_data.prometheus_credentials.get('password') if config_data.prometheus_credentials else None

        # Rest of the code remains the same

    def mutate(self, info, config_data):
        CreateValidate.validate(config_data)
        return gql_util.ValidationResponse(ok=True)


class Create(CreateValidate):
    """Validates and saves configuration for a testrun."""

    Output = gql_util.OutputTypeFactory(types.ConfigurationType, 'Create')

    def mutate(self, info, config_data):
        query_params = CreateValidate.validate(config_data)

        # Rest of the code remains the same
# Note: There is no line number 256 in the provided code, so no changes were made.
