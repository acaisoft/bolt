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

import { Link as RouterLink } from 'react-router-dom'
import { Link } from '@material-ui/core'
import { ChevronRight } from '@material-ui/icons'

import useStyles from './Breadcrumbs.styles'

export function Breadcrumbs({ items = [] }) {
  const classes = useStyles()

  if (items.length === 0) {
    return null
  }

  return (
    <div className={classes.root} data-testid="Breadcrumbs">
      {items.map(({ url, label, render, key = url }, index) => (
        <React.Fragment key={key}>
          {render ? (
            render({ index })
          ) : url ? (
            <Link
              data-testid="link"
              component={RouterLink}
              color="inherit"
              to={url}
              className={classes.linkItem}
            >
              {label}
            </Link>
          ) : (
            <div data-testid="item" className={classes.textItem}>
              {label}
            </div>
          )}
          {index < items.length - 1 && (
            <ChevronRight className={classes.separator} data-testid="separator" />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export default Breadcrumbs
