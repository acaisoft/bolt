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
import _ from 'lodash'

import ReactEcharts from 'echarts-for-react'
import { useTheme } from '@material-ui/styles'
import { TooltipBuilder } from 'utils/echartUtils'

function getVisualMapForFormat({ yFormat, activeColor, theme, legendLabels }) {
  const {
    chart: { color, font },
  } = theme.palette

  if (yFormat === 'bool') {
    return {
      show: true,
      type: 'piecewise',
      min: 0,
      max: 1,
      calculable: false,
      orient: 'horizontal',
      left: 'center',
      bottom: '5%',
      splitNumber: 2,
      textStyle: font.color,
      pieces: [
        {
          value: 0,
          label: legendLabels[0] || 'false',
          color: color.heatmap.bool.inactive,
        },
        {
          value: 1,
          label: legendLabels[1] || 'true',
          color: activeColor || color.heatmap.bool.active,
        },
      ],
    }
  }

  return { type: 'continuous' }
}

function HeatmapChart({
  activeColor,
  legendLabels,
  options: overridingOptions,
  yFormat,
}) {
  const theme = useTheme()

  const options = React.useMemo(() => {
    const {
      chart: { font, tooltip },
    } = theme.palette

    const defaultOptions = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: tooltip.fill,
        textStyle: {
          color: font.color,
          fontFamily: font.fontFamily,
        },
        formatter: data => {
          return new TooltipBuilder(data).getTooltipForMonitoring('heatmap')
        },
      },
      textStyle: {
        color: font.color,
        fontFamily: font.fontFamily,
      },
      grid: {
        left: '3%',
        right: '4%',
        top: '3%',
        containLabel: true,
      },
      visualMap: getVisualMapForFormat({
        yFormat,
        activeColor,
        theme,
        legendLabels,
      }),
    }

    return _.merge(defaultOptions, overridingOptions)
  }, [activeColor, legendLabels, overridingOptions, theme, yFormat])

  return (
    <ReactEcharts
      option={options}
      opts={{
        renderer: 'canvas',
        width: 'auto',
        height: 'auto',
      }}
    />
  )
}

HeatmapChart.propTypes = {
  activeColor: PropTypes.string,
  legendLabels: PropTypes.arrayOf(PropTypes.string),
  options: PropTypes.object,
  yFormat: PropTypes.oneOf(['bool', 'number']),
}

export default HeatmapChart
