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

import { getDataForChart, getUniqueGroupNames, createEmptyGroups } from './module'

describe('module:', () => {
  describe('get data for chart: ', () => {
    test('get data for chart', () => {
      const exampleConfig = {
        type: 'line',
        node_name: 'testNodeName',
        x_data_key: 'timestamp',
        x_format: 'number',
        y_data_key: 'testValue',
        y_format: 'number',
        y_label: 'testLabel',
      }
      const exampleData = [
        {
          data:
            '{"timestamp":1234,"data":{"testNodeName":[{"testValue":1,"testLabel":"label1"},{"testValue":2,"testLabel":"label2"}]}}',
        },
      ]
      expect(getDataForChart(exampleConfig, exampleData)).toEqual({
        data: [
          {
            groups: { label1: 1, label2: 2 },
            timestamp: 1234,
          },
        ],
        groupNames: ['label1', 'label2'],
      })
    })
  })
  describe('get unique group names:', () => {
    test('get unique groupnames', () => {
      const label = 'name'
      const ticks = [
        {
          timestamp: 1234,
          data: null,
        },
      ]
      expect(getUniqueGroupNames(ticks, label)).toEqual([])
    })

    test('get unique groupsnames from null/undefined array', () => {
      const label = 'name'
      const ticks = [
        {
          timestamp: 1234,
          data: [
            undefined,
            { name: 'testName1', value: 13 },
            { name: 'testName1', value: 14 },
            { name: 'testName2', value: 6 },
            null,
          ],
        },
      ]
      expect(getUniqueGroupNames(ticks, label)).toEqual(['testName1', 'testName2'])
    })
  })

  describe('create empty groups:', () => {
    test('create empty groups object from array', () => {
      const groupsArray = ['testName1', 'testName2']
      expect(createEmptyGroups(groupsArray)).toEqual({
        testName1: null,
        testName2: null,
      })
    })
  })
})
