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

import { withStyles } from '@material-ui/core'
import React from 'react'
import PropTypes from 'prop-types'
import { DefaultChart } from 'components'
import theme from 'config/theme'
import { TooltipBuilder } from '../../../utils/echartUtils'
import moment from 'moment'

const countResults = (run_data, result_to_count) => {
  return run_data.map(c => c[result_to_count])
}

const ScenarioEvolutionGraph = ({ dataset }) => {
  const { color } = theme.palette.chart
  const common_params = {
    type: 'bar',
    stack: 'total',
    barWidth: '30%',
  }
  let totals = countResults(dataset, 'total')
  let successes = countResults(dataset, 'successes')
  let failures = countResults(dataset, 'failures')
  let errors = countResults(dataset, 'errors')
  let skipped = countResults(dataset, 'skipped')

  const series = [
    {
      name: 'Total',
      data: totals,
      color: color.background,
      type: 'bar',
      barGap: '-100%',
      barWidth: '30%',
      offset: '-50%',
      z: 0,
    },
  ]
  successes.reduce((x, y) => x + y) &&
    series.push({
      name: 'Successes',
      data: successes,
      color: color.area.success,
      ...common_params,
    })
  failures.reduce((x, y) => x + y) &&
    series.push({
      name: 'Failures',
      data: failures,
      color: color.area.error,
      ...common_params,
    })
  errors.reduce((x, y) => x + y) &&
    series.push({
      name: 'Errors',
      data: errors,
      color: color.errors[0],
      ...common_params,
    })
  skipped.reduce((x, y) => x + y) &&
    series.push({
      name: 'Skipped',
      data: skipped,
      color: color.area.secondary,
      ...common_params,
    })

  const options = React.useMemo(() => {
    return {
      tooltip: {
        formatter: formatter_data => {
          return new TooltipBuilder(formatter_data)
            .withDefaultHeader()
            .withNumericDataLine('total')
            .withNumericDataLine('Successes')
            .withNumericDataLine('Failures')
            .withNumericDataLine('Errors')
            .withNumericDataLine('Skipped')
            .getHtml()
        },
      },
      yAxis: {
        type: 'value',
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        scale: false,
        data: dataset.map(d => d.timestamp),
        axisLabel: {
          formatter: label => {
            return moment(label).format('HH:mm:ss YYYY-MM-DD').replace(' ', '\n')
          },
          show: true,
          interval: 0,
        },
      },
      legend: {
        show: true,
        data: series.map(d => d.name),
      },
      color: series.map(x => x.color),
      series: series,
    }
  }, [dataset])

  return <DefaultChart options={options} />
}

ScenarioEvolutionGraph.propTypes = {
  dataset: PropTypes.array,
}

export default withStyles({}, { withTheme: true })(ScenarioEvolutionGraph)
