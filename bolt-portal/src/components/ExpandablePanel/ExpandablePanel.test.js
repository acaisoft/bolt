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
import { cleanup, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ExpandablePanel } from './ExpandablePanel'

jest.unmock('@material-ui/core')
jest.unmock('@material-ui/icons')

afterEach(cleanup)

describe('ExpandablePanel', () => {
  test('render expandable panel with children', () => {
    const { queryAllByTestId, queryAllByText, queryByTestId } = render(
      <ExpandablePanel>Test label</ExpandablePanel>
    )
    const expansionPanelSummary = queryByTestId('expansion-panel-summary')

    expect(queryAllByTestId('expansion-panel')).toHaveLength(1)
    expect(queryAllByText('Test label')).toHaveLength(1)
    expect(expansionPanelSummary).toHaveAttribute('aria-expanded', 'false')
  })
  test('render expandable panel with title', () => {
    const { queryAllByTestId, queryAllByText } = render(
      <ExpandablePanel title="Test title">Test label</ExpandablePanel>
    )

    expect(queryAllByTestId('expansion-panel')).toHaveLength(1)
    expect(queryAllByText('Test label')).toHaveLength(1)
    expect(queryAllByText('Test title')).toHaveLength(1)
  })
  test('render expandable panel with defaultExpanded', () => {
    const { queryAllByTestId, queryAllByText, queryByTestId } = render(
      <ExpandablePanel defaultExpanded>Test label</ExpandablePanel>
    )
    const expansionPanelSummary = queryByTestId('expansion-panel-summary')

    expect(queryAllByTestId('expansion-panel')).toHaveLength(1)
    expect(queryAllByText('Test label')).toHaveLength(1)
    expect(expansionPanelSummary).toHaveAttribute('aria-expanded', 'true')
  })
  test('show/hide content on click', async () => {
    const user = userEvent.setup()
    const { queryByTestId } = render(<ExpandablePanel>Test label</ExpandablePanel>)
    const expansionPanelSummary = queryByTestId('expansion-panel-summary')

    expect(expansionPanelSummary).toHaveAttribute('aria-expanded', 'false')
    await user.click(expansionPanelSummary)
    expect(expansionPanelSummary).toHaveAttribute('aria-expanded', 'true')
    await user.click(expansionPanelSummary)
    expect(expansionPanelSummary).toHaveAttribute('aria-expanded', 'false')
  })
})
