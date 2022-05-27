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
import PropTypes from 'prop-types'

import { IconButton, MenuItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { MoreVert, FileCopyOutlined, Edit, Delete } from '@material-ui/icons'
import { PopoverMenu, SubmitCancelModal } from 'components'
import { useNotification } from 'hooks'

import { useConfigurationClone, useConfigurationDelete } from '../../../hooks'
import { Link } from 'react-router-dom'
import { useToggle } from 'hooks'
import _ from 'lodash'

function ConfigurationActionsMenu({ configuration, editUrl, onClone }) {
  const isPerformed = Boolean(configuration.performed)

  const [isDeleteModalOpen, toggleDeleteModal] = useToggle(false)

  const { onDelete } = useHandlers()

  const { loading: isCloning, mutation: cloneConfiguration } = useConfigurationClone(
    configuration.id
  )

  const handleCloneSubmit = useCallback(async () => {
    const { errorMessage, response } = await cloneConfiguration()
    const result = _.get(
      response,
      'data.testrun_configuration_clone.returning[0].new_configuration_id',
      null
    )
    onClone(errorMessage, result)
  }, [cloneConfiguration, onClone])

  const { loading: isDeleting, mutation: deleteConfiguration } =
    useConfigurationDelete(configuration.id)

  const handleDeleteSubmit = useCallback(async () => {
    const { errorMessage } = await deleteConfiguration()
    toggleDeleteModal(false)
    onDelete(errorMessage)
  }, [deleteConfiguration, toggleDeleteModal, onDelete])

  return (
    <React.Fragment>
      <PopoverMenu
        id={configuration.id}
        closeOnClick
        trigger={
          <IconButton>
            <MoreVert />
          </IconButton>
        }
      >
        <MenuItem title="Edit" to={`${editUrl}?from=list`} component={Link}>
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => handleCloneSubmit(configuration.id)}
          title="Clone"
          disabled={isCloning}
        >
          <ListItemIcon>
            <FileCopyOutlined />
          </ListItemIcon>
          <ListItemText>Clone</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => toggleDeleteModal(true)}
          title="Delete"
          disabled={isPerformed || isDeleting}
        >
          <ListItemIcon>
            <Delete />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </PopoverMenu>
      <SubmitCancelModal
        isOpen={isDeleteModalOpen}
        onClose={() => toggleDeleteModal(false)}
        onSubmit={handleDeleteSubmit}
        submitLabel="Delete"
      >
        Are you sure you want to delete test configuration{' '}
        <q>{configuration.name}</q>?
      </SubmitCancelModal>
    </React.Fragment>
  )
}

function useHandlers() {
  const notify = useNotification()

  const onDelete = useCallback(
    error => {
      if (error) {
        notify.error(error)
      } else {
        notify.success(`Configuration has been deleted.`)
      }
    },
    [notify]
  )

  return { onDelete }
}

ConfigurationActionsMenu.propTypes = {
  configuration: PropTypes.object,
  editUrl: PropTypes.string,
}

export default ConfigurationActionsMenu
