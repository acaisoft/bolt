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

import { formatScaledDuration } from 'utils/datetime'
import { TooltipBuilder } from 'utils/echartUtils'
import { DefaultChart } from 'components'

export function TimeDistributionChart({ data }) {
  const dataAsArray = useMemo(() => {
    const percentiles = [50, 66, 75, 80, 90, 95, 99, 100]
    return percentiles.map(percentile => ({
      percentile,
      value: data[`p${percentile}`],
    }))
  }, [data])

  const options = useMemo(() => {
    return {
      tooltip: {
        axisPointer: {
          type: 'shadow',
        },

        formatter: data => {
          return new TooltipBuilder(data)
            .withDefaultHeader()
            .withDurationLine('Time')
            .getHtml()
        },
      },
      xAxis: {
        boundaryGap: true,
        type: 'category',
        data: dataAsArray.map(d => d.percentile),
        axisLabel: {
          formatter: value => `${value}%`,
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: formatScaledDuration,
        },
      },
      series: [
        {
          name: 'Time',
          type: 'bar',
          barWidth: 20,
          data: dataAsArray.map(datum => datum.value),
        },
      ],
    }
  }, [dataAsArray])
  return <DefaultChart options={options} />
}
TimeDistributionChart.propTypes = {
  data: PropTypes.object,
}

export default TimeDistributionChart
