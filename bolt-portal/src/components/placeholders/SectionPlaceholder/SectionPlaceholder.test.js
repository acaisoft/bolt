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

import { SectionPlaceholder } from './SectionPlaceholder'

jest.unmock('@material-ui/core')
jest.unmock('@material-ui/icons')

let title, description, actions, topImage, icon

describe('component: SectionPlaceholder', () => {
  afterEach(cleanup)

  describe('rendering', () => {
    beforeEach(() => {
      actions = <div data-testid="fake-actions" />
      title = 'Test title'
      description = 'Test description'
      topImage = <div data-testid="fake-top-image" />
      icon = <div data-testid="fake-icon" />
    })

    test('render description', () => {
      const { getByText } = render(
        <SectionPlaceholder title={title} description={description} />
      )
      const descriptionEl = getByText(description)

      expect(descriptionEl).toBeVisible()
    })

    test('render provided actions', () => {
      const { getByTestId } = render(
        <SectionPlaceholder title={title} actions={actions} />
      )
      expect(getByTestId('fake-actions')).toBeVisible()
    })

    test('render provided icon', () => {
      const { getByTestId } = render(
        <SectionPlaceholder title={title} icon={icon} />
      )
      expect(getByTestId('fake-icon')).toBeVisible()
    })

    test('render provided top image', () => {
      const { getByTestId } = render(
        <SectionPlaceholder title={title} topImage={topImage} />
      )
      expect(getByTestId('fake-top-image')).toBeVisible()
    })

    describe("set the container's height", () => {
      test.each([
        [undefined, '100%'], // default
        ['20vh', '20vh'],
        ['100px', '100px'],
      ])('when height is %s, should set to %s', (height, expected) => {
        const { getByTestId } = render(
          <SectionPlaceholder title={title} height={height} />
        )

        const container = getByTestId('placeholder-root')
        expect(container).toHaveStyle(`height: ${expected}`)
      })
    })
  })
})
