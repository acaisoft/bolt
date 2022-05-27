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
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'

import { Box } from '@material-ui/core'
import {
  NotFoundPlaceholder,
  LoadingPlaceholder,
  ErrorPlaceholder,
} from 'components'
import { useNotification } from 'hooks'
import routes from 'config/routes'
import { getUrl } from 'utils/router'

import { ConfigurationInfo, TestExecutionsList } from './components'
import { GET_CONFIGURATION } from './graphql'
import useStyles from './Details.styles'

function Details() {
  const navigate = useNavigate()
  const params = useParams()
  const { configurationId } = params
  const classes = useStyles()

  const { getMonitoringDetailsUrl, getTestDetailsUrl, getDebugUrl } =
    useUrlGetters(params)
  const { handleEdit, handleDelete, handleRun, handleTerminate, handleClone } =
    useHandlers(navigate, params)

  const { loading, data, error } = useQuery(GET_CONFIGURATION, {
    variables: { configurationId },
    fetchPolicy: 'cache-and-network',
  })

  if (loading || error || !data?.configuration) {
    return (
      <Box p={3}>
        {loading ? (
          <LoadingPlaceholder title="Loading scenario..." />
        ) : error ? (
          <ErrorPlaceholder error={error} />
        ) : (
          <NotFoundPlaceholder title="Scenario not found" />
        )}
      </Box>
    )
  }

  const { configuration } = data
  return (
    <div className={classes.root}>
      <ConfigurationInfo
        configuration={configuration}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onRun={handleRun}
        onClone={handleClone}
      />
      <div className={classes.tableContainer}>
        <TestExecutionsList
          configuration={configuration}
          getTestDetailsUrl={getTestDetailsUrl}
          getMonitoringDetailsUrl={getMonitoringDetailsUrl}
          getDebugUrl={getDebugUrl}
          onTerminate={handleTerminate}
          hasMonitoring={configuration.has_monitoring}
        />
      </div>
    </div>
  )
}

function useUrlGetters(params) {
  const getTestDetailsUrl = useCallback(
    execution => {
      return getUrl(routes.projects.configurations.executions.details, {
        ...params,
        executionId: execution.id,
      })
    },
    [params]
  )
  const getMonitoringDetailsUrl = useCallback(
    execution => {
      return getUrl(routes.projects.configurations.executions.monitoring, {
        ...params,
        executionId: execution.id,
      })
    },
    [params]
  )
  const getDebugUrl = useCallback(execution => {
    return getUrl(routes.argo.workflows.details, {
      argo_name: execution.argo_name,
    })
  }, [])

  return {
    getTestDetailsUrl,
    getMonitoringDetailsUrl,
    getDebugUrl,
  }
}

function useHandlers(navigate, params) {
  const handleEdit = useCallback(() => {
    navigate(getUrl(routes.projects.configurations.edit, params))
  }, [navigate, params])

  const notify = useNotification()

  const handleDelete = useCallback(
    error => {
      if (error) {
        notify.error(error)
      } else {
        notify.success('Configuration has been deleted.')
        navigate(getUrl(routes.projects.configurations.list, params))
      }
    },
    [navigate, notify, params]
  )

  const handleClone = useCallback(
    (error, newConfigurationId) => {
      if (error) {
        notify.error(`Could not clone: ${error}`)
      } else {
        notify.success(`Scenario has been cloned.`)
        navigate(
          getUrl(routes.projects.configurations.edit, {
            projectId: params.projectId,
            configurationId: newConfigurationId,
          })
        )
      }
    },
    [notify, navigate, params]
  )

  const handleRun = useCallback(
    error => {
      if (error) {
        notify.error(`Could not start: ${error}`)
      } else {
        notify.success('Configuration has been started.')
      }
    },
    [notify]
  )

  const handleTerminate = useCallback(
    ({ error, ok }) => {
      if (!ok) {
        notify.error(`Could not terminate: ${error}`)
      } else {
        notify.success(`Test run has been terminated.`)
      }
    },
    [notify]
  )

  return { handleEdit, handleDelete, handleRun, handleTerminate, handleClone }
}

export default Details
