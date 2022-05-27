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
import { TableHead, TableRow, TableCell, Checkbox } from '@material-ui/core'

function DefaultHeaderRenderer({
  columns,
  checkboxes,
  data,
  handleSelectAll,
  multiselect,
  selected,
}) {
  return (
    <TableHead>
      <TableRow>
        {checkboxes && (
          <TableCell key="_checkbox" padding="checkbox">
            {multiselect && (
              <Checkbox
                indeterminate={Boolean(selected.size) && selected.size < data.length}
                checked={selected.size === data.length}
                onChange={handleSelectAll}
              />
            )}
          </TableCell>
        )}
        {columns.map(({ key, title, width }) => (
          <TableCell key={key} width={width}>
            {title}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

export default DefaultHeaderRenderer
