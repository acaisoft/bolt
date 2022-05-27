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
import moment from 'moment'

import filesize from 'filesize'
import { formatThousands, formatPercent } from 'utils/numbers'

import { TooltipBuilder } from 'utils/echartUtils'
import { DefaultChart } from 'components'

const formatters = {
  kBytes: value => filesize(value, { round: 3 }),
  bytes: value => filesize(value, { round: 2, exponent: 3 }),
  number: value => (value >= 1000 ? formatThousands(value) : value),
  percent: value => formatPercent(value, 0),
}

const formatTimestamp = timestamp => moment(timestamp).format('HH:mm:ss')

export function LineChart({ data, config, groupNames }) {
  const options = React.useMemo(() => {
    return {
      tooltip: {
        formatter: data => {
          return new TooltipBuilder(data).getTooltipForMonitoring(config.y_format)
        },
      },
      xAxis: {
        type: 'category',
        data: data.map(d => formatTimestamp(d.timestamp)),
      },
      yAxis: {
        min: config.min ? config.min : config.y_format === 'percent' ? 0 : null,
        max: config.max ? config.max : config.y_format === 'percent' ? 1 : null,
        type: config.scale === 'log' ? config.scale : 'value',
        axisLabel: {
          formatter: formatters[config.y_format],
        },
      },
      series: groupNames.map(groupName => {
        const isStacked = config.type === 'stacked'

        return {
          areaStyle: isStacked ? {} : undefined,
          stack: isStacked ? 'defaultStack' : undefined,
          name: groupName,
          type: 'line',
          showSymbol: false,
          animation: false,
          data: data.map(datum => {
            return datum.groups[groupName]
          }),
        }
      }),
    }
  }, [data, config, groupNames])

  return <DefaultChart options={options} />
}

export default LineChart
