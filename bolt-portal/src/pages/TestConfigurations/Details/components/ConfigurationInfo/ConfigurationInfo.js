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
import _ from 'lodash'
import { Tooltip, IconButton, MenuItem, Typography } from '@material-ui/core'
import {
  PlayArrow,
  MoreVert,
  Delete,
  Edit,
  FileCopyOutlined,
} from '@material-ui/icons'
import {
  SectionHeader,
  SubmitCancelModal,
  Button,
  ExpandablePanel,
  PopoverMenu,
  TestConfigurationDetails,
} from 'components'
import { useToggle } from 'hooks'
import {
  useConfigurationRun,
  useConfigurationDelete,
  useConfigurationClone,
} from 'pages/TestConfigurations/hooks'
import useStyles from './ConfigurationInfo.styles'

export function ConfigurationInfo({
  configuration,
  onEdit = () => {},
  onClone = () => {},
  onDelete = () => {},
  onRun = () => {},
}) {
  const classes = useStyles()
  const [isDeleteModalOpen, toggleDeleteModal] = useToggle(false)

  const { loading: isStartingRun, mutation: runConfiguration } = useConfigurationRun(
    configuration.id
  )
  const { loading: isDeleting, mutation: deleteConfiguration } =
    useConfigurationDelete(configuration.id)

  const { loading: isCloning, mutation: cloneConfiguration } = useConfigurationClone(
    configuration.id
  )

  const handleClone = useCallback(async () => {
    const { errorMessage, response } = await cloneConfiguration()
    const result = _.get(
      response,
      'data.testrun_configuration_clone.returning[0].new_configuration_id',
      null
    )

    onClone(errorMessage, result)
  }, [cloneConfiguration, onClone])

  const handleRun = useCallback(
    async ({ coldStart = false }) => {
      const { errorMessage } = await runConfiguration({
        variables: { coldStart, configurationId: configuration.id },
      })
      onRun(errorMessage)
    },
    [runConfiguration, configuration.id, onRun]
  )

  const handleDeleteSubmit = useCallback(async () => {
    const { errorMessage } = await deleteConfiguration()
    toggleDeleteModal(false)
    onDelete(errorMessage)
  }, [deleteConfiguration, onDelete, toggleDeleteModal])

  const { test_source, configuration_type, name, performed } = configuration

  const isPerformed = Boolean(performed)
  const canRun = Boolean(test_source)
  return (
    <React.Fragment>
      <SectionHeader title={name} description={(configuration_type || {}).name}>
        <Tooltip
          title={
            !canRun
              ? 'You need to assign a test source before you will be able to start a test.'
              : ''
          }
        >
          <span>
            <Button
              variant="contained"
              color="primary"
              icon={PlayArrow}
              disabled={isStartingRun || !canRun}
              onClick={() => handleRun({ coldStart: false })}
              aria-label="Run"
            >
              Run
            </Button>

            <PopoverMenu
              id="config-more-options"
              closeOnClick
              trigger={
                <IconButton
                  className={classes.buttonMargin}
                  aria-label="Scenario Actions Menu"
                >
                  <MoreVert />
                </IconButton>
              }
            >
              <MenuItem onClick={() => handleRun({ coldStart: true })}>
                Cold Run
              </MenuItem>
            </PopoverMenu>
          </span>
        </Tooltip>
      </SectionHeader>

      <ExpandablePanel defaultExpanded={false} title="Scenario Details">
        <TestConfigurationDetails configuration={configuration}>
          <Button icon={Edit} variant="outlined" color="default" onClick={onEdit}>
            <Typography variant="body2">Edit</Typography>
          </Button>
          <Button
            icon={FileCopyOutlined}
            variant="outlined"
            color="default"
            disabled={isCloning}
            onClick={() => handleClone(configuration.id)}
          >
            <Typography variant="body2">Clone</Typography>
          </Button>

          <Tooltip
            title={isPerformed ? "You can't delete a performed scenario." : ''}
          >
            <span>
              <Button
                icon={Delete}
                aria-label="Delete scenario"
                variant="outlined"
                color="default"
                disabled={isPerformed || isDeleting}
                onClick={() => toggleDeleteModal(true)}
              >
                <Typography variant="body2">Delete</Typography>
              </Button>
            </span>
          </Tooltip>
        </TestConfigurationDetails>
      </ExpandablePanel>

      <SubmitCancelModal
        isOpen={isDeleteModalOpen}
        onClose={() => toggleDeleteModal(false)}
        onSubmit={handleDeleteSubmit}
        submitLabel="Delete"
      >
        Are you sure you want to delete test configuration <q>{name}</q>?
      </SubmitCancelModal>
    </React.Fragment>
  )
}
ConfigurationInfo.propTypes = {
  configuration: PropTypes.object.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onRun: PropTypes.func,
}

export default ConfigurationInfo
