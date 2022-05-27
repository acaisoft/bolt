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
import { useTheme } from '@material-ui/styles'
import ReactEcharts from 'echarts-for-react'

const rangeOfColors = [
  [90, '#32D4C0'],
  [75, '#AAD432'],
  [50, '#D4CD32'],
  [30, '#D48932'],
  [0, '#F76F40'],
]

function getColorsForValue(value) {
  for (let [threshold, color] of rangeOfColors) {
    if (value >= threshold) {
      return color
    }
  }
}

export function SuccessRatePieChart({ value, size = 100, variant = 'default' }) {
  const theme = useTheme()
  const defaultColors = [
    theme.palette.chart.color.area.error,
    theme.palette.chart.color.area.success,
  ]

  const colors =
    variant === 'multicolor' ? ['#42405E', getColorsForValue(value)] : defaultColors

  const data = [
    {
      name: 'Not finished',
      value: 100 - value,
    },
    {
      name: 'Done',
      value,
    },
  ]

  const options = useMemo(() => {
    return {
      color: colors,
      series: [
        {
          silent: true,
          clockwise: false,
          type: 'pie',
          label: {
            show: false,
          },
          radius: ['70%', '100%'],
          avoidLabelOverlap: false,
          data: data,
        },
      ],
    }
  }, [colors, data])

  return (
    <ReactEcharts
      option={options}
      opts={{
        renderer: 'canvas',
      }}
      style={{
        height: size,
        width: size,
      }}
    />
  )
}

SuccessRatePieChart.propTypes = {
  value: PropTypes.number,
  size: PropTypes.number,
}

export default SuccessRatePieChart
