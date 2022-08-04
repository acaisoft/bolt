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
import PropTypes from 'prop-types'
import moment from 'moment'

import { withStyles } from '@material-ui/core'

import { TooltipBuilder } from 'utils/echartUtils'
import { formatThousands } from 'utils/numbers'
import { DefaultChart } from 'components'

const formatTimestamp = timestamp => moment(timestamp).format('HH:mm:ss')

export function ResponseTimesChart({ responseData, theme, syncGroup }) {
  const { color } = theme.palette.chart

  const options = useMemo(() => {

    const minResponseTimeSeries = {
      name: 'Min Response Time',
      type: 'line',
      symbol: 'none',
      color : color.line.success,
      data: responseData.map(datum => datum.min_response_time),
    }

    const avgResponseTimeSeries = {
      name: 'Average Response Time',
      type: 'line',
      symbol: 'none',
      color : color.background,
      data: responseData.map(datum => datum.average_response_time),
    }

    const maxResponseTimeSeries = {
      name: 'Max Response Time',
      type: 'line',
      symbol: 'none',
      color: color.line.error,
      data: responseData.map(datum => datum.max_response_time),
    }

    // get all series to pass for building graph
    const seriesSchema = [minResponseTimeSeries, avgResponseTimeSeries, maxResponseTimeSeries]
    // get all unique series names for legend and tooltips
    const uniqueSeries = [...new Set(seriesSchema.map(d => d.name))]

    return {
      tooltip: {
        formatter: data => {
          let tooltipBuilder = new TooltipBuilder(data)
            .withDefaultHeader()
          for (let singularSeries of uniqueSeries){
            tooltipBuilder.withMillisecondsDataLine(singularSeries)
          }
          return tooltipBuilder.getHtml()
        },
      },
      legend: {
        show: true,
        data: uniqueSeries,
      },
      xAxis: {
        type: 'category',
        data: responseData.map(d => formatTimestamp(d.timestamp)),
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: value => value < 1000 ? formatThousands(value) + " ms" : value / 1000 + " s",
        },
      },
      series:
        seriesSchema
    }
  }, [responseData, color])
  return <DefaultChart options={options} syncGroup={syncGroup} />
}
ResponseTimesChart.propTypes = {
  responseData: PropTypes.array,
  execution: PropTypes.object,
  syncId: PropTypes.string,
  theme: PropTypes.object.isRequired,
}

export default withStyles({}, { withTheme: true })(ResponseTimesChart)
