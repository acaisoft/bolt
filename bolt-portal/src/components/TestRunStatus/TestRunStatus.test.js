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
import { MockedThemeProvider } from 'utils/tests/mocks'

import { TestRunStatus, configurations } from './TestRunStatus'
import { TestRunStatus as Status } from 'config/constants'

jest.unmock('@material-ui/core')
jest.unmock('@material-ui/icons')

describe('component: TestRunStatus', () => {
  afterEach(cleanup)

  describe('rendering', () => {
    describe('render everything properly', () => {
      test.each([
        [Status.FINISHED, configurations.FINISHED.title],
        [Status.TERMINATED, configurations.TERMINATED.title],
        [Status.RUNNING, configurations.RUNNING.title],
        [Status.PENDING, configurations.PENDING.title],
        [Status.ERROR, configurations.ERROR.title],
        [Status.MONITORING, configurations.MONITORING.title],
        ['ANYOTHERSTATUS', configurations.UNKNOWN.title],
        ['', configurations.UNKNOWN.title],
        [null, configurations.UNKNOWN.title],
        [undefined, configurations.UNKNOWN.title],
      ])(
        'when status is %s expect %s as title',
        (specifiedStatus, expectedTitle) => {
          const { getByText, getByTestId } = render(
            <MockedThemeProvider>
              <TestRunStatus status={specifiedStatus} />
            </MockedThemeProvider>
          )

          const titleEl = getByText(expectedTitle)
          const iconEl = getByTestId('test-run-status-icon')
          const wrapperEl = getByTestId('test-run-status-wrapper')

          expect(wrapperEl).toBeVisible()
          expect(titleEl).toBeVisible()
          expect(iconEl).toBeVisible()
        }
      )
    })
  })
})
