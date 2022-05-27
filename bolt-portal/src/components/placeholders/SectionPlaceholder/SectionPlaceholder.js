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
import { Typography } from '@material-ui/core'

import useStyles from './SectionPlaceholder.styles'

export function SectionPlaceholder({
  actions,
  description,
  title,
  height = '100%',
  topImage,
  icon,
}) {
  const classes = useStyles()

  return (
    <div className={classes.root} style={{ height }} data-testid="placeholder-root">
      {topImage && (
        <div className={classes.topImage} data-testid="top-image-container">
          {topImage}
        </div>
      )}

      <div className={classes.content}>
        <div className={classes.titleHolder}>
          {icon && (
            <div
              className={classes.variantIcon}
              data-testid="variant-icon-container"
            >
              {icon}
            </div>
          )}

          <Typography
            className={classes.title}
            variant="h6"
            component="h2"
            align="center"
          >
            {title}
          </Typography>
        </div>

        {description && (
          <Typography className={classes.description} variant="body2" align="center">
            {description}
          </Typography>
        )}
      </div>

      {actions && <div className={classes.actions}>{actions}</div>}
    </div>
  )
}

SectionPlaceholder.propTypes = {
  actions: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  description: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  topImage: PropTypes.node,
}

export default SectionPlaceholder
