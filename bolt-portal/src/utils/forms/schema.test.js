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

import { makeEmptyInitialValues } from './schema'

describe('utils: forms/schema', () => {
  describe('makeEmptyInitialValues', () => {
    it('should throw an exception on invalid schema', () => {
      expect(() => makeEmptyInitialValues(null)).toThrow()
      expect(() => makeEmptyInitialValues(undefined)).toThrow()
      expect(() => makeEmptyInitialValues({})).toThrow()
    })

    it('should return the schema structure with empty strings as values', () => {
      const schema = {
        username: { icon: 'fake icon' },
        email: { something: true },
      }
      const result = makeEmptyInitialValues(schema)
      expect(result).toEqual({
        username: '',
        email: '',
      })
    })

    it('should work with nested structures using "fields" property', () => {
      const schema = {
        user: {
          fields: {
            firstName: {},
            lastName: {},
          },
        },
        email: {},
      }
      expect(makeEmptyInitialValues(schema)).toEqual({
        user: {
          firstName: '',
          lastName: '',
        },
        email: '',
      })
    })

    it('should use provided default values', () => {
      const schema = {
        user: {
          fields: {
            firstName: {},
            lastName: {},
          },
        },
        email: {},
        city: {},
      }
      const values = {
        user: {
          lastName: 'Tester',
        },
        city: 'Seattle',
      }
      expect(makeEmptyInitialValues(schema, values)).toEqual({
        user: {
          firstName: '',
          lastName: 'Tester',
        },
        email: '',
        city: 'Seattle',
      })
    })
  })
})
