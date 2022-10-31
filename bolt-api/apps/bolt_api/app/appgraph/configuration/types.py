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

import graphene
from services import const


class ConfigurationParameterAbstractType(graphene.AbstractType):
    value = graphene.String()
    parameter_slug = graphene.String()


class ConfigurationParameterInterface(ConfigurationParameterAbstractType, graphene.Interface):
    pass


class ConfigurationParameterInput(ConfigurationParameterAbstractType, graphene.InputObjectType):
    pass


class ConfigurationParameterType(graphene.ObjectType):
    class Meta:
        interfaces = (ConfigurationParameterInterface,)


class ConfigurationEnvVarAbstractType(graphene.AbstractType):
    name = graphene.String()
    value = graphene.String()


class ConfigurationEnvVarInterface(ConfigurationEnvVarAbstractType, graphene.Interface):
    pass


class ConfigurationEnvVarInput(ConfigurationEnvVarAbstractType, graphene.InputObjectType):
    pass


class ConfigurationEnvVarType(graphene.ObjectType):
    class Meta:
        interfaces = (ConfigurationEnvVarInterface,)


class ConfigurationMonitoringAbstractType(graphene.AbstractType):
    query = graphene.String()
    chart_type = graphene.String()


class ConfigurationMonitoringInput(ConfigurationMonitoringAbstractType, graphene.InputObjectType):
    pass


class ConfigurationMonitoringInterface(ConfigurationMonitoringAbstractType, graphene.Interface):
    pass


class ConfigurationMonitoringType(graphene.ObjectType):
    class Meta:
        interfaces = (ConfigurationMonitoringInterface,)


class ConfigurationInterface(graphene.Interface):
    id = graphene.UUID()
    name = graphene.String()
    type_slug = graphene.String(
        description=f'Configuration type: "{const.TESTTYPE_LOAD}"')
    project_id = graphene.UUID()
    has_pre_test = graphene.Boolean(
        required=False,
        description='Test has pre_test hooks.')
    has_post_test = graphene.Boolean(
        required=False,
        description='Test has post_test hooks.')
    has_load_tests = graphene.Boolean(
        required=False,
        description='Test has load_tests hooks.')
    has_monitoring = graphene.Boolean(
        required=False,
        description='Test has monitoring hooks.')
    test_source_id = graphene.UUID(
        required=False,
        description='Test source to fetch test definition from.')
    configuration_parameters = graphene.List(
        ConfigurationParameterInterface,
        description='Default parameter types overrides.')
    monitoring_chart_configuration = graphene.JSONString(
        required=False,
        description='List of monitoring chart configurations'
    )
    description = graphene.String(
        required=False,
        description='A few words summarizing the configuration'
    )


class ConfigurationType(graphene.ObjectType):
    class Meta:
        interfaces = (ConfigurationInterface,)
    configuration_parameters = graphene.List(
        ConfigurationParameterType,
        description='Default parameter types overrides.')
    configuration_envvars = graphene.List(
        ConfigurationEnvVarType,
        description='Testrunner environment variables.')
    configuration_monitorings = graphene.List(
        ConfigurationMonitoringType,
        description='.')
