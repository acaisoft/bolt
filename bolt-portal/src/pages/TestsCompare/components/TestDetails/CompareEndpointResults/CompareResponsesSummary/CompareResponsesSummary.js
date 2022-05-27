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

import React from 'react'
import { Grid } from '@material-ui/core'
import { formatThousands, formatPercent } from 'utils/numbers'
import { useEndpointSummary } from 'hooks'
import { LabeledValue, NoWrap, SectionHeader } from 'components'

function CompareResponsesSummary({ data }) {
  const {
    successes,
    requests,
    failures,
    requestsPerSecond,
    minResponseTime,
    averageResponseTime,
    maxResponseTime,
  } = useEndpointSummary(data)

  return (
    <>
      <SectionHeader title="Summary" size="small" marginBottom />
      <Grid container spacing={5} alignItems="flex-start">
        <Grid item xs={6} sm={4}>
          <LabeledValue label="Total requests" value={formatThousands(requests)} />
        </Grid>
        <Grid item xs={6} sm={4}>
          <LabeledValue
            label="Success"
            value={
              <NoWrap>
                {formatPercent(successes / requests)} ({formatThousands(successes)})
              </NoWrap>
            }
          />
        </Grid>
        <Grid item xs={6} sm={4}>
          <LabeledValue
            label="Fail"
            value={
              <NoWrap>
                {formatPercent(failures / requests)} ({formatThousands(failures)})
              </NoWrap>
            }
          />
        </Grid>
        <Grid item xs={6} sm={4}>
          <LabeledValue label="Req/s" value={formatThousands(requestsPerSecond)} />
        </Grid>
        <Grid item xs={6} sm={4}>
          <LabeledValue
            label={
              <div>
                Response Time [ms]
                <br />
                <NoWrap>Min. / Avg. / Max.</NoWrap>
              </div>
            }
            value={
              <NoWrap>
                {formatThousands(minResponseTime)} /{' '}
                {formatThousands(averageResponseTime)} /{' '}
                {formatThousands(maxResponseTime)}
              </NoWrap>
            }
          />
        </Grid>
      </Grid>
    </>
  )
}

export default CompareResponsesSummary
