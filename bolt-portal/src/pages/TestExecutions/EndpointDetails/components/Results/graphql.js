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

export const QUERY_EXECUTION_RESULTS_PER_ENDPOINT_PER_TICK = gql`
  query sub($executionId: uuid!, $name: String) {
    errorsPerTick: execution_errors(
      where: { execution_id: { _eq: $executionId },
      name: {_eq: $name}}
      order_by: { timestamp: asc }
    ) {
      id
      number_of_occurrences
      exception_data
      timestamp
    }
    resultsPerTick: execution_requests(
      where: { execution_id: { _eq: $executionId },
      name: {_eq: $name}}
      order_by: { timestamp: asc }
    ) {
      id
      num_requests
      num_failures
      successes_per_tick
      timestamp
      average_response_time
      max_response_time
      min_response_time
      total_content_length
    }
  }
`
