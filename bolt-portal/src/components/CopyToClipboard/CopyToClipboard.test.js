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
import { render, cleanup, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { copyValueFromInput } from 'utils/browser'
import { CopyToClipboard } from './CopyToClipboard'

jest.mock('utils/browser', () => ({
  copyValueFromInput: jest.fn(),
}))

jest.unmock('@material-ui/core')
jest.unmock('@material-ui/icons')

jest.useFakeTimers()

afterEach(cleanup)

let label
let text

describe('CopyToClipboard', () => {
  beforeEach(() => {
    label = 'Fake Label'
    text = 'value to copy'
  })

  test('put the text into a readonly input', () => {
    const { getByLabelText } = render(<CopyToClipboard label={label} text={text} />)

    const input = getByLabelText(label)

    expect(input).toHaveAttribute('readonly')
    expect(input).toHaveAttribute('value', text)
  })

  test('clicking should copy and switch icons', async () => {
    const user = userEvent.setup({ delay: null })
    const { getByTestId, queryByTestId } = render(
      <CopyToClipboard label={label} text={text} timeout={100} />
    )

    // Before clicking
    expect(getByTestId('copy-button')).toBeVisible()
    expect(queryByTestId('copied-button')).not.toBeInTheDocument()

    // Clicking to copy
    await user.click(getByTestId('copy-button'))

    // After clicking
    expect(copyValueFromInput).toHaveBeenCalled()
    expect(queryByTestId('copy-button')).not.toBeInTheDocument()
    expect(getByTestId('copied-button')).toBeVisible()

    // After timeout
    await act(() => {
      jest.runOnlyPendingTimers()
    })

    expect(getByTestId('copy-button')).toBeVisible()
    expect(queryByTestId('copied-button')).not.toBeInTheDocument()
  })
})
