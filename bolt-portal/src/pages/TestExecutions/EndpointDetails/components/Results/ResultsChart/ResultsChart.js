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

export function ResultsChart({ totalsData, errorsData, theme, syncGroup, isZoomed }) {
  const { color } = theme.palette.chart

  const options = useMemo(() => {

    const requestsSeries = {
      name: 'Requests',
      type: 'line',
      areaStyle: {},
      color: color.background,
      symbol: 'none',
      z: 0,
      data: totalsData.map(datum => datum.num_requests),
    }

    const successesSeries = {
      name: 'Successes',
      type: 'line',
      areaStyle: {},
      color : color.line.success,
      stack: 'requests',
      symbol: 'none',
      z: 1,
      data: totalsData.map(datum => datum.successes_per_tick),
    }

    const aggregatedErrorsSeries = {
      name: 'Errors (zoom in to expand)',
      type: 'line',
      areaStyle: {},
      color : color.line.error,
      stack: 'requests',
      symbol: 'none',
      z: 1,
      data: totalsData.map(datum => datum.num_failures),
    }

    // build series for all registered errors
    const timestamps = totalsData.map(d => d.timestamp)
    const uniqueErrorsSeries = [...new Set(errorsData.map(d => d.exception_data))]
    const errorsSeries = uniqueErrorsSeries.map((name) => {
        let filteredDatum = errorsData.filter(datum => datum.exception_data === name)
        // fill missing occurrence data with zeros for all timestamps
        let data = timestamps.map(date =>
            (filteredDatum.find(data => data.timestamp === date) ||
              {"number_of_occurrences": 0}).number_of_occurrences)
        return {
          name: name,
          type: 'line',
          areaStyle: {},
          stack: 'requests',
          symbol: 'none',
          z: 1,
          data: data
      }
    })

    // get all series to pass for building graph
    const zoomedInSchema = errorsSeries.concat([requestsSeries, successesSeries])
    const zoomedOutSchema = [aggregatedErrorsSeries, requestsSeries, successesSeries]
    // get all unique series names for legend and tooltips
    const zoomedInUniqueSeries = [...new Set(zoomedInSchema.map(d => d.name))]
    const zoomedOutUniqueSeries = [...new Set(zoomedOutSchema.map(d => d.name))]

    const zoomedInTooltip = {
      formatter: data => {
        let tooltipBuilder = new TooltipBuilder(data)
          .withDefaultHeader()
        for (let singularSeries of zoomedInUniqueSeries){
          tooltipBuilder.withNumericDataLine(singularSeries)
        }
        return tooltipBuilder.getHtml()
      }
    }
    const zoomedOutToolTip = {
      formatter: data => {
        let tooltipBuilder = new TooltipBuilder(data)
          .withDefaultHeader()
        for (let singularSeries of zoomedOutUniqueSeries){
          tooltipBuilder.withNumericDataLine(singularSeries)
        }
        return tooltipBuilder.getHtml()
      }
    }
    return {
      tooltip: isZoomed ? zoomedInTooltip : zoomedOutToolTip,
      legend: {
        show: true,
        data: isZoomed ? zoomedInUniqueSeries : zoomedOutUniqueSeries,
      },
      color: color.errors,
      xAxis: {
        type: 'category',
        data: totalsData.map(d => formatTimestamp(d.timestamp)),
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: value => formatThousands(value),
        },
      },
      series:
        isZoomed ? zoomedInSchema : zoomedOutSchema,
    }
  }, [totalsData, errorsData, isZoomed, color])
  return <DefaultChart options={options} syncGroup={syncGroup} />
}
ResultsChart.propTypes = {
  totalsData: PropTypes.array,
  errorsData: PropTypes.array,
  execution: PropTypes.object,
  syncId: PropTypes.string,
  theme: PropTypes.object.isRequired,
}

export default withStyles({}, { withTheme: true })(ResultsChart)
