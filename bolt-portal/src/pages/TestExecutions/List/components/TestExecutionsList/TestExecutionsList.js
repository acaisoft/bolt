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

import { DataTable, SectionHeader, NoWrap, Button } from 'components'
import { useListFilters } from 'hooks'

import { GET_TEST_EXECUTIONS } from './graphql'
import { Pagination } from 'containers'
import { formatThousands } from 'utils/numbers'

function TestExecutionsList({ projectId, getExecutionDetailsUrl }) {
  const { pagination, orderBy, setPagination } = useListFilters({
    pagination: { rowsPerPage: 10 },
    orderBy: [{ start: 'desc' }],
  })

  const { data: { executions = [], executionsAggregate } = {}, loading } = useQuery(
    GET_TEST_EXECUTIONS,
    {
      fetchPolicy: 'cache-and-network',
      variables: {
        projectId,
        limit: pagination.rowsPerPage,
        offset: pagination.offset,
        order_by: orderBy,
      },
    }
  )

  const totalCount =
    (executionsAggregate && executionsAggregate.aggregate.count) || 0

  return (
    <div>
      <SectionHeader title="Test Runs" subtitle={`(${totalCount})`} marginBottom>
        {!loading && (
          <Pagination
            {...pagination}
            onChange={setPagination}
            totalCount={totalCount}
          />
        )}
      </SectionHeader>

      <DataTable
        data={executions}
        isLoading={loading}
        rowKey={execution => execution.id}
      >
        <DataTable.Column
          key="runDate"
          render={execution => (
            <NoWrap>{moment(execution.start).format('YYYY-MM-DD HH:mm')}</NoWrap>
          )}
          title="Run Date"
        />
        {!projectId && (
          <DataTable.Column
            key="project"
            render={execution => execution.configuration.project.name}
            title="Project"
          />
        )}
        <DataTable.Column
          key="scenario"
          render={execution => execution.configuration.name}
          title="Scenario"
        />
        <DataTable.Column
          key="type"
          render={execution => execution.configuration.configuration_type.name}
          title="Type"
        />
        <DataTable.Column
          key="status"
          render={execution => execution.status}
          title="Status"
        />
        <DataTable.Column
          key="total"
          render={execution =>
            formatThousands(
              (execution.result_aggregate_aggregate.aggregate.sum.number_of_fails ||
                0) +
                (execution.result_aggregate_aggregate.aggregate.sum
                  .number_of_successes || 0)
            )
          }
          title="Total"
        />
        <DataTable.Column
          key="passed"
          render={execution =>
            formatThousands(
              execution.result_aggregate_aggregate.aggregate.sum
                .number_of_successes || 0
            )
          }
          title="Passed"
        />
        <DataTable.Column
          key="fails"
          render={execution =>
            formatThousands(
              execution.result_aggregate_aggregate.aggregate.sum.number_of_fails || 0
            )
          }
          title="Fails"
        />
        <DataTable.Column
          key="actions"
          render={execution => (
            <Button
              title="Show details"
              href={getExecutionDetailsUrl(execution)}
              variant="link"
            >
              Details
            </Button>
          )}
          title="Actions"
        />
      </DataTable>
    </div>
  )
}

export default TestExecutionsList
