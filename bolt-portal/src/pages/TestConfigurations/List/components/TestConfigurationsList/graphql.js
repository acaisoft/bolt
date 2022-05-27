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

const TEST_CONFIGURATION_LIST_ITEM = gql`
  fragment testConfigurationListItem on configuration {
    id
    name
    performed
    configuration_type {
      id
      name
    }
    configuration_parameters {
      id
      value
      parameter_slug
    }
    executions(order_by: { start: desc }, limit: 1) {
      id
      start
      execution_request_totals_aggregate {
        aggregate {
          sum {
            num_failures
            num_requests
          }
          min {
            min_response_time
          }
          avg {
            average_response_time
          }
          max {
            max_response_time
          }
        }
      }
    }
    test_source {
      id
      source_type
      repository {
        id
        name
        url
      }
      test_creator {
        id
        name
      }
    }
  }
`

export const SUBSCRIBE_TO_TEST_CONFIGURATION_AGGREGATE_LIST_ITEM = gql`
  subscription subscribeConfigurationListItem($projectId: uuid) {
    configurationsAggregate: configuration_aggregate(
      where: { project_id: { _eq: $projectId }, is_deleted: { _eq: false } }
    ) {
      aggregate {
        count
      }
    }
  }
`

export const SUBSCRIBE_TO_TEST_CONFIGURATION_LIST_ITEM = gql`
  subscription subscribeConfigurationListItem(
    $projectId: uuid
    $limit: Int
    $offset: Int
    $order_by: [configuration_order_by!]
  ) {
    configurations: configuration(
      where: { project_id: { _eq: $projectId }, is_deleted: { _eq: false } }
      limit: $limit
      offset: $offset
      order_by: $order_by
    ) {
      ...testConfigurationListItem
    }
  }

  ${TEST_CONFIGURATION_LIST_ITEM}
`
