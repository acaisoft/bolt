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
import { render, cleanup, getByTestId } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Button } from './Button'

jest.unmock('@material-ui/core')

let label

describe('component: Button', () => {
  afterEach(cleanup)

  beforeEach(() => {
    label = 'My button'
  })

  describe('rendering', () => {
    test('button text', () => {
      const { getByText } = render(<Button>{label}</Button>)

      const button = getByText(label)
      expect(button).toBeVisible()
    })

    test('icon', () => {
      const icon = () => <span data-testid="fake-icon" />
      const { getByText } = render(<Button icon={icon}>{label}</Button>)

      const button = getByText(label)
      expect(getByTestId(button, 'fake-icon')).toBeVisible()
    })

    test('as <button /> by default', () => {
      const { getByRole } = render(<Button>{label}</Button>)

      const button = getByRole('button')
      expect(button.tagName).toBe('BUTTON')
      expect(button).toHaveAttribute('type', 'button')
    })

    test('as <a /> when href passed', () => {
      const href = '/some/url'
      const { getByRole } = render(
        <MemoryRouter>
          <Button href={href}>{label}</Button>
        </MemoryRouter>
      )

      const button = getByRole('button')
      expect(button.tagName).toBe('A')
      expect(button).toHaveAttribute('href', href)
    })

    test('link variant', () => {
      const { getByRole } = render(
        <Button variant="link" classes={{ link: 'fake-link-class' }}>
          {label}
        </Button>
      )

      const button = getByRole('button')
      expect(button).toHaveClass('fake-link-class')
    })
  })

  describe('events', () => {
    test('onClick', async () => {
      const user = userEvent.setup()
      const onClick = jest.fn()
      const { getByText } = render(<Button onClick={onClick}>{label}</Button>)

      const button = getByText(label)
      await user.click(button)

      expect(onClick).toHaveBeenCalled()
    })
  })
})
