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
import { DefaultChart } from 'components'
import { formatThousands } from "utils/numbers";

const formatTimestamp = timestamp => moment(timestamp).format('HH:mm:ss')

export function ResponseLengthChart({ responseData, theme, syncGroup }) {

  const options = useMemo(() => {
    return {
      tooltip: {
        formatter: data => {
          return new TooltipBuilder(data)
            .withDefaultHeader()
            .withBytesDataLine("Total Response Size")
            .getHtml()
        },
      },
      legend: {
        show: true,
        data: ["Total Response Size"]
      },
      xAxis: {
        type: 'category',
        data: responseData.map(d => formatTimestamp(d.timestamp)),
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: value => value < 1024 ? value + " B" :
            value < 1024 * 1024 ? Math.floor(value / 1024) + " kB":
              value < 1024 * 1024 * 1024 ? (value / (1024 * 1024)).toFixed(2) + " MB":
                formatThousands(Math.floor(value / 1024 * 1024)) + " MB"
        },
      },
      series: {
        name: 'Total Response Size',
        type: 'line',
        areaStyle: {},
        symbol: 'none',
        data: responseData.map(datum => datum.total_content_length),
      }
    }
  }, [responseData])
  return <DefaultChart options={options} syncGroup={syncGroup} />
}
ResponseLengthChart.propTypes = {
  responseData: PropTypes.array,
  execution: PropTypes.object,
  syncId: PropTypes.string,
  theme: PropTypes.object.isRequired,
}

export default withStyles({}, { withTheme: true })(ResponseLengthChart)
