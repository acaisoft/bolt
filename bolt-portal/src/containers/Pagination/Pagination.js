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

import { TablePagination } from '@material-ui/core'

const offsetToPage = (offset, rowsPerPage) => parseInt(offset / rowsPerPage, 10)
const pageToOffset = (page, rowsPerPage) => page * rowsPerPage

function Pagination({
  offset = 0,
  onChange = () => {},
  rowsPerPage = 10,
  rowsPerPageOptions = [5, 10, 25],
  totalCount,
}) {
  const page = offsetToPage(offset, rowsPerPage)

  return (
    <TablePagination
      component="div"
      rowsPerPageOptions={rowsPerPageOptions}
      rowsPerPage={rowsPerPage}
      count={totalCount}
      page={page}
      onPageChange={(e, newPage) => {
        onChange({
          page: newPage,
          offset: pageToOffset(newPage, rowsPerPage),
          rowsPerPage,
        })
      }}
      onRowsPerPageChange={e => {
        onChange({
          page: 0,
          offset: 0,
          rowsPerPage: e.target.value,
        })
      }}
    />
  )
}
Pagination.propTypes = {
  onChange: PropTypes.func,
  offset: PropTypes.number,
  rowsPerPage: PropTypes.number,
  totalCount: PropTypes.number,
}

export default Pagination
