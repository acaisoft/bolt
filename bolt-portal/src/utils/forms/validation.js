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

import validate from 'validate.js'
import _ from 'lodash'

import { createObjectFromDotNotation } from '../collections'

// Usually used as: <Form validate={values => validateForm(values, mySchema)} />
export const validateForm = (values, schema) => {
  const result = validate(values, schema)
  if (!result) {
    return
  }

  // Get first error message for each field.
  Object.keys(result).forEach(key => {
    result[key] = result[key][0]
  })

  // Convert { path.to.field: value } into { path: { to: { field: value } } }
  return createObjectFromDotNotation(result)
}

// Base, general conditional validator for creating other.
// It applies the validation constraints only if the predicate returns true
export const validateWhen =
  (predicate, validation) => (value, attributes, attributeName) => {
    if (!predicate(value, attributes, attributeName)) {
      return null
    }

    return validation
  }

// e.g. validateOnFieldValue('some.field', 'expected value', { ... })
export const validateOnFieldValue = (fieldPath, value, validation) => {
  return validateWhen((predicate, attributes) => {
    return _.get(attributes, fieldPath) === value
  }, validation)
}

/*
 * Custom Validators
 */
export const requireWhenOtherIsSet = otherFieldPath => (value, allValues) => {
  if (value) {
    return
  }

  if (
    ['', undefined].includes(value) &&
    !['', undefined].includes(_.get(allValues, otherFieldPath))
  ) {
    return 'Required'
  }
}

export const uniqueInArray = (arrayPath, fieldPath) => (value, allValues) => {
  if (!value) {
    return
  }

  const arrayValues = _.map(_.get(allValues, arrayPath), fieldPath)
  const isDuplicated = arrayValues.filter(v => v === value).length > 1

  if (isDuplicated) {
    return 'Must be unique'
  }
}

export const composeValidators =
  (...validators) =>
  (value, allValues) => {
    if (validators.length === 0) {
      return
    }

    return validators.reduce(
      (err, validator) => err || validator(value, allValues),
      undefined
    )
  }
