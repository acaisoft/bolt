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

import _ from 'lodash'

export function getDataForChart(
  { node_name, x_data_key, y_data_key, y_label },
  monitoringData
) {
  const ticksForNode = monitoringData.map(md => {
    const parsedData = JSON.parse(md.data)
    return {
      timestamp: +new Date(parsedData.timestamp),
      data: parsedData.data[node_name] || [],
    }
  })

  const groupNames = getUniqueGroupNames(ticksForNode, y_label)
  const emptyGroups = createEmptyGroups(groupNames)
  const data = ticksForNode.map(({ data, timestamp }) => ({
    timestamp,
    groups: {
      ...emptyGroups,
      ..._.mapValues(_.keyBy(data, y_label), y_data_key),
    },
  }))

  return { groupNames, data }
}

export function getUniqueGroupNames(ticksForNode, y_label) {
  return [
    ...new Set(
      _.flatMap(ticksForNode, tick => {
        if (!tick.data) return []

        // TODO:
        // Temp fix - some node data is an object instead of an array of objects
        // Remove when mock data is fixed
        if (!Array.isArray(tick.data)) {
          tick.data = [tick.data]
        }

        return tick.data.reduce((accumulatedGroups, group) => {
          if (!group) return accumulatedGroups
          return [...accumulatedGroups, group[y_label]]
        }, [])
      })
    ),
  ]
}

export function createEmptyGroups(groupNames) {
  return groupNames.reduce((acc, name) => {
    return {
      ...acc,
      [name]: null,
    }
  }, {})
}
