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

import React, { useRef, useEffect } from 'react'
import ReactEcharts from 'echarts-for-react'
import { useTheme } from '@material-ui/styles'
import _ from 'lodash'

function DefaultChart({ options: overridingOptions, syncGroup }) {
  const chartRef = useRef()
  useEffect(() => {
    if (syncGroup) {
      chartRef.current.getEchartsInstance().group = syncGroup
    }
  }, [syncGroup])

  const theme = useTheme()
  const { color, gridLine, font, tooltip } = theme.palette.chart

  const lineColors = [
    color.line.primary,
    color.line.success,
    color.line.error,
    'green',
    'red',
    'blue',
    'violet',
    'orange',
    'pink',
  ]

  const options = React.useMemo(() => {
    const defaultOptions = {
      legend: {
        show: false,
        x: 'center',
        y: 'bottom',
        textStyle: {
          color: font.color,
          fontFamily: font.fontFamily,
        },
      },
      color: lineColors,
      grid: {
        left: '3%',
        right: '4%',
        bottom:
          overridingOptions.legend && overridingOptions.legend.show ? 60 : '3%',
        top: '3%',
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: tooltip.fill,
        textStyle: {
          color: font.color,
          fontFamily: font.fontFamily,
        },
      },
      xAxis: {
        boundaryGap: false,
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: gridLine.color,
          },
        },
        axisLine: {
          lineStyle: {
            color: gridLine.color,
          },
        },
      },
      yAxis: {
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: gridLine.color,
          },
        },
        axisLine: {
          lineStyle: {
            color: gridLine.color,
          },
        },
      },
      textStyle: {
        color: font.color,
        fontFamily: font.fontFamily,
      },
    }

    return _.merge(defaultOptions, overridingOptions)
  }, [overridingOptions, font, gridLine, lineColors, tooltip])
  return (
    <ReactEcharts
      data-testid="DefaultChart"
      ref={chartRef}
      option={options}
      notMerge={true}
      opts={{
        renderer: 'canvas',
        width: 'auto',
        height: 'auto',
      }}
    />
  )
}

export default DefaultChart
