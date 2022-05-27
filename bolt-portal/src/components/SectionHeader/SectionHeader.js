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
import classNames from 'classnames'

import { Grid } from '@material-ui/core'

import useStyles from './SectionHeader.styles'

function SectionHeader({
  children,
  className,
  description,
  marginBottom = false,
  size = 'medium',
  subtitle,
  title,
  ...containerProps
}) {
  const classes = useStyles()

  const gridProps = {
    alignItems: 'center',
    justifyContent: 'space-between',
    spacing: 4,
    ...containerProps,
  }

  return (
    <Grid
      data-testid="SectionHeader"
      container
      className={classNames(className, {
        [classes.marginBottom]: Boolean(marginBottom),
      })}
      {...gridProps}
    >
      <Grid item>
        <div className={classes[size]}>
          <div className={classes.titleContainer}>
            <div className={classes.title}>{title}</div>
            {subtitle && <div className={classes.subtitle}>{subtitle}</div>}
          </div>
          {description && <div className={classes.description}>{description}</div>}
        </div>
      </Grid>
      {children && (
        <Grid item className={classes.children}>
          <Grid container justifyContent="flex-end" alignItems="center">
            {children}
          </Grid>
        </Grid>
      )}
    </Grid>
  )
}
SectionHeader.propTypes = {
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  marginBottom: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
}

export default SectionHeader
