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
import { DataTable, SectionHeader, Button, NoWrap } from 'components'
import { formatThousands, formatPercent } from 'utils/numbers'
import { useEndpointSummary } from 'hooks'
import useStyles from './ResponsesTable.styles'

export function ResponsesTable({
  classes: parentClasses,
  data,
  getEndpointDetailsUrl,
}) {
  const ownClasses = useStyles()
  const classes = { ...parentClasses, ownClasses }
  const summary = useEndpointSummary(data)

  return (
    <React.Fragment>
      <SectionHeader
        title="Responses"
        size="small"
        className={classes.header}
        marginBottom
      />

      <div className={classes.tableContainer}>
        <DataTable
          data={data}
          isLoading={false}
          rowKey={response => response.identifier}
          hasFooter
        >
          <DataTable.Column
            key="type"
            render={response => response.method}
            title="Type"
          />
          <DataTable.Column
            key="name"
            render={response => response.name}
            title="Name"
          />
          <DataTable.Column
            key="total"
            render={response => formatThousands(response.num_requests || 0)}
            renderFooter={() => formatThousands(summary.requests)}
            title="Total"
          />
          <DataTable.Column
            key="success"
            render={({ num_requests = 0, num_successes = 0 }) => (
              <NoWrap className={classes.success}>
                <span>{formatPercent(num_successes / num_requests)}</span>{' '}
                <span>({formatThousands(num_successes)})</span>
              </NoWrap>
            )}
            renderFooter={() => (
              <NoWrap className={classes.success}>
                {formatPercent(summary.successes / summary.requests)} (
                {formatThousands(summary.successes)})
              </NoWrap>
            )}
            title="Success"
          />
          <DataTable.Column
            key="fail"
            render={({ num_failures, num_requests }) => (
              <NoWrap className={classes.failure}>
                <span>{formatPercent(num_failures / num_requests)}</span>{' '}
                <span>({formatThousands(num_failures)})</span>
              </NoWrap>
            )}
            renderFooter={() => (
              <NoWrap className={classes.failure}>
                {formatPercent(summary.failures / summary.requests)} (
                {formatThousands(summary.failures)})
              </NoWrap>
            )}
            title="Fail"
          />
          <DataTable.Column
            key="response_time"
            render={response => (
              <NoWrap>
                {formatThousands(response.min_response_time)} /{' '}
                {formatThousands(response.average_response_time)} /{' '}
                {formatThousands(response.max_response_time)}
              </NoWrap>
            )}
            renderFooter={() => (
              <NoWrap>
                {formatThousands(summary.minResponseTime)} /{' '}
                {formatThousands(summary.averageResponseTime)} /{' '}
                {formatThousands(summary.maxResponseTime)}
              </NoWrap>
            )}
            title={
              <div>
                Response Time [ms]
                <br />
                <NoWrap>Min. / Avg. / Max.</NoWrap>
              </div>
            }
          />
          <DataTable.Column
            key="requests_per_second"
            render={response =>
              formatThousands(
                response.requests_per_second < 1 && response.requests_per_second > 0
                  ? 1
                  : response.requests_per_second
              )
            }
            renderFooter={() => formatThousands(summary.requestsPerSecond)}
            title="Req/s"
          />
          <DataTable.Column
            key="actions"
            render={response => (
              <Button
                title="Show fails"
                href={getEndpointDetailsUrl(response)}
                variant="link"
              >
                Details
              </Button>
            )}
          />
        </DataTable>
      </div>
    </React.Fragment>
  )
}

ResponsesTable.propTypes = {
  data: PropTypes.array.isRequired,
  getEndpointDetailsUrl: PropTypes.func.isRequired,
}

export default ResponsesTable
