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
import { ExpandablePanel } from 'components'
import { useParams } from 'react-router-dom'
import { Button } from 'components'
import routes from 'config/routes'
import {
  SectionHeader,
  LoadingPlaceholder,
  ErrorPlaceholder,
  NoDataPlaceholder,
} from 'components/index'
import { getUrl } from 'utils/router'
import { Paper, Box } from '@material-ui/core'
import { useSubscription } from '@apollo/client'
import PrometheusChart from './components/PrometheusChart/PrometheusChart'
import { SUBSCRIBE_TO_EXECUTION_METRICS } from './graphql'
import useStyles from './MonitoringMetrics.styles'

const MonitoringMetrics = () => {
  const classes = useStyles()
  const params = useParams()
  const { executionId } = params

  const {
    data: { configuration_monitoring } = {},
    loading,
    error,
  } = useSubscription(SUBSCRIBE_TO_EXECUTION_METRICS, {
    variables: {
      executionId,
    },
    fetchPolicy: 'cache-and-network',
  })

  const getTestDetailsUrl = useCallback(
    executionId => {
      return getUrl(routes.projects.configurations.executions.details, {
        ...params,
        executionId: executionId,
      })
    },
    [params]
  )

  const formatTitle = title => title.replace(/_/g, ' ')
  if (configuration_monitoring?.length === 0) {
    return (
      <Box p={3}>
        <NoDataPlaceholder title="No metrics have been gathered..." />
      </Box>
    )
  }
  if (loading || error) {
    return (
      <Box p={3}>
        {loading ? (
          <LoadingPlaceholder title="Loading metrics..." />
        ) : (
          <ErrorPlaceholder error={error} />
        )}
      </Box>
    )
  }

  return (
    <>
      <SectionHeader className={classes.tileTitle} title="Prometheus Metrics">
        <Button
          color="primary"
          variant="contained"
          data-testid="monitoring-details-button"
          href={getTestDetailsUrl(executionId)}
        >
          Show test results
        </Button>
      </SectionHeader>
      {configuration_monitoring &&
        configuration_monitoring.map((query, index) => (
          <ExpandablePanel
            defaultExpanded={true}
            key={`${index}-expand-chart`}
            style={{ textTransform: 'capitalize' }}
            title={formatTitle(query.query)}
          >
            <Paper className={classes.paper}>
              <PrometheusChart
                executionId={executionId}
                monitoringId={query.id}
                data={query.monitoring_metrics}
                unit={query.unit}
              />
            </Paper>
          </ExpandablePanel>
        ))}
    </>
  )
}

export default MonitoringMetrics
