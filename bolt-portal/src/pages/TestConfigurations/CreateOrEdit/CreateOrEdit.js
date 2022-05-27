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
import { useNavigate, useParams, useLocation } from 'react-router-dom'

import { ConfigurationForm } from './components'
import { getUrl } from 'utils/router'
import routes from 'config/routes'
import { useNotification } from 'hooks'

export function CreateOrEdit() {
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()
  const { configurationId } = params

  const urlParams = new URLSearchParams(location.search)
  const targetLocation = urlParams.get('from')

  const goToList = useCallback(() => {
    navigate(getUrl(routes.projects.configurations.list, { ...params }))
  }, [navigate, params])

  const goToDetails = useCallback(() => {
    navigate(getUrl(routes.projects.configurations.details, { ...params }))
  }, [navigate, params])

  const handleClose = useCallback(() => {
    if (targetLocation === 'list' || !configurationId) {
      goToList()
    } else {
      goToDetails()
    }
  }, [configurationId, goToDetails, goToList, targetLocation])

  const notify = useNotification()

  const handleSubmit = useCallback(
    ({ values, errorMessage }) => {
      if (errorMessage) {
        notify.error(errorMessage)
      } else {
        notify.success(
          `Scenario ${configurationId ? 'updated' : 'created'} successfully`
        )
        handleClose()
      }
    },
    [configurationId, notify, handleClose]
  )

  return <ConfigurationForm onCancel={handleClose} onSubmit={handleSubmit} />
}

export default CreateOrEdit
