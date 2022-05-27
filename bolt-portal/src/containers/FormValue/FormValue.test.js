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
import userEvent from '@testing-library/user-event'
import { Form } from 'react-final-form'

import { FormValue } from './FormValue'

afterEach(cleanup)

describe('FormValue', () => {
  it('should re-render on each value change', async () => {
    const user = userEvent.setup()
    const { getByTestId, getByText } = render(
      <Form
        initialValues={{
          firstName: 'John',
          lastName: 'Doe',
        }}
        onSubmit={jest.fn()}
      >
        {form => (
          <React.Fragment>
            <button onClick={() => form.form.change('lastName', 'Williams')}>
              Change name
            </button>
            <FormValue data-something="1" name="lastName">
              {lastName => <div data-testid="last-name-value">{lastName}</div>}
            </FormValue>
          </React.Fragment>
        )}
      </Form>
    )
    const lastNameDiv = getByTestId('last-name-value')
    expect(lastNameDiv.textContent).toEqual('Doe')

    const button = getByText('Change name')
    await user.click(button)

    expect(lastNameDiv.textContent).toEqual('Williams')
  })
})
