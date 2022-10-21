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


import { withStyles } from "@material-ui/core";
import React from "react";
import PropTypes from "prop-types";
import { DefaultChart } from 'components'
import theme from "config/theme";
import {TooltipBuilder} from "../../../utils/echartUtils";


const countResults = (run_data, result_to_count) => {
  return run_data.map(
    x => x.test_cases.filter(
      c => c.test_results[0].result === result_to_count
    ).length
  )
}

const truncateLabel = (text) => {
  return text.length > 15 ? text.slice(0, 15) + '...' : text
}

const TestGroupChart = ({ dataset }) => {
  const { color } = theme.palette.chart
  const common_params = {
    type: 'bar',
    stack: 'total',
    barWidth: '30%',
  }
  let successes = countResults(dataset, 'success')
  let failures = countResults(dataset, 'failure')
  let errors = countResults(dataset, 'error')
  let skipped = countResults(dataset, 'skipped')

  const series = []
  successes.reduce((x, y) => x + y) && series.push({
      name: 'Successes',
      data: successes,
      color: color.area.success,
      ...common_params
    })
  failures.reduce((x, y) => x + y) && series.push({
      name: 'Failures',
      data: failures,
      color: color.area.error,
      ...common_params
    })
  errors.reduce((x, y) => x + y) && series.push({
      name: 'Errors',
      data: errors,
      color: color.errors[0],
      ...common_params
    })
  skipped.reduce((x, y) => x + y) && series.push({
      name: 'Skipped',
      data: skipped,
      color: color.area.secondary,
      ...common_params
    })

  const options = React.useMemo(() => {
    return {
      tooltip: {
        formatter: formatter_data => {
          return new TooltipBuilder(formatter_data)
            .withDefaultHeader()
            .withNumericDataLine('Successes')
            .withNumericDataLine('Failures')
            .withNumericDataLine('Errors')
            .withNumericDataLine('Skipped')
            .getHtml()
        }
      },
      yAxis: {
        type: 'value'
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        scale: false,
        data: [...new Set(dataset.map(d => d.name))],
        axisLabel: {
          show: true,
          interval: 0,
          formatter: (label, index) =>
            index % 2 !== 0 ? '\n\n' + truncateLabel(label) :
              truncateLabel(label)
        },
      },
      legend: {
        show: true,
        data: [...new Set(series.map(d => d.name))],
      },
      color: series.map(x => x.color),
      series: series
    }
  }, [dataset])

  return (
      <DefaultChart options={options} />
    )

}

TestGroupChart.propTypes = {
  dataset: PropTypes.array
}

export default withStyles({}, { withTheme: true })(TestGroupChart)
