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

const EXECUTION_TIME_PARAMETER_FRAGMENT = gql`
  fragment executionTimeParameter on execution {
    configuration {
      id
      configuration_parameters(where: { parameter: { name: { _eq: "time" } } }) {
        id
        value
      }
    }
  }
`

export const SUBSCRIBE_TO_EXECUTION_DETAILS = gql`
  subscription subscribeToExecution($executionId: uuid!) {
    execution: execution_by_pk(id: $executionId) {
      id
      start
      start_locust
      end_locust
      argo_name
      status
      cpu_warning
      configuration {
        id
        name
      }
      configuration_snapshot
      ...executionTimeParameter
    }
  }

  ${EXECUTION_TIME_PARAMETER_FRAGMENT}
`
