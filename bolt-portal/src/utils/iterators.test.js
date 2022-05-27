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

import { traverseRecursively } from './iterators'

describe('utils: iterators', () => {
  describe('traverseRecursively', () => {
    const getMockOptions = () => ({
      childKey: 'fields',
      nodeCallback: jest.fn(({ newSubtree }) => newSubtree),
      leafCallback: jest.fn(({ value }) => value),
    })

    it('should return empty object on empty input parameter', () => {
      expect(traverseRecursively({}, getMockOptions())).toEqual({})
    })

    it('should throw an error on invalid callbacks', () => {
      expect(() => traverseRecursively({}, { nodeCallback: undefined })).toThrow()
      expect(() => traverseRecursively({}, { leafCallback: undefined })).toThrow()
      expect(() =>
        traverseRecursively({}, { nodeCallback: undefined, leafCallback: undefined })
      ).toThrow()
    })

    it('should call nodeCallback on each node (depth first strategy)', () => {
      const subtree = {
        user: {
          fields: {
            firstName: 'John',
            lastName: 'Doe',
          },
        },
        age: 30,
        address: {
          fields: {
            city: 'California',
            street: 'Test St',
          },
        },
      }
      const options = getMockOptions()

      traverseRecursively(subtree, options)

      expect(options.nodeCallback).toHaveBeenCalledTimes(2)
      expect(options.nodeCallback.mock.calls[0]).toEqual([
        {
          key: 'user',
          value: subtree.user,
          path: ['user'],
          newSubtree: subtree.user.fields,
        },
      ])
      expect(options.nodeCallback.mock.calls[1]).toEqual([
        {
          key: 'address',
          value: subtree.address,
          path: ['address'],
          newSubtree: subtree.address.fields,
        },
      ])
    })

    it('should call leafCallback on each leaf', () => {
      const subtree = {
        user: {
          fields: {
            firstName: 'John',
            lastName: 'Doe',
          },
        },
        age: 30,
        status: 'active',
      }
      const options = getMockOptions()

      traverseRecursively(subtree, options)

      expect(options.leafCallback).toHaveBeenCalledTimes(4)
      expect(options.leafCallback.mock.calls[0]).toEqual([
        {
          key: 'firstName',
          value: subtree.user.fields.firstName,
          path: ['user', 'firstName'],
        },
      ])
      expect(options.leafCallback.mock.calls[1]).toEqual([
        {
          key: 'lastName',
          value: subtree.user.fields.lastName,
          path: ['user', 'lastName'],
        },
      ])
      expect(options.leafCallback.mock.calls[2]).toEqual([
        {
          key: 'age',
          value: subtree.age,
          path: ['age'],
        },
      ])
      expect(options.leafCallback.mock.calls[3]).toEqual([
        {
          key: 'status',
          value: subtree.status,
          path: ['status'],
        },
      ])
    })
  })

  it('should return transformed subtree', () => {
    const subtree = {
      user: {
        fields: {
          firstName: 'John',
          lastName: 'Doe',
        },
      },
      age: 30,
      address: {
        fields: {
          city: 'California',
          street: 'Test St',
        },
      },
    }

    const newOptions = {
      childKey: 'fields',
      nodeCallback: ({ newSubtree }) => ({
        type: 'node',
        nodeChildren: newSubtree,
      }),
      leafCallback: ({ value }) => ({ type: 'leaf', value }),
    }
    const result = traverseRecursively(subtree, newOptions)

    expect(result).toEqual({
      user: {
        type: 'node',
        nodeChildren: {
          firstName: {
            type: 'leaf',
            value: 'John',
          },
          lastName: {
            type: 'leaf',
            value: 'Doe',
          },
        },
      },
      age: {
        type: 'leaf',
        value: 30,
      },
      address: {
        type: 'node',
        nodeChildren: {
          city: {
            type: 'leaf',
            value: 'California',
          },
          street: {
            type: 'leaf',
            value: 'Test St',
          },
        },
      },
    })
  })
})
