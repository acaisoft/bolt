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
import { Column } from './DataTable'

export const checkboxKey = jest.fn()
export const children = [
  <Column key="id" render={x => x.id} title="ID" />,
  <Column key="name" render={x => x.name} title="Name" />,
  <Column key="age" render={x => x.age} title="Age" />,
]

export const data = [
  { id: 1, name: 'Jane Doe', age: 30 },
  { id: 2, name: 'Steven Bush', age: 36 },
]

export const columnSettings = [
  {
    key: 'name',
    title: 'Name',
    render: item => item.name,
  },
  {
    key: 'age',
    title: 'Age',
    render: item => item.age,
    renderFooter: () => (
      <div>Total age: {data.reduce((acc, v) => acc + v.age, 0)}</div>
    ),
  },
]

export const onSelect = jest.fn()
