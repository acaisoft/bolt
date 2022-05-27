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

import { Menu } from '@material-ui/core'
import { useMenu } from 'hooks'

const noop = () => {}

function PopoverMenu({
  children,
  closeOnClick = false,
  id,
  onClose = noop,
  onOpen = noop,
  trigger,
  MenuProps,
}) {
  const { menuAnchorEl, isMenuOpen, handleMenuOpen, handleMenuClose } = useMenu()

  const triggerEl = React.cloneElement(trigger, {
    'aria-controls': id,
    'aria-haspopup': 'menu',
    onClick: evt => {
      handleMenuOpen(evt)
      onOpen(evt)
    },
  })

  const menuItems = React.Children.map(children, child => {
    if (!child) {
      return null
    }

    const childOnClick =
      typeof child.props.onClick === 'function' ? child.props.onClick : noop

    return React.cloneElement(child, {
      onClick: evt => {
        childOnClick(evt)
        if (closeOnClick) {
          handleMenuClose(evt)
          onClose(evt)
        }
      },
    })
  })

  return (
    <React.Fragment>
      {triggerEl}
      {isMenuOpen && (
        <Menu
          MenuListProps={{ id }}
          anchorEl={menuAnchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open
          onClose={evt => {
            handleMenuClose(evt)
            onClose(evt)
          }}
          {...MenuProps}
        >
          {menuItems}
        </Menu>
      )}
    </React.Fragment>
  )
}
PopoverMenu.propTypes = {
  children: PropTypes.node,
  closeOnClick: PropTypes.bool,
  id: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  trigger: PropTypes.element,
  MenuProps: PropTypes.object,
}

export default PopoverMenu
