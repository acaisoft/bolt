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

import { useCallback, useState, useMemo } from 'react'

const useListFilters = (initialValues = {}) => {
  const initialState = useMemo(() => {
    return {
      pagination: {
        rowsPerPage: 10,
        offset: 0,
        ...initialValues.pagination,
      },
      orderBy: initialValues.orderBy,
      filters: initialValues.filters,
    }
  }, [initialValues])

  const [rowsPerPage, setRowsPerPage] = useState(initialState.pagination.rowsPerPage)
  const [offset, setOffset] = useState(initialState.pagination.offset)
  const [orderBy, setOrderBy] = useState(initialState.orderBy)
  const [filters, setFilters] = useState(initialState.filters)

  const setPagination = useCallback(nextPagination => {
    setRowsPerPage(nextPagination.rowsPerPage)
    setOffset(nextPagination.offset)
  }, [])
  const setFilter = useCallback((key, value) => {
    setFilters(prevFilters => ({ ...prevFilters, [key]: value }))
  }, [])

  return {
    pagination: {
      rowsPerPage,
      offset,
    },
    orderBy,
    filters,

    setPagination,
    setOrderBy,
    setFilters,
    setFilter,
  }
}

export default useListFilters
