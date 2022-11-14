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

export const GET_GROUPS_WITH_RESULTS = gql`
  query ($testRunId: uuid) {
    group(
      where: { test_cases: { test_results: { test_run_id: { _eq: $testRunId } } } }
    ) {
      test_cases(where: { test_results: { test_run_id: { _eq: $testRunId } } }) {
        name_from_file
        test_results(where: { test_run_id: { _eq: $testRunId } }) {
          result
          message
          duration
        }
      }
      id
      name
    }
  }
`

export const GET_DESCRIPTION_AND_CUSTOM_FIELDS_AND_TOTALS = gql`
  query ($scenarioId: uuid, $testRunId: uuid) {
    configuration(where: { id: { _eq: $scenarioId } }) {
      description
      test_runs(where: { id: { _eq: $testRunId } }) {
        custom_fields {
          name
          value
        }
      }
      total_results: test_runs(where: { id: { _eq: $testRunId } }) {
        total
        successes
        errors
        skipped
        failures
      }
    }
  }
`
