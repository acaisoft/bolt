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
import { render, cleanup } from '@testing-library/react'

import { ClassesProxy } from 'utils/tests/mocks'
import { ToastContent } from './ToastContent'

jest.unmock('@material-ui/core')

let IconComponent, title, message

describe('component: ToastContent', () => {
  afterEach(cleanup)

  describe('rendering', () => {
    beforeEach(() => {
      IconComponent = props => <div id="mockedIcon" {...props} />
      title = 'Test title'
      message = 'Test message'
    })

    test('render icon', () => {
      const { getByTestId } = render(
        <ToastContent
          classes={ClassesProxy}
          title={title}
          message={message}
          IconComponent={IconComponent}
        />
      )
      const iconEl = getByTestId('toast-content-icon-component')

      expect(iconEl).toBeVisible()
    })

    test('render title', () => {
      const { getByText } = render(
        <ToastContent classes={ClassesProxy} title={title} message={message} />
      )
      const titleEl = getByText('Test title')

      expect(titleEl).toBeVisible()
    })

    test('render message', () => {
      const { getByText } = render(
        <ToastContent classes={ClassesProxy} title={title} message={message} />
      )
      const messageEl = getByText('Test message')

      expect(messageEl).toBeVisible()
    })
  })
})
