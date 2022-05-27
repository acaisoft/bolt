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

import { useMutationWithState } from 'hooks'

const RUN_TEST_CONFIGURATION = gql`
  mutation runTestConfiguration($configurationId: UUID!, $coldStart: Boolean) {
    testrun_start(conf_id: $configurationId, no_cache: $coldStart) {
      execution_id
    }
  }
`
export function useConfigurationRun(configurationId) {
  const { loading, mutation, error } = useMutationWithState(RUN_TEST_CONFIGURATION, {
    variables: { configurationId },
  })

  return { loading, mutation, error }
}

const DELETE_TEST_CONFIGURATION = gql`
  mutation deleteTestConfiguration($configurationId: UUID) {
    testrun_configuration_delete(pk: $configurationId) {
      affected_rows
    }
  }
`
export function useConfigurationDelete(configurationId) {
  const { loading, mutation, error } = useMutationWithState(
    DELETE_TEST_CONFIGURATION,
    { variables: { configurationId } }
  )

  return { loading, mutation, error }
}

const CLONE_SCENARIO = gql`
  mutation clone_scenario($configurationId: UUID!) {
    testrun_configuration_clone(configuration_id: $configurationId) {
      returning {
        new_configuration_id
      }
      affected_rows
    }
  }
`

export function useConfigurationClone(configurationId) {
  const { loading, mutation, error } = useMutationWithState(CLONE_SCENARIO, {
    variables: { configurationId },
  })

  return { loading, mutation, error }
}
