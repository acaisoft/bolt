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
import PropTypes from 'prop-types'

import { TextField } from 'final-form-material-ui'
import { Field } from 'react-final-form'

function FormField({
  children,
  component = TextField,
  field: { inputProps = {} } = {},
  name,
  subscription = {
    value: true,
    error: true,
    touched: true,
    submitError: true,
    dirtySinceLastSubmit: true,
  },
  ...rest
}) {
  return (
    <Field component={component} name={name} {...inputProps} {...rest}>
      {children}
    </Field>
  )
}
FormField.propTypes = {
  component: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  field: PropTypes.shape({
    inputProps: PropTypes.object,
  }),
  name: PropTypes.string.isRequired,
  ...Field.propTypes,
}

export default FormField
