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

import React, { useCallback } from 'react'

import { IconButton, MenuItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { MoreVert } from '@material-ui/icons'
import { PopoverMenu } from 'components'
import { Debug, Terminate } from 'assets/icons'
import { useNotification } from 'hooks'

import routes from 'config/routes'
import { TestRunStatus as TestRunStatusEnum } from 'config/constants'
import { getUrl } from 'utils/router'

import { useExecutionTerminate } from '../../hooks'

function ExecutionActionsMenu({ execution }) {
  const notify = useNotification()

  const getExecutionDebugUrl = useCallback(execution => {
    return getUrl(routes.argo.workflows.details, { argo_name: execution.argo_name })
  }, [])

  const handleExecutionTerminate = useCallback(
    ({ error, ok }) => {
      if (!ok) {
        notify.error(`Could not terminate: ${error}`)
      } else {
        notify.success(`Test run has been terminated.`)
      }
    },
    [notify]
  )

  const terminateExecution = useExecutionTerminate({
    onTerminate: handleExecutionTerminate,
  })

  return (
    <PopoverMenu
      data-testid="ExecutionActions"
      id={execution.id}
      closeOnClick
      trigger={
        <IconButton>
          <MoreVert />
        </IconButton>
      }
    >
      {execution.argo_name && (
        <MenuItem
          component="a"
          href={getExecutionDebugUrl(execution)}
          title="View test run in Argo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ListItemIcon>
            <Debug />
          </ListItemIcon>
          <ListItemText>Debug</ListItemText>
        </MenuItem>
      )}
      <MenuItem
        onClick={() => terminateExecution(execution)}
        title="Terminate the test run"
        disabled={[
          TestRunStatusEnum.FINISHED,
          TestRunStatusEnum.TERMINATED,
        ].includes(execution.status)}
      >
        <ListItemIcon>
          <Terminate />
        </ListItemIcon>
        <ListItemText>Terminate</ListItemText>
      </MenuItem>
    </PopoverMenu>
  )
}

export default ExecutionActionsMenu
