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

import { Paper } from '@material-ui/core'
import { SectionHeader, LoadingPlaceholder, ErrorPlaceholder } from 'components'

import TimeDistributionChart from './TimeDistributionChart'
import { GET_ENDPOINT_DISTRIBUTION } from './graphql'
import { Chart } from 'config/constants'

function TimeDistribution({ classes, endpointId }) {
  const { endpointDistribution, loading, error } =
    useEndpointDistributionQuery(endpointId)

  if (loading || error || !Object.keys(endpointDistribution).length) {
    return (
      <Paper square className={classes.tile}>
        {loading ? (
          <LoadingPlaceholder
            title="Loading time distribution..."
            height={Chart.HEIGHT}
          />
        ) : error ? (
          <ErrorPlaceholder error={error} height={Chart.HEIGHT} />
        ) : (
          <LoadingPlaceholder
            title="Waiting for endpoint results..."
            height={Chart.HEIGHT}
          />
        )}
      </Paper>
    )
  }

  return (
    <Paper square className={classes.tile} data-testid="EndpointTimeDistribution">
      <SectionHeader title="Time Distribution" size="small" />
      <div className={classes.tileContent}>
        <TimeDistributionChart data={endpointDistribution} />
      </div>
    </Paper>
  )
}

function useEndpointDistributionQuery(endpointId) {
  const { loading, error, data } = useQuery(GET_ENDPOINT_DISTRIBUTION, {
    variables: { endpointId },
    fetchPolicy: 'cache-and-network',
  })

  return {
    loading,
    error,
    endpointDistribution: data?.endpointDistribution?.[0] || {},
  }
}

export default TimeDistribution
