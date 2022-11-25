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

const PrometheusChart = ({ data, unit = '' }) => {
  const getPrometheusString = metric => {
    delete metric.__name__
    delete metric.endpoint
    return JSON.stringify(metric)
  }

  const options = useMemo(() => {
    return {
      legend: {
        show: true,
        type: 'scroll',
        orient: 'vertical',
        top: 200,
        left: 0,
        data:
          data &&
          data.length > 0 &&
          data[0].metric_value.map(
            value => value.metric.bolt_name || getPrometheusString(value.metric)
          ),
      },
      grid: {
        left: 5,
        top: 10,
        right: 30,
        bottom: 120,
      },
      xAxis: {
        type: 'category',
        data: data ? data.map(d => moment(d.timestamp).format('HH:mm:ss')) : [],
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: value => value + unit,
        },
      },
      series:
        data && data.length > 0
          ? data[0].metric_value.map((value, index) => ({
              name: value.metric.bolt_name || getPrometheusString(value.metric),
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

  if (
    data.length === 0 ||
    !data.map(metric => metric.metric_value).every(i => i.length > 0)
  ) {
    return (
      <Box p={3}>
        <NoDataPlaceholder />
      </Box>
    )
  }

  return <DefaultChart options={options} />
}

export default PrometheusChart
