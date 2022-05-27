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

import React, { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import { useSubscription } from '@apollo/client'
import { Grid, Box, Paper } from '@material-ui/core'
import {
  SectionHeader,
  Button,
  LoadingPlaceholder,
  ErrorPlaceholder,
  NotFoundPlaceholder,
  ExpandablePanel,
  TestConfigurationDetails,
  ResultsPerTick,
} from 'components'
import { getUrl } from 'utils/router'
import routes from 'config/routes'
import { ExecutionActionsMenu } from '../components'
import { CompareResults, StatusGraph, ResultsPerEndpoint } from './components'
import { SUBSCRIBE_TO_EXECUTION } from './graphql'
import useStyles from './Details.styles'

export function Details() {
  const params = useParams()
  const { executionId, configurationId } = params

  const classes = useStyles()

  const {
    data: { execution } = {},
    loading,
    error,
  } = useSubscription(SUBSCRIBE_TO_EXECUTION, {
    variables: { executionId },
    fetchPolicy: 'cache-and-network',
  })

  const { getEndpointDetailsUrl, getMonitoringUrl } = useUrlGetters(params)

  if (loading || error || !execution) {
    return (
      <Box p={3}>
        {loading ? (
          <LoadingPlaceholder title="Loading test run results..." />
        ) : error ? (
          <ErrorPlaceholder error={error} />
        ) : (
          <NotFoundPlaceholder title="Test run not found" />
        )}
      </Box>
    )
  }

  return (
    <div className={classes.root}>
      <SectionHeader
        title={moment(execution.start || execution.start_locust).format(
          'YYYY-MM-DD HH:mm:ss'
        )}
      >
        {execution.configuration.has_monitoring && (
          <Button href={getMonitoringUrl()}>Monitoring</Button>
        )}
        <ExecutionActionsMenu execution={execution} />
      </SectionHeader>
      <div className={classes.configDetails}>
        <ExpandablePanel defaultExpanded={false} title="Scenario Details">
          <TestConfigurationDetails
            configuration={execution.configuration_snapshot}
          />
        </ExpandablePanel>

        <ExpandablePanel defaultExpanded={false} title="Compare results">
          <Paper className={classes.paper}>
            <CompareResults status={execution.status} />
          </Paper>
        </ExpandablePanel>
      </div>
      <Grid container spacing={2}>
        <StatusGraph
          executionStatus={execution.status}
          executionId={executionId}
          configurationId={configurationId}
        />
        <ResultsPerTick classes={classes} execution={execution} />
        <ResultsPerEndpoint
          classes={classes}
          getEndpointDetailsUrl={getEndpointDetailsUrl}
          execution={execution}
        />
      </Grid>
    </div>
  )
}

function useUrlGetters(matchParams) {
  const getEndpointDetailsUrl = useCallback(
    endpoint => {
      return getUrl(routes.projects.configurations.executions.endpoints.details, {
        ...matchParams,
        endpointId: endpoint.identifier,
      })
    },
    [matchParams]
  )

  const getMonitoringUrl = useCallback(() => {
    return getUrl(routes.projects.configurations.executions.monitoring, {
      ...matchParams,
    })
  }, [matchParams])

  return {
    getEndpointDetailsUrl,
    getMonitoringUrl,
  }
}

export default Details
