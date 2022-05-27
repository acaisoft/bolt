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

import React, { useMemo, useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { withStyles } from '@material-ui/core'

import ReactEcharts from 'echarts-for-react'
import { TooltipBuilder } from 'utils/echartUtils'
import ReactResizeDetector from 'react-resize-detector'

export function FailuresChart({ data = [], theme }) {
  const { color, tooltip, font } = theme.palette.chart

  const totalErrors = useMemo(() => _.sumBy(data, 'number_of_occurrences'), [data])

  const [trimLength, setTrimLength] = useState()

  const getTrimLength = useCallback(width => {
    const rangeOfTrim = [
      [750, 75],
      [700, 65],
      [600, 55],
      [500, 35],
      [450, 20],
      [400, 20],
      [350, 15],
      [300, 15],
      [250, 10],
    ]

    for (let [step, trim] of rangeOfTrim) {
      if (width >= step) {
        setTrimLength(trim)
        break
      }
    }
  }, [])

  const colors = [
    color.area.secondary,
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

  const options = useMemo(() => {
    return {
      title: {
        top: 'center',
        left: 70,
        text: `Total: ${totalErrors}`,
        textStyle: {
          color: font.color,
          fontFamily: font.fontFamily,
          fontSize: 15,
        },
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 0,
        top: 20,
        bottom: 20,
        formatter: value =>
          _.truncate(value, { length: trimLength, omission: '...' }),
        textStyle: {
          color: font.color,
          fontFamily: font.fontFamily,
        },
        tooltip: {
          show: true,
          backgroundColor: tooltip.fill,
          textStyle: {
            color: font.color,
            fontFamily: font.fontFamily,
          },
          formatter: data => {
            return new TooltipBuilder(data).getTooltipForFailuresPieChartLegend()
          },
        },
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: tooltip.fill,
        textStyle: {
          color: font.color,
          fontFamily: font.fontFamily,
        },
        formatter: data => {
          return new TooltipBuilder(data).getTooltipForFailuresPieChart(totalErrors)
        },
      },
      color: colors,
      series: [
        {
          name: 'Failures',
          type: 'pie',
          label: {
            normal: {
              show: false,
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          hoverAnimation: false,
          radius: ['50%', '60%'],
          center: [120, '50%'],
          data: data.map(datum => ({
            name: datum.exception_data,
            value: datum.number_of_occurrences,
          })),
        },
      ],
    }
  }, [data, colors, font, tooltip, totalErrors, trimLength])

  return (
    <React.Fragment>
      <ReactEcharts
        option={options}
        notMerge={true}
        opts={{
          renderer: 'canvas',
          width: 'auto',
          height: 'auto',
        }}
      />
      <ReactResizeDetector
        handleWidth
        onResize={width => getTrimLength(width)}
        refreshRate={200}
        refreshMode="debounce"
      />
    </React.Fragment>
  )
}
FailuresChart.propTypes = {
  data: PropTypes.array,
  theme: PropTypes.object.isRequired,
}

export default withStyles({}, { withTheme: true })(FailuresChart)
