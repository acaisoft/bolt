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

import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  ClickAwayListener,
  Paper,
  IconButton,
  MenuList,
  MenuItem,
  Backdrop,
} from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { NavLink } from 'components'
import { Dashboard, TestRun, TestConfiguration, TestSource } from 'assets/icons'
import routes from 'config/routes'
import { getUrl } from 'utils/router'
import logo from 'assets/images/bolt-logo.png'

import useStyles from './SideMenu.styles'

function SideMenu({ isOpen, onClose, projectId }) {
  const classes = useStyles()

  const items = useMemo(() => {
    if (!projectId) {
      return []
    }

    return [
      {
        label: 'Dashboard',
        linkTo: getUrl(routes.projects.list),
        icon: Dashboard,
        end: true,
      },
      {
        label: 'Test Runs',
        linkTo: getUrl(routes.projects.executions.list, { projectId }),
        icon: TestRun,
        end: false,
      },
      {
        label: 'Test Scenarios',
        linkTo: getUrl(routes.projects.configurations.list, { projectId }),
        icon: TestConfiguration,
        end: false,
      },
      {
        label: 'Test Sources',
        linkTo: getUrl(routes.projects.sources.list, { projectId }),
        icon: TestSource,
        end: false,
      },
    ]
  }, [projectId])

  if (!isOpen) {
    return null
  }

  return (
    <div className={classes.root} id="project-menu">
      <Backdrop open={isOpen} />
      <ClickAwayListener onClickAway={onClose}>
        <Paper className={classes.paper}>
          <div className={classes.header}>
            <IconButton className={classes.button} onClick={onClose}>
              <Close />
            </IconButton>

            <div className={classes.title}>
              <img src={logo} alt="logo" className={classes.logo} />
            </div>
          </div>
          <MenuList component="div" className={classes.menu}>
            {items.map(item => (
              <MenuItem
                key={item.linkTo}
                component={NavLink}
                to={item.linkTo}
                end={item.end}
                activeClassName={classes.itemSelected}
                className={classes.item}
                onClick={onClose}
              >
                <item.icon className={classes.icon} fontSize="inherit" />
                {item.label}
              </MenuItem>
            ))}
          </MenuList>
        </Paper>
      </ClickAwayListener>
    </div>
  )
}
SideMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default SideMenu
