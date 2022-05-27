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
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Button as MaterialButton } from '@material-ui/core'

import useStyles from './Button.styles'

export function Button({
  classes: overridingClasses,
  children,
  button: ButtonComponent = MaterialButton,
  icon: IconComponent,
  href,
  variant,
  ...buttonProps
}) {
  const classes = { ...useStyles(), ...overridingClasses }
  const linkButtonProps = href
    ? {
        to: href,
        component: Link,
      }
    : {}

  return (
    <ButtonComponent
      role="button"
      variant={variant === 'link' ? 'text' : variant}
      classes={{
        root: IconComponent && !children && classes.iconOnly,
        label: children && classes.label,
      }}
      className={classNames({
        [classes.link]: variant === 'link',
      })}
      {...linkButtonProps}
      {...buttonProps}
    >
      {IconComponent && <IconComponent className={classes.icon} />}
      {children}
    </ButtonComponent>
  )
}

Button.propTypes = {
  classes: PropTypes.object,
  variant: PropTypes.string,
  href: PropTypes.string,
}

export default Button
