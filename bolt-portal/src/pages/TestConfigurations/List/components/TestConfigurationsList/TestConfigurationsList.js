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
import PropTypes from 'prop-types'
import moment from 'moment'
import { useSubscription } from '@apollo/client'

import { IconButton, Box } from '@material-ui/core'
import { Add, History } from '@material-ui/icons'
import {
  Button,
  SectionHeader,
  DataTable,
  NoWrap,
  NoDataPlaceholder,
  LoadingPlaceholder,
  ErrorPlaceholder,
} from 'components'
import { Pagination } from 'containers'
import { useListFilters } from 'hooks'

import { formatPercent, formatThousands } from 'utils/numbers'

import { SuccessRatePieChart } from 'components'

import {
  SUBSCRIBE_TO_TEST_CONFIGURATION_LIST_ITEM,
  SUBSCRIBE_TO_TEST_CONFIGURATION_AGGREGATE_LIST_ITEM,
} from './graphql'
import useStyles from './TestConfigurationsList.styles'
import ConfigurationActionsMenu from './ConfigurationActionsMenu'

export function TestConfigurationsList({
  getTestConfigurationCreateUrl = () => {},
  getTestConfigurationDetailsUrl = () => {},
  getTestConfigurationEditUrl = () => {},
  onClone = () => {},
  onRun = () => {},
  projectId,
}) {
  const classes = useStyles()
  const { pagination, orderBy, setPagination } = useListFilters({
    pagination: { rowsPerPage: 10 },
    orderBy: [{ id: 'asc' }],
  })

  const {
    data: { configurations = [] } = {},
    loading: loadingConfigurations,
    error,
  } = useSubscription(SUBSCRIBE_TO_TEST_CONFIGURATION_LIST_ITEM, {
    variables: {
      projectId,
      limit: pagination.rowsPerPage,
      offset: pagination.offset,
      order_by: orderBy,
    },
    fetchPolicy: 'cache-and-network',
  })

  const {
    data: { configurationsAggregate } = {},
    loading: loadingConfigurationsAggregate,
  } = useSubscription(SUBSCRIBE_TO_TEST_CONFIGURATION_AGGREGATE_LIST_ITEM, {
    variables: {
      projectId,
    },
    fetchPolicy: 'cache-and-network',
  })

  const loading = loadingConfigurations || loadingConfigurationsAggregate

  if (loading || error || configurations.length === 0) {
    return (
      <Box p={3}>
        {loading ? (
          <LoadingPlaceholder title="Loading scenarios..." />
        ) : error ? (
          <ErrorPlaceholder error={error} />
        ) : (
          <NoDataPlaceholder
            title="No scenarios"
            description="Seems like you haven't created any scenarios in this project yet."
            buttonUrl={getTestConfigurationCreateUrl()}
            buttonLabel="Create a scenario"
          />
        )}
      </Box>
    )
  }

  const totalCount = configurationsAggregate
    ? configurationsAggregate.aggregate.count
    : 0

  return (
    <React.Fragment>
      <SectionHeader title="Scenarios" subtitle={`(${totalCount})`} marginBottom>
        {!loading && (
          <Pagination
            {...pagination}
            onChange={setPagination}
            totalCount={totalCount}
          />
        )}
        <Button
          icon={Add}
          variant="contained"
          color="secondary"
          href={getTestConfigurationCreateUrl()}
        >
          New
        </Button>
      </SectionHeader>
      <DataTable
        data={configurations}
        isLoading={loading}
        rowKey={configuration => configuration.id}
      >
        <DataTable.Column
          key="name"
          render={configuration => configuration.name}
          title="Name"
        />
        <DataTable.Column
          key="type"
          render={configuration => configuration.configuration_type.name}
          title="Type"
        />
        <DataTable.Column
          key="source"
          render={({ test_source }) =>
            test_source && test_source[test_source.source_type].name
          }
          title="Source"
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
                  <span>{moment(executions[0].start).format('YYYY-MM-DD')}</span>
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

            const totals = executions[0].execution_request_totals_aggregate.aggregate
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
          key="last_execution_response_time"
          render={({ executions }) => {
            if (executions.length === 0) {
              return null
            }

            const totals = executions[0].execution_request_totals_aggregate.aggregate
            return (
              <NoWrap>
                {formatThousands(totals.min.min_response_time)} /{' '}
                {formatThousands(totals.avg.average_response_time)} /{' '}
                {formatThousands(totals.max.max_response_time)}
              </NoWrap>
            )
          }}
          title={
            <NoWrap>
              Response Times [ms]
              <br />
              Min / Avg / Max
            </NoWrap>
          }
        />

        <DataTable.Column
          key="actions"
          render={configuration => {
            return (
              <div className={classes.actionsContainer}>
                <Button
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
    </React.Fragment>
  )
}

TestConfigurationsList.propTypes = {
  getTestConfigurationCreateUrl: PropTypes.func.isRequired,
  getTestConfigurationDetailsUrl: PropTypes.func.isRequired,
  projectId: PropTypes.string,
}

export default TestConfigurationsList
