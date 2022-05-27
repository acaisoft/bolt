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
import { Grid, Paper } from '@material-ui/core'
import { useResultsPerEndpointQuery } from 'hooks'
import {
  SectionHeader,
  LoadingPlaceholder,
  ErrorPlaceholder,
  ResultsPerEndpointChart,
  RequestsPerSecondChart,
} from 'components'
import { Chart } from 'config/constants'
import CompareResponsesTable from './CompareResponsesTable'
import CompareResponsesSummary from './CompareResponsesSummary'

function CompareEndpointResults({ classes, execution, getEndpointDetailsUrl }) {
  const { resultsPerEndpoint, loading, error } = useResultsPerEndpointQuery(
    execution.id
  )

  if (loading || error || resultsPerEndpoint.length === 0) {
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
      <Grid item xs={12} xl={6}>
        <Paper square className={classes.tile}>
          <SectionHeader
            size="small"
            className={classes.tileTitle}
            title="Request Results"
          />
          <ResultsPerEndpointChart data={resultsPerEndpoint} />
        </Paper>
      </Grid>
      <Grid item xs={12} xl={6}>
        <Paper square className={classes.tile}>
          <SectionHeader
            size="small"
            className={classes.tileTitle}
            title="Requests/Second by request"
          />
          <RequestsPerSecondChart data={resultsPerEndpoint} />
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper square className={classes.tile}>
          <CompareResponsesTable
            data={resultsPerEndpoint}
            getEndpointDetailsUrl={getEndpointDetailsUrl}
          />
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper square className={classes.tile}>
          <CompareResponsesSummary data={resultsPerEndpoint} />
        </Paper>
      </Grid>
    </React.Fragment>
  )
}

export default CompareEndpointResults
