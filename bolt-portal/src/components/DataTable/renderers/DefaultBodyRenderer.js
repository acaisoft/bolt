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
import classNames from 'classnames'

import { Loader } from 'components'
import { TableBody, TableRow, TableCell, Checkbox } from '@material-ui/core'

function DefaultBodyRenderer({
  checkboxes,
  checkboxKey,
  classes,
  columns,
  data,
  handleSelect,
  isLoading,
  rowKey,
  selected,
  striped,
}) {
  if (isLoading) {
    return (
      <TableBody>
        <TableRow className={classNames({ [classes.striped]: striped })}>
          <TableCell colSpan={columns.length}>
            <Loader loading fill />
          </TableCell>
        </TableRow>
      </TableBody>
    )
  }

  return (
    <TableBody>
      {data.map((row, index) => (
        <TableRow
          key={rowKey(row)}
          className={classNames({
            // Indices are zero-based, so we need to shift by one.
            [classes.stripedOdd]: striped && index % 2 === 0,
            [classes.stripedEven]: striped && index % 2 === 1,
          })}
        >
          {checkboxes && (
            <TableCell key="_checkbox" padding="checkbox">
              <Checkbox
                checked={selected && selected.has(checkboxKey(row))}
                onChange={handleSelect(checkboxKey(row))}
              />
            </TableCell>
          )}
          {columns.map(({ render, title, renderFooter, ...cellProps }) => (
            <TableCell {...cellProps}>{render(row)}</TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  )
}

export default DefaultBodyRenderer
