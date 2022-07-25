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
import { DefaultChart } from 'components/index'

const formatTimestamp = timestamp => moment(timestamp).format('HH:mm:ss')

export function RequestsChart({ data, theme, syncGroup }) {
  const { color } = theme.palette.chart

  const hasFailures = data.some(item => item.number_of_fails > 0)
  const hasSuccesses = data.some(item => item.requests_per_second > 0)

  const areaColors = useMemo(() => {
    let colorsArray = []

    if (hasFailures) {
      colorsArray.push(color.area.error)
    }
    if (hasSuccesses) {
      colorsArray.push(color.area.success)
    }

    return colorsArray
  }, [color, hasFailures, hasSuccesses])

  const options = useMemo(() => {
    return {
      tooltip: {
        formatter: data => {
          return new TooltipBuilder(data)
            .withDefaultHeader()
            .withNumericDataLine('Fail')
            .withNumericDataLine('Success')
            .getHtml()
        },
      },
      legend: {
        show: true,
        data: [hasFailures && 'Fail', hasSuccesses && 'Success'],
      },
      color: areaColors,
      xAxis: {
        type: 'category',
        data: data.map(d => formatTimestamp(d.timestamp)),
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: value => formatThousands(value),
        },
      },
      series: [
        hasFailures
          ? {
              name: 'Fail',
              type: 'line',
              areaStyle: {},
              stack: 'requests',
              symbol: 'none',
              data: data.map(datum => Math.round(datum.number_of_fails)),
            }
          : null,
        hasSuccesses
          ? {
              name: 'Success',
              type: 'line',
              areaStyle: {},
              stack: 'requests',
              symbol: 'none',
              data: data.map(datum => Math.round(datum.requests_per_second)),
            }
          : null,
      ],
    }
  }, [data, areaColors, hasFailures, hasSuccesses])

  return <DefaultChart options={options} syncGroup={syncGroup} />
}
RequestsChart.propTypes = {
  data: PropTypes.array,
  execution: PropTypes.object,
  syncId: PropTypes.string,
  theme: PropTypes.object.isRequired,
}

export default withStyles({}, { withTheme: true })(RequestsChart)
