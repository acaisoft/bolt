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

import React, { useMemo, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useSubscription } from '@apollo/client'
import moment from 'moment'
import { Grid, Paper } from '@material-ui/core'
import {
  SectionHeader,
  Button,
  LoadingPlaceholder,
  ErrorPlaceholder,
  NotFoundPlaceholder,
  ExpandablePanel,
  TestConfigurationDetails,
} from 'components'
import { TestRunStatus as Status } from 'config/constants'
import { getUrl } from 'utils/router'
import routes from 'config/routes'
import { ExecutionActionsMenu } from '../components'
import { MonitoringLineChart, MonitoringHeatmapChart } from './components'
import { StatusGraph } from '../Details/components'
import { getDataForChart } from './module.js'
import {
  SUBSCRIBE_TO_EXECUTION_WITH_MONITORING_DATA,
  GET_METRICS_DATA,
} from './graphql'
import useStyles from './Monitoring.styles'

function Monitoring() {
  const params = useParams()
  const { executionId, configurationId } = params

  const classes = useStyles()

  const {
    data: { execution } = {},
    loading,
    error,
  } = useSubscription(SUBSCRIBE_TO_EXECUTION_WITH_MONITORING_DATA, {
    variables: { executionId },
  })

  const pollInterval = [Status.RUNNING, Status.PENDING, Status.MONITORING].includes(
    execution && execution.status
  )
    ? 5000
    : null

  const { data: { monitoring = {} } = {} } = useQuery(GET_METRICS_DATA, {
    fetchPolicy: 'cache-and-network',
    variables: { executionId },
    pollInterval,
  })

  const chartsWithData = useMemo(() => {
    if (
      !execution ||
      !execution.execution_metrics_metadata ||
      !monitoring ||
      !monitoring.metrics_data ||
      monitoring.metrics_data.length === 0
    ) {
      return []
    }

    const charts = execution.execution_metrics_metadata[0].chart_configuration.charts
    const monitoringData = monitoring.metrics_data

    return charts.map(chartConfig => ({
      chartConfig,
      ...getDataForChart(chartConfig, monitoringData),
    }))
  }, [execution, monitoring])

  const getTestDetailsUrl = useCallback(() => {
    return getUrl(routes.projects.configurations.executions.details, { ...params })
  }, [params])

  return (
    <div>
      <SectionHeader
        title={`Monitoring for Test Run ${
          execution
            ? moment(execution.start || execution.start_locust).format(
                'YYYY-MM-DD HH:mm:ss'
              )
            : ''
        }`}
        marginBottom
      >
        {execution && execution.configuration.has_load_tests && (
          <Button href={getTestDetailsUrl()}>Test details</Button>
        )}
        {execution && <ExecutionActionsMenu execution={execution} />}
      </SectionHeader>

      <div className={classes.configDetails}>
        <ExpandablePanel defaultExpanded={false} title="Scenario Details">
          <TestConfigurationDetails
            configuration={execution ? execution.configuration_snapshot : null}
          />
        </ExpandablePanel>
      </div>

      {loading || error || !execution ? (
        <div>
          {loading ? (
            <LoadingPlaceholder title="Loading monitoring results..." />
          ) : error ? (
            <ErrorPlaceholder error={error} />
          ) : !execution ? (
            <NotFoundPlaceholder title="Test run not found" />
          ) : (
            <LoadingPlaceholder title="Waiting for results..." />
          )}
        </div>
      ) : (
        <Grid container spacing={2}>
          <StatusGraph
            executionStatus={execution.status}
            executionId={executionId}
            configurationId={configurationId}
          />

          {chartsWithData.length === 0 ? (
            <Grid item xs={12}>
              <Paper>
                <LoadingPlaceholder title="Waiting for results..." />
              </Paper>
            </Grid>
          ) : (
            chartsWithData.map(({ groupNames, chartConfig, data }, index) => {
              return (
                <Grid
                  item
                  xs={12}
                  md={6}
                  key={`chart-${index}`}
                  data-testid={`monitoring-chart-${index}`}
                >
                  <Paper square className={classes.tile}>
                    {chartConfig.type === 'heatmap' ? (
                      <MonitoringHeatmapChart
                        data={data}
                        config={chartConfig}
                        groupNames={groupNames}
                      />
                    ) : (
                      <MonitoringLineChart
                        data={data}
                        config={chartConfig}
                        groupNames={groupNames}
                      />
                    )}
                  </Paper>
                </Grid>
              )
            })
          )}
        </Grid>
      )}
    </div>
  )
}

export default Monitoring
