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
import _ from 'lodash'
import { withStyles } from '@material-ui/core'
import { TooltipBuilder } from 'utils/echartUtils'
import { formatThousands } from 'utils/numbers'
import { DefaultChart } from 'components'

const formatLabel = label => _.truncate(label, { length: 15, omission: '...' })

export function ResultsPerEndpointChart({ data, theme }) {
  const { color } = theme.palette.chart

  const barColors = [color.area.error, color.area.success]

  const options = useMemo(() => {
    return {
      tooltip: {
        axisPointer: {
          type: 'shadow',
        },
        formatter: data => {
          return new TooltipBuilder(data)
            .withDefaultHeader()
            .withNumericDataLine('Fail')
            .withNumericDataLine('Success')
            .getHtml()
        },
      },
      color: barColors,
      xAxis: {
        type: 'value',
        axisLabel: {
          formatter: value => formatThousands(value),
        },
      },
      yAxis: {
        type: 'category',
        data: data.map(d => d.name),
        axisLabel: {
          formatter: formatLabel,
        },
      },
      series: [
        {
          name: 'Fail',
          type: 'bar',
          stack: 'group',
          barWidth: 20,
          data: data.map(datum => datum.num_failures),
        },
        {
          name: 'Success',
          type: 'bar',
          stack: 'group',
          barWidth: 20,
          data: data.map(datum => datum.num_successes),
        },
      ],
    }
  }, [data, barColors])
  return <DefaultChart options={options} />
}
ResultsPerEndpointChart.propTypes = {
  data: PropTypes.array,
  execution: PropTypes.object,
  theme: PropTypes.object.isRequired,
}

export default withStyles({}, { withTheme: true })(ResultsPerEndpointChart)
