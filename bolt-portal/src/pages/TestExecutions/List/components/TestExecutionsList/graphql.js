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

export const TEST_EXECUTION_ITEM_FRAGMENT = gql`
  fragment testExecutionListItem on execution {
    id
    start
    status
    configuration {
      id
      name
      configuration_type {
        id
        name
      }
      project {
        id
        name
      }
    }
    result_aggregate_aggregate {
      aggregate {
        count
        sum {
          number_of_successes
          number_of_fails
        }
        max {
          number_of_users
        }
      }
    }
  }
`

export const GET_TEST_EXECUTIONS = gql`
  query getExecutions(
    $projectId: uuid
    $limit: Int
    $offset: Int
    $order_by: [execution_order_by!]
  ) {
    executions: execution(
      where: { configuration: { project_id: { _eq: $projectId } } }
      limit: $limit
      offset: $offset
      order_by: $order_by
    ) {
      ...testExecutionListItem
    }
    executionsAggregate: execution_aggregate(
      where: { configuration: { project_id: { _eq: $projectId } } }
    ) {
      aggregate {
        count
      }
    }
  }

  ${TEST_EXECUTION_ITEM_FRAGMENT}
`
