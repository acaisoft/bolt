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

import { areArraysEqual } from './collections'

describe('utils: collections', () => {
  describe('areArraysEqual', () => {
    it('should throw an error for non-arrays', () => {
      expect(() => areArraysEqual(null, null)).toThrow()
      expect(() => areArraysEqual(null, [])).toThrow()
      expect(() => areArraysEqual([], null)).toThrow()
    })

    it('should return false if arrays have different lengths', () => {
      expect(areArraysEqual([1], [1, 2])).toBe(false)
      expect(areArraysEqual([1, 3], [1])).toBe(false)
      expect(areArraysEqual([], [1])).toBe(false)
      expect(areArraysEqual([2], [])).toBe(false)
    })

    it('should return false if any items are different', () => {
      expect(areArraysEqual([1, 2, 3], [1, 3, 3])).toBe(false)
      expect(areArraysEqual([1, 3], [2, 3])).toBe(false)
    })

    it('should return true if arrays are equal', () => {
      expect(areArraysEqual([1, 2], [1, 2])).toBe(true)
      expect(areArraysEqual([1], [1])).toBe(true)
      expect(areArraysEqual([], [])).toBe(true)
    })
  })
})
