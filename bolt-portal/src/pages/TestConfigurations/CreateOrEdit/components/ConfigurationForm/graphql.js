/**
 * Copyright (c) 2022 Acaisoft
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { gql } from '@apollo/client'

export const GET_CONFIGURATION = gql`
  query getTestConfiguration($configurationId: uuid!) {
    configuration: configuration_by_pk(id: $configurationId) {
      id
      name
      performed
      configuration_parameters {
        parameter_slug
        value
      }
      type_slug
      test_source {
        id
        source_type
      }
      has_pre_test
      has_post_test
      has_load_tests
      has_monitoring
      configuration_envvars {
        name
        value
      }
    }
  }
`

export const ADD_CONFIGURATION_MUTATION = gql`
  mutation addTestConfiguration(
    $name: String!
    $type_slug: String!
    $configuration_parameters: [ConfigurationParameterInput]
    $test_source_id: UUID
    $project_id: UUID!
    $has_pre_test: Boolean
    $has_post_test: Boolean
    $has_load_tests: Boolean
    $has_monitoring: Boolean
    $configuration_envvars: [ConfigurationEnvVarInput]
  ) {
    testrun_configuration_create(
      configuration_parameters: $configuration_parameters
      name: $name
      project_id: $project_id
      type_slug: $type_slug
      test_source_id: $test_source_id
      has_pre_test: $has_pre_test
      has_post_test: $has_post_test
      has_load_tests: $has_load_tests
      has_monitoring: $has_monitoring
      configuration_envvars: $configuration_envvars
    ) {
      returning {
        id
      }
    }
  }
`
export const EDIT_CONFIGURATION_MUTATION = gql`
  mutation editTestConfiguration(
    $id: UUID!
    $name: String!
    $type_slug: String!
    $configuration_parameters: [ConfigurationParameterInput]
    $test_source_id: UUID
    $has_pre_test: Boolean
    $has_post_test: Boolean
    $has_load_tests: Boolean
    $has_monitoring: Boolean
    $configuration_envvars: [ConfigurationEnvVarInput]
  ) {
    testrun_configuration_update(
      id: $id
      configuration_parameters: $configuration_parameters
      name: $name
      type_slug: $type_slug
      test_source_id: $test_source_id
      has_pre_test: $has_pre_test
      has_post_test: $has_post_test
      has_load_tests: $has_load_tests
      has_monitoring: $has_monitoring
      configuration_envvars: $configuration_envvars
    ) {
      returning {
        id
      }
    }
  }
`

export const EDIT_PERFORMED_CONFIGURATION_MUTATION = gql`
  mutation editPerformedTestConfiguration(
    $id: UUID!
    $name: String!
    $configuration_envvars: [ConfigurationEnvVarInput]
  ) {
    testrun_configuration_update(
      id: $id
      name: $name
      configuration_envvars: $configuration_envvars
    ) {
      returning {
        id
      }
    }
  }
`

export const GET_TEST_SOURCES_FOR_PROJECT = gql`
  query getTestSourcesForProject($projectId: uuid) {
    testSources: test_source(where: { project_id: { _eq: $projectId } }) {
      id
      source_type
      repository {
        id
        name
        type_slug
      }
      test_creator {
        id
        name
        type_slug
      }
    }
  }
`

export const GET_CONFIGURATION_TYPES = gql`
  query getConfigurationTypesForSelector {
    configurationTypes: configuration_type {
      id
      name
      slug_name
    }
  }
`

export const GET_PARAMETERS = gql`
  query getParameters {
    parameters: parameter {
      id
      name
      param_name
      param_type
      default_value
      slug_name
      type_slug
    }
  }
`
