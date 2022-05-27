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
import { MemoryRouter } from 'react-router-dom'
import { cleanup, render } from '@testing-library/react'

import { Breadcrumbs } from './Breadcrumbs'
import { ClassesProxy } from 'utils/tests/mocks'

afterEach(cleanup)

jest.unmock('@material-ui/core')
jest.unmock('@material-ui/icons')

function renderWithRouter(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('Breadcrumbs', () => {
  test('should render null when no items', () => {
    const { container } = render(<Breadcrumbs />)

    expect(container.firstChild).toEqual(null)
  })

  test('should render items', () => {
    const items = [
      {
        key: 'projects',
      },
      {
        key: 'configurations',
      },
      {
        key: 'executions',
      },
    ]
    const { queryAllByTestId } = render(
      <Breadcrumbs classes={ClassesProxy} items={items} />
    )

    expect(queryAllByTestId('item')).toHaveLength(3)
  })

  test('should render items with url', () => {
    const items = [
      {
        key: 'projects',
        url: 'projects_url',
        label: 'projects_label',
      },
      {
        key: 'configurations',
        url: 'configurations_url',
        label: 'configurations_label',
      },
      {
        key: 'executions',
        url: 'executions_url',
        label: 'executions_label',
      },
    ]
    const { queryAllByText, queryAllByTestId } = renderWithRouter(
      <Breadcrumbs classes={ClassesProxy} items={items} />
    )

    expect(queryAllByTestId('link')).toHaveLength(3)
    expect(queryAllByText(/.+_label/)).toHaveLength(3)
  })

  test('should render items with render', () => {
    const renderer = ({ index }) => <div data-testid="render">{index}</div>
    const items = [
      {
        key: 'projects',
        render: renderer,
      },
      {
        key: 'configurations',
        render: renderer,
      },
      {
        key: 'executions',
        render: renderer,
      },
    ]
    const { queryAllByText, queryAllByTestId } = render(
      <Breadcrumbs classes={ClassesProxy} items={items} />
    )

    expect(queryAllByTestId('render')).toHaveLength(3)
    expect(queryAllByText(/\d/)).toHaveLength(3)
  })

  test('should render separator between items', () => {
    const items = [
      {
        key: 'projects',
      },
      {
        key: 'configurations',
      },
      {
        key: 'executions',
      },
    ]
    const { queryAllByTestId } = render(
      <Breadcrumbs classes={ClassesProxy} items={items} />
    )

    expect(queryAllByTestId('separator')).toHaveLength(2)
  })
})
