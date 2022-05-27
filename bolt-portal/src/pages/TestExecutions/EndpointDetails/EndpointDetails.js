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
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'

import { Grid, Box } from '@material-ui/core'
import {
  SectionHeader,
  LoadingPlaceholder,
  ErrorPlaceholder,
  NotFoundPlaceholder,
} from 'components'

import { Failures, TimeDistribution, Stats } from './components'
import { GET_ENDPOINT } from './graphql'
import useStyles from './EndpointDetails.styles'

function EndpointDetails() {
  const { endpointId } = useParams()
  const classes = useStyles()
  const { endpoint, loading, error } = useEndpointQuery(endpointId)

  if (loading || error || !endpoint) {
    return (
      <Box p={3}>
        {loading ? (
          <LoadingPlaceholder title="Loading endpoint results..." />
        ) : error ? (
          <ErrorPlaceholder error={error} />
        ) : (
          <NotFoundPlaceholder title="Endpoint not found" />
        )}
      </Box>
    )
  }

  return (
    <div>
      <SectionHeader title={`${endpoint.method} ${endpoint.name}`} marginBottom />

      <Grid container spacing={2} alignItems="stretch">
        <Grid item xs={12} md={3} className={classes.verticalGrid}>
          <Stats classes={classes} endpointId={endpointId} />
        </Grid>

        <Grid item xs={12} md={4}>
          <Failures classes={classes} endpointId={endpointId} />
        </Grid>

        <Grid item xs={12} md={5}>
          <TimeDistribution classes={classes} endpointId={endpointId} />
        </Grid>
      </Grid>
    </div>
  )
}

function useEndpointQuery(endpointId) {
  const {
    loading,
    error,
    data: { endpoint = [] } = {},
  } = useQuery(GET_ENDPOINT, {
    variables: { endpointId },
    fetchPolicy: 'cache-and-network',
  })

  return { loading, error, endpoint: endpoint[0] || {} }
}

export default EndpointDetails
