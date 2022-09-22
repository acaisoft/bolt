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

import { ListItemIcon, ListItemText, MenuItem } from '@material-ui/core'
import { ExitToApp, ExpandMore } from '@material-ui/icons'
import React from 'react'
import { PopoverMenu, Button } from 'components'
import UserAvatar from '../UserAvatar'
import useStyles from './UserMenu.styles'
import { useAuth0 } from '@auth0/auth0-react'
import { AUTH_TOKEN_NAME } from 'config/constants'

function UserMenu() {
  const classes = useStyles()
  const { user, logout } = useAuth0()
  return (
    <div>
      <PopoverMenu
        id="user-menu"
        closeOnClick
        trigger={
          <Button
            data-testid="user-menu-button"
            aria-label="User Menu"
            color="inherit"
          >
            <UserAvatar avatar={user.picture} />
            <span className={classes.userName}>{user.nickname}</span>
            <ExpandMore className={classes.expandIcon} />
          </Button>
        }
        MenuProps={{
          getContentAnchorEl: null, // Required to be able to set anchorOrigin.vertical
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        }}
      >
        <MenuItem
          onClick={() => {
            localStorage.removeItem(AUTH_TOKEN_NAME)
            logout()
          }}
        >
          <ListItemIcon>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </PopoverMenu>
    </div>
  )
}

export default UserMenu
