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
import {
  SectionHeader,
  LoadingPlaceholder,
  ErrorPlaceholder,
  NoDataPlaceholder,
} from 'components'

import FailuresChart from './FailuresChart'
import { GET_ENDPOINT_FAILURES } from './graphql'
import { Chart } from 'config/constants'

function Failures({ classes, endpointId }) {
  const { endpointFailures, loading, error } = useEndpointFailures(endpointId)

  if (loading || error || endpointFailures.length === 0) {
    return (
      <Paper square className={classes.tile}>
        {loading ? (
          <LoadingPlaceholder title="Loading failures..." height={Chart.HEIGHT} />
        ) : error ? (
          <ErrorPlaceholder error={error} height={Chart.HEIGHT} />
        ) : (
          <NoDataPlaceholder title="No failures" height={Chart.HEIGHT} />
        )}
      </Paper>
    )
  }

  return (
    <Paper square className={classes.tile} data-testid="EndpointFailures">
      <SectionHeader title="Failures" size="small" />
      <div className={classes.tileContent}>
        <FailuresChart data={endpointFailures} />
      </div>
    </Paper>
  )
}

function useEndpointFailures(endpointId) {
  const {
    loading,
    error,
    data: { endpointFailures = [] } = {},
  } = useQuery(GET_ENDPOINT_FAILURES, {
    variables: { endpointId },
    fetchPolicy: 'cache-and-network',
  })

  return {
    loading,
    error,
    endpointFailures,
  }
}

export default Failures
