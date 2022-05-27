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

import { mockGraphqlData } from 'utils/tests/mocks'
import {
  GET_CONFIGURATION,
  GET_CONFIGURATION_TYPES,
  GET_PARAMETERS,
  GET_TEST_SOURCES_FOR_PROJECT,
} from './graphql'

const mockedConfigurationTypesData = {
  configurationTypes: [
    {
      id: 'fc9c1146-44d7-4054-a12c-4c0f70487230',
      name: 'Performance',
      slug_name: 'load_tests',
    },
  ],
}

const testSourceId = '529606f0-58ca-4ee6-8374-2bf4ca6d5635'
const mockedTestSourcesData = {
  testSources: [
    {
      id: testSourceId,
      source_type: 'repository',
      repository: {
        id: 'd8d3c51d-d177-4bf3-bde9-0309aa062701',
        name: 'LoadTestsRepo',
        type_slug: 'load_tests',
      },
      test_creator: null,
    },
  ],
}

const testParametersMockData = {
  parameters: [
    {
      id: '9352e6d1-229a-4938-9e9f-9ea8ab0600e0',
      name: 'time',
      param_name: '-t',
      param_type: 'str',
      default_value: '10',
      slug_name: 'load_tests_duration',
      type_slug: 'load_tests',
    },
    {
      id: '35f63de7-b372-4eb2-8f67-a471a6c67b50',
      name: 'users/second',
      param_name: '-r',
      param_type: 'int',
      default_value: '500',
      slug_name: 'load_tests_rampup',
      type_slug: 'load_tests',
    },
    {
      id: '7dfe8616-365a-4aec-895f-f8a7eb8f30c6',
      name: 'users',
      param_name: '-c',
      param_type: 'int',
      default_value: '1000',
      slug_name: 'load_tests_users',
      type_slug: 'load_tests',
    },
    {
      id: '7a8423d3-88ce-4277-ac8d-131a6fb32314',
      name: 'host',
      param_name: '-H',
      param_type: 'str',
      default_value: '',
      slug_name: 'load_tests_host',
      type_slug: 'load_tests',
    },
    {
      id: '97285024-0d4d-439d-abee-705c04cafec8',
      name: 'monitoring duration',
      param_name: '-md',
      param_type: 'int',
      default_value: '10',
      slug_name: 'monitoring_duration',
      type_slug: 'load_tests',
    },
    {
      id: '8a8ef988-62b6-4338-a350-9712e00b024b',
      name: 'monitoring interval',
      param_name: '-mi',
      param_type: 'int',
      default_value: '5',
      slug_name: 'monitoring_interval',
      type_slug: 'load_tests',
    },
    {
      id: 'c5c537f7-e1a8-40e7-ac50-45f54dc592bd',
      name: 'file name',
      param_name: '-f',
      param_type: 'str',
      default_value: 'load_tests.py',
      slug_name: 'load_tests_file_name',
      type_slug: 'load_tests',
    },
    {
      id: 'a426ff2e-b12c-49e9-b0ef-79da32d6a113',
      name: 'repository branch',
      param_name: '-b',
      param_type: 'str',
      default_value: 'master',
      slug_name: 'load_tests_repository_branch',
      type_slug: 'load_tests',
    },
  ],
}

export const projectId = 'f3e2db7e-20b7-43c7-a32c-a47f958a2647'
export const configurationId = '6f0428ac-0579-4a65-bb86-2bb049398b57'
export const testConfigurationBase = {
  configuration: {
    id: configurationId,
    name: 'google (Cloned at 22/04/2022 - 09:30:30) MB',
    configuration_parameters: [
      {
        parameter_slug: 'load_tests_duration',
        value: '20',
      },
      {
        parameter_slug: 'load_tests_rampup',
        value: '1',
      },
      {
        parameter_slug: 'load_tests_users',
        value: '5',
      },
      {
        parameter_slug: 'load_tests_host',
        value: 'http://google.com',
      },
      {
        parameter_slug: 'load_tests_file_name',
        value: 'load_tests.py',
      },
      {
        parameter_slug: 'load_tests_repository_branch',
        value: 'master',
      },
    ],
    type_slug: 'load_tests',
    test_source: {
      id: testSourceId,
      source_type: 'repository',
    },
    has_pre_test: false,
    has_post_test: false,
    has_load_tests: true,
    has_monitoring: false,
    configuration_envvars: [
      {
        name: 'TEST_KEY',
        value: 'TEST_VALUE',
      },
      {
        name: 'NEW_SECRET_KEY',
        value: 'SECRET_VALUE',
      },
    ],
  },
}

export function getParameterLabel(slug) {
  const item = testParametersMockData.parameters.find(
    ({ slug_name }) => slug_name === slug
  )

  if (!item) return ''
  return item.name
}

const testConfigurationPerformed = {
  configuration: {
    ...testConfigurationBase.configuration,
    performed: true,
  },
}

const testConfigurationNotPerformed = {
  configuration: {
    ...testConfigurationBase.configuration,
    performed: false,
  },
}

export const configurationTypesMock = mockGraphqlData(
  GET_CONFIGURATION_TYPES,
  mockedConfigurationTypesData
)

export const testSourcesMock = mockGraphqlData(
  GET_TEST_SOURCES_FOR_PROJECT,
  mockedTestSourcesData,
  { projectId }
)

export const testParametersMock = mockGraphqlData(
  GET_PARAMETERS,
  testParametersMockData
)

export const testConfigurationPerformedMock = mockGraphqlData(
  GET_CONFIGURATION,
  testConfigurationPerformed,
  { configurationId }
)
export const testConfigurationNotPerformedMock = mockGraphqlData(
  GET_CONFIGURATION,
  testConfigurationNotPerformed,
  { configurationId }
)
