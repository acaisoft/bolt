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
import { useParams } from 'react-router-dom'
import { Typography } from '@material-ui/core'

import routes from 'config/routes'
import { getUrl } from 'utils/router'

import { TestExecutionsList } from './components'

import useStyles from './List.styles'

export function List() {
  const params = useParams()
  const { projectId } = params

  const classes = useStyles()

  const getExecutionDetailsUrl = useCallback(
    execution => {
      return getUrl(routes.projects.configurations.executions.details, {
        ...params,
        configurationId: execution.configuration.id,
        executionId: execution.id,
      })
    },
    [params]
  )

  return (
    <div className={classes.root}>
      <Typography variant="body2">
        Here you see results of all tests performed in all of your projects
      </Typography>
      <div className={classes.tableContainer}>
        <TestExecutionsList
          projectId={projectId}
          getExecutionDetailsUrl={getExecutionDetailsUrl}
        />
      </div>
    </div>
  )
}

export default List
