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


class UpdateValidate(graphene.Mutation):
    """
    Updates configuration for a testrun. All fields are optional.
    """
    class Arguments:
        id = graphene.UUID(
            description='Configuration object id')
        name = graphene.String(
            required=False,
            description='Name, not unique.')
        type_slug = graphene.String(
            required=False,
            description=f'Configuration type: "{const.TESTTYPE_LOAD}"')
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
        monitoring_chart_configuration = graphene.JSONString(
            required=False,
            description='Monitoring charts definition'
        )

    Output = gql_util.ValidationInterface

    @staticmethod
    def validate(
            info, id, name=None, type_slug=None, test_source_id=None, configuration_parameters=None,
            configuration_envvars=None, has_pre_test=None, has_post_test=None, has_load_tests=None,
            has_monitoring=None, monitoring_chart_configuration=None):

        role, user_id = gql_util.get_request_role_userid(
            info, (const.ROLE_ADMIN, const.ROLE_TENANT_ADMIN, const.ROLE_MANAGER, const.ROLE_TESTER))

        query_data = {
            'configuration_parameters': {'data': []}
        }

        original = hce(current_app.config, '''query ($confId:uuid!, $userId:uuid!) {
            configuration (where:{
                id:{_eq:$confId}, 
                project:{
                    userProjects:{user_id:{_eq:$userId}}
                    is_deleted: {_eq:false}
                }
            }) {
                performed
                name
                type_slug
                project_id
                test_source_id
                configuration_parameters { parameter_slug value configuration_id }
                configuration_envvars { name value configuration_id }
                has_pre_test 
                has_post_test 
                has_load_tests 
                has_monitoring
                monitoring_chart_configuration
            }
        }''', {'confId': str(id), 'userId': user_id})
        assert len(original['configuration']), f'configuration does not exist'

        if name:
            name = validators.validate_text(name)

        if type_slug:
            assert type_slug in const.TESTTYPE_CHOICE, \
                f'invalid choice of type_slug (valid choices: {const.TESTTYPE_CHOICE})'
        else:
            type_slug = original['configuration'][0]['type_slug']

        repo_query = {
            'type_slug': type_slug,
            'confId': str(id),
            'confName': name or '',
            'userId': user_id,
            'sourceId': str(test_source_id) or "",
            'fetchSource': bool(test_source_id),
        }

        repo = hce(current_app.config, '''query ($confId:uuid!, $confName:String, $sourceId:uuid!, $fetchSource:Boolean!, $userId:uuid!, $type_slug:String!) {
            test_source (where:{
                    id:{_eq:$sourceId},
                    is_deleted: {_eq:false}, 
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
                id
                default_value
                param_name
                name
                slug_name
            }
                        
            isNameUnique: configuration (where:{name:{_eq:$confName}, project:{
                userProjects:{user_id:{_eq:$userId}}
                is_deleted: {_eq:false}
            }}) {
                id
            }
            
            hasUserAccess: configuration (where:{id:{_eq:$confId}, project:{userProjects:{user_id:{_eq:$userId}}}}) {
                id
            }
        }''', repo_query)

        if role not in (const.ROLE_ADMIN, const.ROLE_TENANT_ADMIN):
            assert repo.get('hasUserAccess', None), \
                f'non-admin ({role}) user {user_id} does not have access to configuration {str(id)}'

        if has_pre_test is not None:
            query_data['has_pre_test'] = has_pre_test
        if has_post_test is not None:
            query_data['has_post_test'] = has_post_test
        if has_load_tests is not None:
            query_data['has_load_tests'] = has_load_tests
        if has_monitoring is not None:
            query_data['has_monitoring'] = has_monitoring
        if monitoring_chart_configuration is not None:
            query_data['monitoring_chart_configuration'] = monitoring_chart_configuration

        sections = [x for x in (
            query_data.get('has_pre_test', None),
            query_data.get('has_post_test', None),
            query_data.get('has_load_tests', None),
            query_data.get('has_monitoring', None),
            query_data.get('monitoring_chart_configuration', None)
        ) if x is not None]
        assert len(sections), \
            f'At least one section is required'

        if name and name != original['configuration'][0]['name']:
            name = validators.validate_text(name)
            assert len(repo.get('isNameUnique', [])) == 0, f'configuration named "{name}" already exists'
            query_data['name'] = name

        if type_slug:
            query_data['type_slug'] = type_slug

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

        if has_load_tests:
            patched_params = validators.validate_load_test_params(configuration_parameters, defaults=repo['parameter'])
            if patched_params:
                for parameter_slug, param_value in patched_params.items():
                    query_data['configuration_parameters']['data'].append({
                        'parameter_slug': parameter_slug,
                        'value': param_value,
                        'configuration_id': str(id),
                    })
                    # calculate instances number based on num of users
                    if parameter_slug == const.TESTPARAM_USERS:
                        query_data['instances'] = utils.get_instances_count(patched_params, param_value)

        if has_monitoring:
            monitoring_parameters = validators.validate_monitoring_params(configuration_parameters or [],
                                                                          defaults=repo['parameter'])
            if monitoring_parameters:
                for slug, value in monitoring_parameters.items():
                    query_data['configuration_parameters']['data'].append({
                        'parameter_slug': slug,
                        'value': value,
                        'configuration_id': str(id),
                    })

        if configuration_envvars:
            for rp in configuration_envvars:
                assert rp['name'].replace('_', '').isalnum(), \
                    f'configuration runner_parameter "{rp["name"]}" is not alphanumeric'
                assert not rp['name'].startswith('BOLT_'), f'configuration_envvars.name cannot start with BOLT_'
            query_data['configuration_envvars'] = {
                'data': [{
                    'name': x['name'],
                    'value': x['value'],
                    'configuration_id': str(id),
                } for x in configuration_envvars]
            }

        if monitoring_chart_configuration:
            assert validators.validate_monitoring_chart_configuration(monitoring_chart_configuration), \
                f"monitoring chart configuration doesn't have required format"


        return query_data

    def mutate(self, info, id, name=None, type_slug=None, test_source_id=None, configuration_parameters=None,
               configuration_envvars=None, has_pre_test=None, has_post_test=None, has_load_tests=None,
               has_monitoring=None):
        UpdateValidate.validate(
            info, id, name, type_slug, test_source_id, configuration_parameters, configuration_envvars,
            has_pre_test, has_post_test, has_load_tests, has_monitoring
        )
        return gql_util.ValidationResponse(ok=True)


class Update(UpdateValidate):
    """Validates and saves configuration for a testrun."""

    Output = gql_util.OutputTypeFactory(types.ConfigurationType, 'Update')

    def mutate(
            self, info, id, name=None, type_slug=None, test_source_id=None, configuration_parameters=None,
            configuration_envvars=None, has_pre_test=None, has_post_test=None, has_load_tests=None,
            has_monitoring=None, monitoring_chart_configuration=None):
        query_params = UpdateValidate.validate(
            info, id, name, type_slug, test_source_id, configuration_parameters, configuration_envvars,
            has_pre_test, has_post_test, has_load_tests, has_monitoring, monitoring_chart_configuration
        )

        params = query_params.pop('configuration_parameters', {'data': []})['data']
        envs = query_params.pop('configuration_envvars', {'data': []})['data']

        query = '''mutation (
            $id:uuid!, 
            $data:configuration_set_input!
            $params:[configuration_parameter_insert_input!]!
            $envs:[configuration_envvars_insert_input!]!
        ) {
            
            delete_configuration_parameter (
                where: {configuration_id:{_eq:$id}}
            ) {
                affected_rows
            } 
            
            insert_configuration_parameter (
                objects: $params
                on_conflict: {
                    constraint: configuration_parameter_pkey
                    update_columns: [ value ]
                }
            ) {
                affected_rows
            }
            
            delete_configuration_envvars (
                where: {configuration_id:{_eq:$id}}
            ) {
                affected_rows
            } 
        
            insert_configuration_envvars (
                objects: $envs
                on_conflict: {
                    constraint: configuration_envvars_pkey
                    update_columns: [ value ]
                }
            ) {
                affected_rows
            }
            
            update_configuration(
                where:{id:{_eq:$id}},
                _set: $data
            ) {
                returning { 
                    id 
                    name 
                    type_slug 
                    project_id 
                    test_source_id 
                    has_pre_test
                    has_post_test
                    has_load_tests
                    has_monitoring
                    configuration_envvars { name value }
                    configuration_parameters { parameter_slug value }
                    monitoring_chart_configuration
                } 
            }
        }'''

        conf_response = hce(current_app.config, query, variable_values={
            'id': str(id),
            'data': query_params,
            'params': params,
            'envs': envs,
        })
        assert conf_response['update_configuration'], f'cannot update configuration ({str(conf_response)})'
        return gql_util.OutputValueFromFactory(Update, conf_response['update_configuration'])
