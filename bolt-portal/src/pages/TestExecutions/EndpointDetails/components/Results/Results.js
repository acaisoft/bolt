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

import {connect as echartsConnect} from 'echarts'
import React, {useState, useMemo, useEffect} from 'react'
import {useQuery} from '@apollo/client'
import {Grid, Paper} from '@material-ui/core'
import {
  SectionHeader,
  LoadingPlaceholder,
  ErrorPlaceholder, ZoomButton,
} from 'components'
import {Chart} from 'config/constants'

import ResultsChart from './ResultsChart'
import ResponseTimesChart from "./ResponseTimesChart"
import ResponseLengthChart from "./ResponseLengthChart"
import {QUERY_EXECUTION_RESULTS_PER_ENDPOINT_PER_TICK} from './graphql'

function Results({
  classes,
  executionId,
  name,
  hideZoom = false,
  initZoomOut = false,
}) {
  const [isZoomed, setIsZoomed] = useState(initZoomOut)

  const {errorsPerTick, resultsPerTick, loading, error} = useResultsPerEndpointPerTickQuery(executionId, name)

  const syncGroup = 'chartsGroup'

  useEffect(() => {
    echartsConnect(syncGroup)
  }, [])

  if (loading || error || (errorsPerTick.length === 0 && resultsPerTick.length === 0)) {
    return (
      <Grid item xs={12}>
        <Paper square className={classes.tile}>
          {loading ? (
            <LoadingPlaceholder title="Loading data..." height={Chart.HEIGHT}/>
          ) : error ? (
            <ErrorPlaceholder error={error} height={Chart.HEIGHT}/>
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
            title="Requests distribution"
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
            <ResultsChart
              errorsData={errorsPerTick}
              totalsData={resultsPerTick}
              syncGroup={syncGroup}
              isZoomed={isZoomed}
            />
          </div>
        </Paper>
      </Grid>
      <Grid item xs={12} md={isZoomed ? 12 : 4}>
        <Paper square className={classes.tile}>
          <SectionHeader
            size="small"
            className={classes.tileTitle}
            title="Response Times"
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
            <ResponseTimesChart responseData={resultsPerTick} syncGroup={syncGroup}/>
          </div>
        </Paper>
      </Grid>
      <Grid item xs={12} md={isZoomed ? 12 : 4}>
        <Paper square className={classes.tile}>
          <SectionHeader
            size="small"
            className={classes.tileTitle}
            title="Total Response Length"
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
            <ResponseLengthChart responseData={resultsPerTick} syncGroup={syncGroup}/>
          </div>
        </Paper>
      </Grid>
    </React.Fragment>
  )
}

function useResultsPerEndpointPerTickQuery(executionId, name) {
  const {
    data: {errorsPerTick, resultsPerTick} = {},
    loading,
    error,
  } = useQuery(QUERY_EXECUTION_RESULTS_PER_ENDPOINT_PER_TICK, {
    variables: {executionId, name},
    fetchPolicy: 'cache-and-network',
  })

  const preparedErrorsData = useMemo(
    () =>
      (errorsPerTick || []).map(result => ({
        ...result,
        timestamp: +new Date(result.timestamp),
      })),
    [errorsPerTick]
  )

  const preparedResultsData = useMemo(
    () =>
      (resultsPerTick || []).map(result => ({
        ...result,
        timestamp: +new Date(result.timestamp),
      })),
    [resultsPerTick]
  )

  return {
    errorsPerTick: preparedErrorsData,
    resultsPerTick: preparedResultsData,
    loading,
    error,
  }
}

export default Results
