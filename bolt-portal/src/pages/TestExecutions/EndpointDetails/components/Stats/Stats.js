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
import { useQuery } from '@apollo/client'
import filesize from 'filesize'

import { Grid, Paper } from '@material-ui/core'
import {
  SectionHeader,
  LabeledValue,
  LoadingPlaceholder,
  ErrorPlaceholder,
} from 'components'

import { formatThousands } from 'utils/numbers'

import { GET_ENDPOINT_TOTALS } from './graphql'
import { Chart } from 'config/constants'

function Stats({ classes, endpointId }) {
  const { endpointTotals, loading, error } = useEndpointTotals(endpointId)

  if (loading || error || endpointTotals.length === 0) {
    return (
      <Paper square className={classes.tile}>
        {loading ? (
          <LoadingPlaceholder title="Loading stats..." height={Chart.HEIGHT} />
        ) : error ? (
          <ErrorPlaceholder error={error} height={Chart.HEIGHT} />
        ) : (
          <LoadingPlaceholder
            title="Waiting for endpoint stats..."
            height={Chart.HEIGHT}
          />
        )}
      </Paper>
    )
  }

  return (
    <React.Fragment>
      <Grid
        item
        xs={12}
        className={classes.verticalGridItem}
        data-testid="EndpointStats"
      >
        <Paper square className={classes.tile}>
          <SectionHeader title="Response Times" size="small" />
          <div className={classes.tileContent}>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <LabeledValue
                  label="Minimal"
                  value={`${formatThousands(endpointTotals.min_response_time)} ms`}
                />
              </Grid>
              <Grid item xs={4}>
                <LabeledValue
                  label="Average"
                  value={`${formatThousands(
                    endpointTotals.average_response_time
                  )} ms`}
                />
              </Grid>
              <Grid item xs={4}>
                <LabeledValue
                  label="Maximal"
                  value={`${formatThousands(endpointTotals.max_response_time)} ms`}
                />
              </Grid>
            </Grid>
          </div>
        </Paper>
      </Grid>
      <Grid item xs={12} className={classes.verticalGridItem}>
        <Paper square className={classes.tile}>
          <SectionHeader title="Response Size" size="small" />

          <div className={classes.tileContent}>
            <Grid container spacing={4}>
              <Grid item xs={4}>
                <LabeledValue
                  label="Minimal"
                  value={filesize(endpointTotals.min_content_size || 0, {
                    round: 0,
                  })}
                />
              </Grid>
              <Grid item xs={4}>
                <LabeledValue
                  label="Average"
                  value={filesize(endpointTotals.average_content_size || 0, {
                    round: 0,
                  })}
                />
              </Grid>
              <Grid item xs={4}>
                <LabeledValue
                  label="Maximal"
                  value={filesize(endpointTotals.max_content_size || 0, {
                    round: 0,
                  })}
                />
              </Grid>
            </Grid>
          </div>
        </Paper>
      </Grid>
    </React.Fragment>
  )
}

function useEndpointTotals(endpointId) {
  const {
    loading,
    error,
    data: { endpointTotals = [] } = {},
  } = useQuery(GET_ENDPOINT_TOTALS, {
    variables: { endpointId },
    fetchPolicy: 'cache-and-network',
  })

  return { loading, error, endpointTotals: endpointTotals[0] || {} }
}

export default Stats
