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

from .utils import get_current_datetime
from services.hasura import hce, hce_with_user
from services import gql_util, const


class CloneInterface(graphene.Interface):
    name = graphene.String()
    cloned_configuration_id = graphene.UUID()
    new_configuration_id = graphene.UUID()


class Clone(graphene.Mutation):

    class Arguments:
        configuration_id = graphene.UUID(required=True, description='ID of cloned configuration')
        configuration_name = graphene.String(required=False, description='New configuration name')

    Output = gql_util.OutputInterfaceFactory(CloneInterface, 'Create')

    @staticmethod
    def get_cloned_configuration(_id):
        query = '''
            query ($id: uuid) {
              configuration(where: {id: {_eq: $id}}) {
                name
                project_id
                type_slug
                description
                test_source_id
                has_pre_test
                has_post_test
                has_load_tests
                configuration_envvars{
                  name
                  value
                }
                configuration_parameters{
                  value
                  parameter_slug
                }
              }
            }
        '''
        response = hce(current_app.config, query, variable_values={'id': str(_id)})
        return response['configuration'][0]

    @staticmethod
    def insert_new_configuration(cloned_configuration_data, user_id, role):
        query = '''
            mutation (
                $name: String!, 
                $type_slug: String!, 
                $description: String!,
                $project_id: UUID!, 
                $test_source_id: UUID, 
                $has_pre_test: Boolean, 
                $has_post_test: Boolean, 
                $has_load_tests: Boolean, 
                $configuration_envvars: [ConfigurationEnvVarInput], 
                $configuration_monitorings: [ConfigurationMonitoringInput],
                $configuration_parameters: [ConfigurationParameterInput]) {    
                    testrun_configuration_create(
                        name: $name, 
                        type_slug: $type_slug, 
                        description: $description
                        project_id: $project_id, 
                        test_source_id: $test_source_id, 
                        has_pre_test: $has_pre_test, 
                        has_post_test: $has_post_test, 
                        has_load_tests: $has_load_tests, 
                        configuration_envvars: $configuration_envvars,
                        configuration_monitorings: $configuration_monitorings
                        configuration_parameters: $configuration_parameters) {
                            affected_rows
                            returning {
                                id
                                name
                            }
                    }
            }
        '''
        response = hce_with_user(
            current_app.config, query, user_id=user_id, role=role, variable_values=cloned_configuration_data)
        return response['testrun_configuration_create']['returning'][0]

    def mutate(self, info, configuration_id, configuration_name=None):
        role, user_id = gql_util.get_request_role_userid(
            info, (const.ROLE_ADMIN, const.ROLE_TENANT_ADMIN, const.ROLE_MANAGER, const.ROLE_TESTER))
        cloned_configuration_data = Clone.get_cloned_configuration(configuration_id)
        if configuration_name is None:
            date_now = get_current_datetime()
            configuration_name = '{0} (Cloned at {1})'.format(cloned_configuration_data['name'], date_now)
        cloned_configuration_data['name'] = configuration_name
        current_app.logger.info(cloned_configuration_data)
        new_configuration_data = Clone.insert_new_configuration(cloned_configuration_data, user_id, role)
        return gql_util.OutputValueFromFactory(Clone, {'returning': [{
            'name': new_configuration_data['name'],
            'cloned_configuration_id': configuration_id,
            'new_configuration_id': new_configuration_data['id']
        }]})
