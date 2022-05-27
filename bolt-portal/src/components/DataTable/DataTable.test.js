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
import { shallow } from 'enzyme'

import { ClassesProxy } from 'utils/tests/mocks'

import {
  DataTable,
  Column,
  haveColumnsChanged,
  calculateColumnSettings,
} from './DataTable'
import { checkboxKey, data, onSelect } from './DataTable.test.mock'

const initDataTable = overrides => {
  const wrapper = shallow(
    <DataTable classes={ClassesProxy} data={data} {...overrides} />
  )
  return { wrapper }
}

// TODO: These tests are legacy code because enzyme doesn't provide an adapter for React v18.
//  We should try rewrite this component (make it use hooks) and these tests with react-testing-library, although with some of them it might be impossible
describe('component: DataTable', () => {
  describe('rendering', () => {
    it('should render without crashing', () => {
      const { wrapper } = initDataTable()
      expect(wrapper).toBeTruthy()
    })
  })

  describe('lifecycle', () => {
    describe('constructor', () => {
      it('should initialize selected with initialSelected', () => {
        const initialSelected = new Set([1, 2, 3])
        const { wrapper } = initDataTable({ initialSelected })
        expect(wrapper.state('selected')).toBe(initialSelected)
      })
    })

    describe('getDerivedStateFromProps', () => {
      const fakeChildren = [
        <Column key="id" render={x => x.id} />,
        <Column key="name" render={x => x.name} />,
      ]
      const expectedColumns = [
        { key: '.$id', render: expect.any(Function) },
        { key: '.$name', render: expect.any(Function) },
      ]

      it('should return columnNodes and columns on init', () => {
        const nextProps = { children: fakeChildren }
        const prevState = {}
        expect(
          DataTable.getDerivedStateFromProps(nextProps, prevState)
        ).toMatchObject({
          columnNodes: fakeChildren,
          columns: expectedColumns,
        })
      })

      it('should return columnNodes and columns if children have changed', () => {
        const nextProps = { children: fakeChildren }
        const prevState = {
          columnNodes: [<Column key="id" render={x => x.id} />],
        }
        expect(
          DataTable.getDerivedStateFromProps(nextProps, prevState)
        ).toMatchObject({
          columnNodes: fakeChildren,
          columns: expectedColumns,
        })
      })

      it('should return null if nothing has changed', () => {
        const nextProps = { children: fakeChildren, pure: true }
        const prevState = { columnNodes: fakeChildren }
        expect(DataTable.getDerivedStateFromProps(nextProps, prevState)).toBe(null)
      })
    })
  })

  describe('events', () => {
    describe('handleSelectAll', () => {
      beforeEach(() => {
        checkboxKey.mockReset()
        onSelect.mockClear()
      })

      it('should select all items if none are selected', () => {
        const { wrapper } = initDataTable({ onSelect })
        const instance = wrapper.instance()
        instance.setState({ selected: new Set() })
        instance.handleSelectAll()
        expect([...instance.state.selected]).toEqual([1, 2])
        expect(onSelect).toHaveBeenCalledWith(instance.state.selected)
      })

      it('should deselect all items if any are selected', () => {
        const { wrapper } = initDataTable({ onSelect })
        const instance = wrapper.instance()
        instance.setState({ selected: new Set([1]) })
        instance.handleSelectAll()
        expect([...instance.state.selected]).toEqual([])
        expect(onSelect).toHaveBeenCalledWith(instance.state.selected)
      })

      it('should use checkboxKey to get selected keys', () => {
        checkboxKey.mockImplementation(x => x.age)
        const { wrapper } = initDataTable({ onSelect, checkboxKey })
        const instance = wrapper.instance()
        instance.setState({ selected: new Set([]) })
        instance.handleSelectAll()
        expect(checkboxKey).toHaveBeenCalledTimes(2)
        expect([...instance.state.selected]).toEqual([30, 36])
      })
    })

    describe('handleSelect', () => {
      describe('single select mode', () => {
        beforeEach(() => {
          onSelect.mockClear()
        })

        const { wrapper } = initDataTable({ onSelect, multiselect: false })
        const instance = wrapper.instance()

        it('should select one item if none are selected', () => {
          instance.setState({ selected: new Set() })
          instance.handleSelect(1)()
          expect([...instance.state.selected]).toEqual([1])
          expect(onSelect).toHaveBeenCalledWith(instance.state.selected)
        })

        it('should deselect one item if it was previously selected', () => {
          instance.setState({ selected: new Set([1]) })
          instance.handleSelect(1)()
          expect([...instance.state.selected]).toEqual([])
          expect(onSelect).toHaveBeenCalledWith(instance.state.selected)
        })

        it('should select one item and deselect any other previously selected', () => {
          instance.setState({ selected: new Set([1]) })
          instance.handleSelect(2)()
          expect([...instance.state.selected]).toEqual([2])
          expect(onSelect).toHaveBeenCalledWith(instance.state.selected)
        })
      })

      describe('multi select mode', () => {
        beforeEach(() => {
          onSelect.mockClear()
        })

        const { wrapper } = initDataTable({ onSelect, multiselect: true })
        const instance = wrapper.instance()

        it('should select one item if none are selected', () => {
          instance.setState({ selected: new Set() })
          instance.handleSelect(1)()
          expect([...instance.state.selected]).toEqual([1])
          expect(onSelect).toHaveBeenCalledWith(instance.state.selected)
        })

        it('should deselect one item if it was previously selected', () => {
          instance.setState({ selected: new Set([1]) })
          instance.handleSelect(1)()
          expect([...instance.state.selected]).toEqual([])
          expect(onSelect).toHaveBeenCalledWith(instance.state.selected)
        })

        it('should select one item and deselect any other previously selected', () => {
          instance.setState({ selected: new Set([1]) })
          instance.handleSelect(2)()
          expect([...instance.state.selected]).toEqual([1, 2])
          expect(onSelect).toHaveBeenCalledWith(instance.state.selected)
        })
      })
    })
  })

  describe('helpers', () => {
    describe('Column', () => {
      it('should be a placeholder component with no rendering', () => {
        const wrapper = shallow(<Column render={x => x.id} />)
        expect(wrapper.isEmptyRender()).toBe(true)
      })
    })

    describe('haveColumnsChanged', () => {
      it('should return true if children have different lengths', () => {
        const prevKeys = [<i key="one" />, <i key="two" />]
        const nextKeys = [<i key="one" />, <i key="two" />, <i key="three" />]
        expect(haveColumnsChanged(prevKeys, nextKeys)).toBe(true)
      })

      it('should return true if children have different keys', () => {
        const prevKeys = [<i key="one" />, <i key="two" />]
        const nextKeys = [<i key="one" />, <i key="three" />]
        expect(haveColumnsChanged(prevKeys, nextKeys)).toBe(true)
      })

      it('should return false if children have the same lengths and keys', () => {
        const prevKeys = [<i key="one" />, <i key="two" />]
        const nextKeys = [<i key="one" />, <i key="two" />]
        expect(haveColumnsChanged(prevKeys, nextKeys)).toBe(false)
      })
    })

    describe('calculateColumnSettings', () => {
      it('should read all children props plus keys', () => {
        const children = [
          <i key="one" color="red" />,
          <i key="two" someProp="value" />,
        ]
        expect(calculateColumnSettings(children)).toEqual([
          { color: 'red', key: '.$one' },
          { someProp: 'value', key: '.$two' },
        ])
      })
    })
  })
})
