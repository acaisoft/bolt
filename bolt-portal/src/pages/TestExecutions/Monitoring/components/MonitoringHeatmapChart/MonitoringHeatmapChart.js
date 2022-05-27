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
import moment from 'moment'

import { useTheme } from '@material-ui/styles'
import { SectionHeader, NoDataPlaceholder } from 'components'
import HeatmapChart from './HeatmapChart'

const formatTimestamp = timestamp => moment(timestamp).format('HH:mm:ss')

function MonitoringHeatmapChart({ data, config, groupNames }) {
  const theme = useTheme()

  const options = React.useMemo(() => {
    return {
      xAxis: {
        type: 'category',
        data: data.map(d => formatTimestamp(d.timestamp)),
      },
      yAxis: {
        type: 'category',
        data: groupNames,
        axisLabel: {
          formatter: value => value.split('.').pop(),
        },
      },
      series: groupNames.map((groupName, groupIndex) => {
        return {
          name: groupName,
          type: 'heatmap',
          animation: false,
          itemStyle: {
            emphasis: {
              borderColor: '#333',
              borderWidth: 1,
            },
          },
          data: data.map((datum, datumIndex) => {
            const value = datum.groups[groupName]
            return [datumIndex, groupIndex, value === null ? null : +value]
          }),
        }
      }),
    }
  }, [data, groupNames])

  return (
    <React.Fragment>
      <SectionHeader title={config.title} size="small" marginBottom />

      {groupNames.length > 0 ? (
        <HeatmapChart
          activeColor={theme.palette.error.main}
          options={options}
          yFormat={config.y_format}
          legendLabels={[
            config.y_true_label || `Not ${config.y_data_key}`,
            config.y_false_label || config.y_data_key,
          ]}
        />
      ) : (
        <NoDataPlaceholder title="No Data" height={300} />
      )}
    </React.Fragment>
  )
}

MonitoringHeatmapChart.propTypes = {
  config: PropTypes.object.isRequired,
  data: PropTypes.arrayOf(PropTypes.object),
  groupNames: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default MonitoringHeatmapChart
