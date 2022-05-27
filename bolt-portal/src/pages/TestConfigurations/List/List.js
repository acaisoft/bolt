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

import { getUrl } from 'utils/router'
import routes from 'config/routes'
import { TestConfigurationsList } from './components'
import { useNotification } from 'hooks'
import useStyles from './List.styles'

export function List() {
  const navigate = useNavigate()
  const params = useParams()
  const { projectId } = params
  const classes = useStyles()

  const {
    getTestConfigurationCreateUrl,
    getTestConfigurationDetailsUrl,
    getTestConfigurationEditUrl,
    handleClone,
  } = useHandlers(navigate, params)

  return (
    <div className={classes.root}>
      <TestConfigurationsList
        projectId={projectId}
        getTestConfigurationCreateUrl={getTestConfigurationCreateUrl}
        getTestConfigurationDetailsUrl={getTestConfigurationDetailsUrl}
        getTestConfigurationEditUrl={getTestConfigurationEditUrl}
        onClone={handleClone}
      />
    </div>
  )
}

function useHandlers(navigate, params) {
  const getRedirectUrl = useCallback(
    (path, callbackParams = {}) => {
      return getUrl(path, { ...params, ...callbackParams })
    },
    [params]
  )

  const getTestConfigurationCreateUrl = useCallback(() => {
    return getRedirectUrl(routes.projects.configurations.create)
  }, [getRedirectUrl])

  const getTestConfigurationDetailsUrl = useCallback(
    configuration => {
      return getRedirectUrl(routes.projects.configurations.details, {
        configurationId: configuration.id,
      })
    },
    [getRedirectUrl]
  )

  const getTestConfigurationEditUrl = useCallback(
    configuration => {
      return getRedirectUrl(routes.projects.configurations.edit, {
        configurationId: configuration.id,
      })
    },
    [getRedirectUrl]
  )

  const notify = useNotification()

  const handleClone = useCallback(
    (error, newConfigurationId) => {
      if (error) {
        notify.error(`Could not clone: ${error}`)
      } else {
        notify.success(`Scenario has been cloned.`)
        navigate(
          getRedirectUrl(routes.projects.configurations.edit, {
            configurationId: newConfigurationId,
          })
        )
      }
    },
    [notify, navigate, getRedirectUrl]
  )

  const handleRun = useCallback(
    ({ configuration, error }) => {
      if (error) {
        notify.error(error)
      } else {
        notify.success(`Scenario '${configuration.name}' was successfully started.`)
      }
    },
    [notify]
  )

  return {
    getTestConfigurationCreateUrl,
    getTestConfigurationDetailsUrl,
    handleRun,
    getTestConfigurationEditUrl,
    handleClone,
  }
}

export default List
