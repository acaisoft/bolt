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
import React, { useState, useMemo, useEffect } from 'react'
import { useSubscription } from '@apollo/client'
import { Grid, Paper } from '@material-ui/core'
import {
  SectionHeader,
  ZoomButton,
  LoadingPlaceholder,
  ErrorPlaceholder,
} from 'components/index'
import { Chart } from 'config/constants'

import RequestsChart from './RequestsChart'
import ResponseTimeChart from './ResponseTimeChart'
import UsersSpawnChart from './UsersSpawnChart'
import { SUBSCRIBE_TO_EXECUTION_RESULTS_PER_TICK } from './graphql'

function ResultsPerTick({
  classes,
  execution,
  hideZoom = false,
  initZoomOut = false,
}) {
  const [isZoomed, setIsZoomed] = useState(initZoomOut)

  const { resultsPerTick, loading, error } = useResultsPerTickQuery(execution.id)

  const syncGroup = 'chartsGroup'

  useEffect(() => {
    echartsConnect(syncGroup)
  }, [])

  if (loading || error || resultsPerTick.length === 0) {
    return (
      <Grid item xs={12}>
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
      </Grid>
    )
  }

  return (
    <React.Fragment>
      <Grid item xs={12} md={isZoomed ? 12 : 4}>
        <Paper square className={classes.tile}>
          <SectionHeader
            size="small"
            className={classes.tileTitle}
            title="Requests/s"
          >
            {!hideZoom && (
              <ZoomButton
                isZoomed={isZoomed}
                onZoomIn={() => setIsZoomed(true)}
                onZoomOut={() => setIsZoomed(false)}
              />
            )}
          </SectionHeader>
          <div className={classes.chartContainer}>
            <RequestsChart data={resultsPerTick} syncGroup={syncGroup} />
          </div>
        </Paper>
      </Grid>
      <Grid item xs={12} md={isZoomed ? 12 : 4}>
        <Paper square className={classes.tile}>
          <SectionHeader
            size="small"
            className={classes.tileTitle}
            title="Requests Response Time"
          >
            {!hideZoom && (
              <ZoomButton
                isZoomed={isZoomed}
                onZoomIn={() => setIsZoomed(true)}
                onZoomOut={() => setIsZoomed(false)}
              />
            )}
          </SectionHeader>
          <div className={classes.chartContainer}>
            <ResponseTimeChart data={resultsPerTick} syncGroup={syncGroup} />
          </div>
        </Paper>
      </Grid>
      <Grid item xs={12} md={isZoomed ? 12 : 4}>
        <Paper square className={classes.tile}>
          <SectionHeader
            size="small"
            className={classes.tileTitle}
            title="Users Spawn"
          >
            {!hideZoom && (
              <ZoomButton
                isZoomed={isZoomed}
                onZoomIn={() => setIsZoomed(true)}
                onZoomOut={() => setIsZoomed(false)}
              />
            )}
          </SectionHeader>
          <div className={classes.chartContainer}>
            <UsersSpawnChart data={resultsPerTick} syncGroup={syncGroup} />
          </div>
        </Paper>
      </Grid>
    </React.Fragment>
  )
}

function useResultsPerTickQuery(executionId) {
  const {
    data: { resultsPerTick } = {},
    loading,
    error,
  } = useSubscription(SUBSCRIBE_TO_EXECUTION_RESULTS_PER_TICK, {
    variables: { executionId },
    fetchPolicy: 'cache-and-network',
  })

  const preparedData = useMemo(
    () =>
      (resultsPerTick || []).map(result => ({
        ...result,
        timestamp: +new Date(result.timestamp),
      })),
    [resultsPerTick]
  )

  return {
    resultsPerTick: preparedData,
    loading,
    error,
  }
}

export default ResultsPerTick
