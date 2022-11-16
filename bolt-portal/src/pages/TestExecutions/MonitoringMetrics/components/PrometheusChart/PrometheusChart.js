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

import React, { useMemo } from 'react'
import { DefaultChart } from 'components'
import moment from 'moment'
import { Box } from '@material-ui/core'
import { NoDataPlaceholder } from 'components/index'

const PrometheusChart = ({ data }) => {
  const options = useMemo(() => {
    return {
      legend: {
        show: true,
        type: 'scroll',
        data:
          data &&
          data.length > 0 &&
          data[0].metric_value.map(
            value => value.metric.pod || value.metric.service
          ),
      },
      xAxis: {
        type: 'category',
        data: data ? data.map(d => moment(d.timestamp).format('HH:mm:ss')) : [],
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: value => value,
        },
      },
      series:
        data && data.length > 0
          ? data[0].metric_value.map((value, index) => ({
              name: value.metric.pod || value.metric.service,
              type: 'line',
              symbol: 'none',
              data:
                data && data.length > 0
                  ? data.map(value => {
                      const mv = value.metric_value[index]
                      if (mv) return mv['value'][1]
                    })
                  : [],
            }))
          : [],
    }
  }, [data])

  if (data.length === 0) {
    return (
      <Box p={3}>
        <NoDataPlaceholder />
      </Box>
    )
  }

  return <DefaultChart options={options} />
}

export default PrometheusChart
