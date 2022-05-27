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

import { useMemo } from 'react'
import { max, mean, min, sum } from 'lodash'

export function useEndpointSummary(data) {
  const summary = useMemo(
    () => ({
      requests: sum(data.map(x => +x.num_requests)),
      successes: sum(data.map(x => +x.num_successes)),
      failures: sum(data.map(x => +x.num_failures)),
      requestsPerSecond: sum(
        data.map(x =>
          +x.requests_per_second < 1 && x.requests_per_second > 0
            ? 1
            : x.requests_per_second
        )
      ),
      minResponseTime: min(data.map(x => +x.min_response_time)),
      averageResponseTime: mean(data.map(x => +x.average_response_time)),
      maxResponseTime: max(data.map(x => +x.max_response_time)),
    }),
    [data]
  )

  return summary
}
