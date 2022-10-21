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
import moment from 'moment'
import { useQuery } from '@apollo/client'

import { IconButton, Tooltip } from '@material-ui/core'
import { History } from '@material-ui/icons'
import { Button, SectionHeader, DataTable, NoWrap } from 'components'
import { Pagination } from 'containers'
import { useListFilters } from 'hooks'

import { formatPercent } from 'utils/numbers'

import { SuccessRatePieChart } from 'components'

import useStyles from './TestConfigurationsList.styles'
import ConfigurationActionsMenu from '../ConfigurationActionsMenu'

import { SUBSCRIBE_CONFIGURATION_LIST_ITEM } from '../graphql'

export function TestConfigurationsTable({
  getTestConfigurationCreateUrl = () => {},
  getTestConfigurationDetailsUrl = () => {},
  getTestConfigurationEditUrl = () => {},
  getE2ETestRunsListUrl = () => {},
  onClone = () => {},
  onRun = () => {},
  type,
  projectId,
}) {
  const classes = useStyles()

  const slugName = type['slug_name']

  const { pagination, orderBy, setPagination } = useListFilters({
    pagination: { rowsPerPage: 10 },
    orderBy: [{ id: 'asc' }],
  })

  const {
    data: { configuration = [] } = {},
    data: { configurationsTotal } = {},
    loading,
    error,
  } = useQuery(SUBSCRIBE_CONFIGURATION_LIST_ITEM, {
    variables: {
      projectId,
      type: slugName,
      limit: pagination.rowsPerPage,
      offset: pagination.offset,
      order_by: orderBy,
    },
    fetchPolicy: 'cache-and-network',
  })

  const totalCount = configurationsTotal ? configurationsTotal.aggregate['count'] : 0

  const getValueFromSlug = (parameters, slug) => {
    let filtered = parameters.filter(e => e.parameter_slug === slug)
    let result =
      filtered.length > 0 && filtered[0].hasOwnProperty('value')
        ? filtered[0].value
        : 'Unknown'
    return result.length > 30 ? (
      <Tooltip title={result} placement="top" arrow>
        <div>
          {result.substring(0, 20) +
            '…' +
            result.substring(result.length - 5, result.length)}
        </div>
      </Tooltip>
    ) : (
      result
    )
  }

  return (
    <React.Fragment>
      {configuration.length > 0 &&
        (slugName === 'load_tests' ? (
          <div>
            {}
            <SectionHeader
              title="Performance Scenarios"
              subtitle={`(${configuration.length})`}
              marginBottom
            >
              {!loading && (
                <Pagination
                  {...pagination}
                  onChange={setPagination}
                  totalCount={totalCount}
                />
              )}
            </SectionHeader>
            <DataTable
              data={configuration}
              isLoading={loading}
              rowKey={configuration => configuration.id}
            >
              <DataTable.Column
                key="name"
                render={configuration => configuration.name}
                title="Name"
              />
              <DataTable.Column
                key="host"
                render={configuration =>
                  getValueFromSlug(
                    configuration.configuration_parameters,
                    'load_tests_host'
                  )
                }
                title="Host"
              />
              <DataTable.Column
                key="users"
                render={configuration =>
                  getValueFromSlug(
                    configuration.configuration_parameters,
                    'load_tests_users'
                  )
                }
                title="Users"
              />
              <DataTable.Column
                key="duration"
                render={configuration =>
                  getValueFromSlug(
                    configuration.configuration_parameters,
                    'load_tests_duration'
                  ) + 's'
                }
                title="Duration"
              />
              <DataTable.Column
                key="lastRun"
                render={({ executions }) => (
                  <NoWrap className={classes.dateContainer}>
                    {(executions[0] || {}).start && (
                      <React.Fragment>
                        <IconButton className={classes.icon} disabled>
                          <History />
                        </IconButton>
                        <span>
                          {moment(executions[0].start).format('YYYY-MM-DD HH:mm:ss')}
                        </span>
                      </React.Fragment>
                    )}
                  </NoWrap>
                )}
                title="Last Run"
              />
              <DataTable.Column
                key="success_rate"
                render={({ executions }) => {
                  if (executions.length === 0) {
                    return null
                  }

                  const totals =
                    executions[0].execution_request_totals_aggregate.aggregate
                  const successRate =
                    totals.sum.num_requests === 0
                      ? 0
                      : (totals.sum.num_requests - totals.sum.num_failures) /
                        totals.sum.num_requests

                  return (
                    <div className={classes.rateContainer}>
                      <SuccessRatePieChart
                        value={successRate * 100}
                        size={20}
                        variant="multicolor"
                      />

                      <span className={classes.rateMeter}>
                        {formatPercent(successRate)}
                      </span>
                    </div>
                  )
                }}
                title="Success Rate"
              />

              <DataTable.Column
                key="actions"
                render={configuration => {
                  return (
                    <div className={classes.actionsContainer}>
                      <Button
                        data-testid={`scenario-${configuration.id}-details`}
                        href={getTestConfigurationDetailsUrl(configuration)}
                        title="Show scenario details"
                        variant="link"
                      >
                        Details
                      </Button>
                    </div>
                  )
                }}
                title="Actions"
              />
              <DataTable.Column
                key="actionsMenu"
                render={configuration => {
                  return (
                    <ConfigurationActionsMenu
                      configuration={configuration}
                      editUrl={getTestConfigurationEditUrl(configuration)}
                      onClone={onClone}
                    />
                  )
                }}
              />
            </DataTable>
          </div>
        ) : (
          <div>
            <SectionHeader
              title={`${type['name']} Scenarios`}
              subtitle={`(${configuration.length})`}
              marginTop
            >
              {!loading && (
                <Pagination
                  {...pagination}
                  onChange={setPagination}
                  totalCount={totalCount}
                />
              )}
            </SectionHeader>
            <DataTable
              data={configuration}
              isLoading={loading}
              rowKey={configuration => configuration.id}
            >
              <DataTable.Column
                key="name"
                render={scenario => scenario.name}
                title="Name"
              />

              <DataTable.Column
                key="lastRun"
                render={({ test_runs }) => (
                  <NoWrap className={classes.dateContainer}>
                    {(test_runs[0] || {}).timestamp && (
                      <React.Fragment>
                        <IconButton className={classes.icon} disabled>
                          <History />
                        </IconButton>
                        <span>
                          {moment(test_runs[0].timestamp).format(
                            'YYYY-MM-DD HH:mm:ss'
                          )}
                        </span>
                      </React.Fragment>
                    )}
                  </NoWrap>
                )}
                title="Last Run"
              />
              <DataTable.Column
                key="success_rate"
                render={({ test_runs }) => {
                  if (test_runs.length === 0) {
                    return null
                  }
                  const lastRun = test_runs[0]
                  const totals = lastRun.total
                  const successRate =
                    totals === 0
                      ? 0
                      : (totals - (lastRun.failures + lastRun.errors)) / totals

                  return (
                    <div className={classes.rateContainer}>
                      <SuccessRatePieChart
                        value={successRate * 100}
                        size={20}
                        variant="multicolor"
                      />

                      <span className={classes.rateMeter}>
                        {formatPercent(successRate)}
                      </span>
                    </div>
                  )
                }}
                title="Success Rate"
              />
              <DataTable.Column
                key="actions"
                render={scenario => {
                  return (
                    <div className={classes.actionsContainer}>
                      <Button
                        data-testid={`scenario-${scenario.id}-details`}
                        href={getE2ETestRunsListUrl({
                          id: scenario.id,
                        })}
                        title="Show scenario details"
                        variant="link"
                      >
                        Details
                      </Button>
                    </div>
                  )
                }}
                title="Actions"
              />
            </DataTable>
          </div>
        ))}
    </React.Fragment>
  )
}

export default TestConfigurationsTable
