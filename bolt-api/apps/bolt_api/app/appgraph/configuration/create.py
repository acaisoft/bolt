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

from flask import current_app

from apps.bolt_api.app.appgraph.configuration import types
from apps.bolt_api.app.appgraph.configuration import utils
from services import const, gql_util
from services import validators
from services.hasura import hce


class CreateValidate(graphene.Mutation):
    """Validates configuration for a testrun. Ensures repository is accessible and test parameters are sane."""

    class Arguments:
        name = graphene.String(
            required=True,
            description='Name, not unique.')
        type_slug = graphene.String(
            required=True,
            description=f'Configuration type: "{const.TESTTYPE_LOAD}"')
        project_id = graphene.UUID(
            required=True,
            description='Project to create test in, user must have access to it.')
        test_source_id = graphene.UUID(
            required=False,
            description='Test source to fetch test definition from.')
        configuration_parameters = graphene.List(
            types.ConfigurationParameterInput,
            required=False,
            description='Default parameter types overrides.')
        configuration_envvars = graphene.List(
            types.ConfigurationEnvVarInput,
            required=False,
            description='Parameters passed as environment variables to testrunner.')
        configuration_monitorings = graphene.List(
            types.ConfigurationMonitoringInput,
            required=False,
            description='-.')
        has_pre_test = graphene.Boolean(
            required=False,
            description='Test has pre_test hooks.')
        has_post_test = graphene.Boolean(
            required=False,
            description='Test has post_test hooks.')
        has_load_tests = graphene.Boolean(
            required=False,
            description='Test has load_tests hooks.')
        description = graphene.String(
            required=False,
            description='A few words summarizing the configuration')
        prometheus_url = graphene.String(
            required=False,
            description='Endpoint for metrics fetching')

    Output = gql_util.ValidationInterface

    @staticmethod
    def validate(
            info, name, type_slug, project_id,
            test_source_id=None, configuration_parameters=None, configuration_envvars=None,
            has_pre_test=False, has_post_test=False, has_load_tests=False, description=None,
            configuration_monitorings=None, prometheus_url=None
    ):
        project_id = str(project_id)
        assert type_slug in const.TESTTYPE_CHOICE, \
            f'invalid choice of type_slug (valid choices: {const.TESTTYPE_CHOICE})'

        is_external = type_slug in const.TESTTYPE_EXTERNAL

        name = validators.validate_text(name)

        role, user_id = gql_util.get_request_role_userid(
            info,
            (const.ROLE_ADMIN, const.ROLE_TENANT_ADMIN, const.ROLE_MANAGER, const.ROLE_TESTER)
        )

        if not is_external:
            assert any((has_pre_test, has_post_test, has_load_tests)), \
                f'At least one section is required'

            repo_query = {
                'type_slug': type_slug,
                'confName': name,
                'projId': project_id,
                'userId': user_id,
                'sourceId': str(test_source_id) or "",
                'fetchSource': bool(test_source_id),
            }
            repo = hce(current_app.config, '''query (
                    $confName:String, $sourceId:uuid!, $fetchSource:Boolean!, 
                    $projId:uuid!, $userId:String!, $type_slug:String!
            ) {
                test_source (where:{
                        id:{_eq:$sourceId}, 
                        project:{
                            userProjects:{user_id:{_eq:$userId}}
                            is_deleted: {_eq:false}
                        }
                }) @include(if:$fetchSource) {
                    source_type
                    project {
                        userProjects { user_id }
                    }
                    repository {
                        name
                        url
                        configuration_type { slug_name }
                        project {
                            userProjects { user_id }
                        }
                    }
                    test_creator {
                        name
                        data
                        min_wait
                        max_wait
                        project {
                            userProjects { user_id }
                        }
                    }
                }
                
                parameter (where:{configuration_type:{slug_name:{_eq:$type_slug}}}) {
                    slug_name
                    default_value
                    param_name
                    name
                }
                
                user_project (where:{ user_id:{_eq:$userId}, project_id:{_eq:$projId} }) {
                    id
                }
                
                project_by_pk (id:$projId) {
                    id
                }
                
                configuration (where:{
                    is_deleted: {_eq:false},
                    name:{_eq:$confName}, 
                    project_id:{_eq:$projId}, 
                    project:{
                        userProjects:{user_id:{_eq:$userId}},
                        is_deleted: {_eq:false}
                    }
                }) {
                    id
                }
            }''', repo_query)

            if role not in (const.ROLE_ADMIN, const.ROLE_TENANT_ADMIN):
                assert repo.get('user_project', None), \
                    f'non-admin ({role}) user {user_id} does not have access to project {project_id}'

            assert repo.get('project_by_pk', None), f'project "{project_id}" does not exist'

            assert len(repo.get('configuration', [])) == 0, f'configuration named "{name}" already exists'

        query_data = {
            'name': name,
            'project_id': project_id,
            'has_pre_test': has_pre_test,
            'has_post_test': has_post_test,
            'has_load_tests': has_load_tests,
        }

        if user_id:
            query_data['created_by_id'] = user_id

        if type_slug:
            query_data['type_slug'] = type_slug

        if prometheus_url is not None:
            query_data['prometheus_url'] = prometheus_url

        if configuration_envvars:
            for rp in configuration_envvars:
                assert rp['name'].replace('_', '').isalnum(), \
                    f'configuration runner_parameter "{rp["name"]}" is not alphanumeric'
                assert not rp['name'].startswith('BOLT_'), f'environment variable cannot start with BOLT_'
            query_data['configuration_envvars'] = {
                'data': [{
                    'name': x['name'],
                    'value': x['value'],
                } for x in configuration_envvars]
            }

        if has_load_tests:
            patched_params = validators.validate_load_test_params(configuration_parameters or [], defaults=repo['parameter'])
            if patched_params:
                query_data['configuration_parameters'] = {'data': []}
                for parameter_slug, param_value in patched_params.items():
                    query_data['configuration_parameters']['data'].append({
                        'parameter_slug': parameter_slug,
                        'value': param_value,
                    })
                    # calculate instances number based on num of users
                    if parameter_slug == const.TESTPARAM_USERS:
                        query_data['instances'] = utils.get_instances_count(patched_params, param_value)

        if configuration_monitorings:
            query_data['configuration_monitorings'] = {'data': []}
            for item in configuration_monitorings:
                query_data['configuration_monitorings']['data'].append({
                    'query': item['query'],
                    'chart_type': item['chart_type'],
                    'unit': item['unit'],
                })

        if test_source_id:
            test_source = repo.get('test_source')
            assert len(test_source), f'test_source {str(test_source_id)} does not exist'
            test_source = test_source[0]

            if test_source['source_type'] == const.CONF_SOURCE_REPO:
                assert test_source.get('repository', None), f'repository does not exist'
                validators.validate_repository(user_id=user_id, repo_config=test_source['repository'])
                validators.validate_accessibility(current_app.config, test_source['repository']['url'])
                query_data['test_source_id'] = str(test_source_id)
            elif test_source['source_type'] == const.CONF_SOURCE_JSON:
                assert test_source.get('test_creator', None), f'test_creator does not exist'
                validators.validate_test_creator(
                    test_source['test_creator']['data'],
                    min_wait=test_source['test_creator']['min_wait'],
                    max_wait=test_source['test_creator']['max_wait']
                )
                query_data['test_source_id'] = str(test_source_id)
            else:
                raise AssertionError(f'test source {str(test_source_id)} is invalid: {test_source["source_type"]}')

        if description:
            query_data['description'] = str(description)

        return query_data

    def mutate(
            self, info, name, type_slug, project_id, test_source_id=None, configuration_parameters=None,
            configuration_envvars=None, has_pre_test=False, has_post_test=False, has_load_tests=False,
            description=None, configuration_monitorings=None, prometheus_url=None):
        CreateValidate.validate(
            info, name, type_slug, project_id, test_source_id, configuration_parameters,
            configuration_envvars, has_pre_test, has_post_test, has_load_tests, description,
            configuration_monitorings, prometheus_url
        )
        return gql_util.ValidationResponse(ok=True)


class Create(CreateValidate):
    """Validates and saves configuration for a testrun."""

    Output = gql_util.OutputTypeFactory(types.ConfigurationType, 'Create')

    def mutate(
            self, info, name, type_slug, project_id, test_source_id=None, configuration_parameters=None,
            configuration_envvars=None, has_pre_test=False, has_post_test=False, has_load_tests=False,
            description=None, configuration_monitorings=None, prometheus_url=None):
        query_params = CreateValidate.validate(
            info, name, type_slug, project_id, test_source_id, configuration_parameters, configuration_envvars,
            has_pre_test, has_post_test, has_load_tests, description, configuration_monitorings,
            prometheus_url
        )

        query = '''mutation ($data:[configuration_insert_input!]!) {
            insert_configuration(
                objects: $data
            ) {
                returning { 
                    id 
                    name 
                    type_slug 
                    description 
                    project_id 
                    test_source_id
                    has_pre_test
                    has_post_test
                    has_load_tests
                    configuration_parameters {
                        parameter_slug
                        value
                    }
                    configuration_envvars {
                        name
                        value
                    }
                    configuration_monitorings {
                        query
                        chart_type
                        unit
                    }
                } 
            }
        }'''

        conf_response = hce(current_app.config, query, variable_values={'data': query_params})
        assert conf_response['insert_configuration'], f'cannot save configuration ({str(conf_response)})'
        return gql_util.OutputValueFromFactory(Create, conf_response['insert_configuration'])
