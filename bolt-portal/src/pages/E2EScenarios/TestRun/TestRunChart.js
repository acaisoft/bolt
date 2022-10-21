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

const TestRunChart = ({ data }) => {
  const { color } = theme.palette.chart
  const { font } = theme.palette.chart
  const total_data = []
    data.successes && total_data.push({
      name: 'Successes',
      value: data.successes,
      color: color.area.success,
    })
    data.failures && total_data.push({
      name: 'Failures',
      value: data.failures,
      color: color.area.error,
    })
    data.errors && total_data.push({
      name: 'Errors',
      value: data.errors,
      color: color.errors[0],
    })
    data.skipped && total_data.push({
      name: 'Skipped',
      value: data.skipped,
      color: color.area.secondary,
    })

  const options = React.useMemo(() => {
    return {
      yAxis: [ { show: false } ],
      xAxis: [ { show: false } ],
      legend: {
        show: true,
        data: [...new Set(total_data.map(d => d.name))],
        x: 'center',
        bottom: 0
      },
      grid: {
        containLabel: true
      },
      color: total_data.map(x => x.color),
      series: [
        {
          center: ['50%', '40%'],
          data: total_data,
          name: 'Results Distribution',
          type: 'pie',
          label: {
            color: font.color,
            show: true
          },
          emphasis: {
            label: {
              formatter: "   {c}   ",
              show: true
            }
          },
          startAngle: 0
        }
      ],
    }
  }, [data])

  return (
      <DefaultChart options={options} />
    )

}

TestRunChart.propTypes = {
  data: PropTypes.object
}

export default withStyles({}, { withTheme: true })(TestRunChart)
