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

import { connect as echartsConnect } from 'echarts'
import React, { useMemo, useEffect } from 'react'
import { useSubscription } from '@apollo/client'
import { Paper } from '@material-ui/core'
import {
  SectionHeader,
  LoadingPlaceholder,
  ErrorPlaceholder,
} from 'components/index'
import { Chart } from 'config/constants'

import RequestsChart from './RequestsChart'
import { SUBSCRIBE_TO_EXECUTION_RESULTS_PER_ENDPOINT_PER_TICK } from './graphql'

function ResultsPerEndpointPerTick({
  classes,
  executionId,
  name
}) {

  const { resultsPerEndpointPerTick, loading, error } = useResultsPerEndpointPerTickQuery(executionId, name)

  const syncGroup = 'chartsGroup'

  useEffect(() => {
    echartsConnect(syncGroup)
  }, [])

  if (loading || error || resultsPerEndpointPerTick.length === 0) {
    return (
      <Paper square className={classes.tile}>
        {loading ? (
          <LoadingPlaceholder title="Loading data..." height={Chart.HEIGHT} />
        ) : error ? (
          <ErrorPlaceholder error={error} height={Chart.HEIGHT} />
        ) : (
          <LoadingPlaceholder
            title="Waiting for test run results..."
            height={Chart.HEIGHT}
          />
        )}
      </Paper>
    )
  }

  return (
    <React.Fragment>
      <Paper square className={classes.tile}>
        <SectionHeader
          size="small"
          className={classes.tileTitle}
          title="Requests/s"
        >
        </SectionHeader>
        <div className={classes.chartContainer}>
          <RequestsChart data={resultsPerEndpointPerTick} syncGroup={syncGroup} />
        </div>
      </Paper>
    </React.Fragment>
  )
}

function useResultsPerEndpointPerTickQuery(executionId, name) {
  const {
    data: { resultsPerEndpointPerTick } = {},
    loading,
    error,
  } = useSubscription(SUBSCRIBE_TO_EXECUTION_RESULTS_PER_ENDPOINT_PER_TICK, {
    variables: { executionId, name },
    fetchPolicy: 'cache-and-network',
  })

  const preparedData = useMemo(
    () =>
      (resultsPerEndpointPerTick || []).map(result => ({
        ...result,
        timestamp: +new Date(result.timestamp),
      })),
    [resultsPerEndpointPerTick]
  )

  return {
    resultsPerEndpointPerTick: preparedData,
    loading,
    error,
  }
}

export default ResultsPerEndpointPerTick
