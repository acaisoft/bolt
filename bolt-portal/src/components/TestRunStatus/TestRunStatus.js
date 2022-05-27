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
import classNames from 'classnames'
import { Typography, CircularProgress } from '@material-ui/core'
import { Close, Done, ArrowRightAlt, ErrorOutline } from '@material-ui/icons'

import { TestRunStatus as Status } from 'config/constants'
import { Monitor, Terminate } from 'assets/icons'

import useStyles from './TestRunStatus.style'

export const configurations = {
  [Status.PENDING]: {
    icon: props => <CircularProgress size={13} {...props} />,
    name: Status.PENDING,
    title: 'In progress',
  },
  [Status.RUNNING]: {
    icon: props => <ArrowRightAlt {...props} />,
    name: Status.RUNNING,
    title: 'Running',
  },
  [Status.FINISHED]: {
    icon: props => <Done {...props} />,
    name: Status.FINISHED,
    title: 'Finished',
  },
  [Status.SUCCEEDED]: {
    icon: props => <Done {...props} />,
    name: Status.SUCCEEDED,
    title: 'Finished',
  },
  [Status.TERMINATED]: {
    icon: props => <Terminate {...props} />,
    name: Status.TERMINATED,
    title: 'Terminated',
  },
  [Status.ERROR]: {
    icon: props => <Close {...props} />,
    name: Status.ERROR,
    title: 'Error',
  },
  [Status.FAILED]: {
    icon: props => <Close {...props} />,
    name: Status.FAILED,
    title: 'Failed',
  },
  [Status.MONITORING]: {
    icon: props => <Monitor {...props} />,
    name: Status.MONITORING,
    title: 'Monitoring',
  },
  [Status.UNKNOWN]: {
    icon: props => <ErrorOutline {...props} />,
    name: Status.UNKNOWN,
    title: 'Unknown',
  },
}

export function TestRunStatus({ status }) {
  const validatedStatus = configurations[status] ? status : Status.UNKNOWN
  const validConfiguration = configurations[validatedStatus]
  const classes = useStyles()

  const { icon: Icon, name, title } = validConfiguration
  return (
    <div className={classes.wrapper} data-testid="TestRunStatus">
      <div
        className={classNames(classes.root, classes[name])}
        data-testid="test-run-status-wrapper"
      >
        <Icon data-testid="test-run-status-icon" className={classes.icon} />
        <Typography className={classes.title} variant="body1">
          {title}
        </Typography>
      </div>
    </div>
  )
}

TestRunStatus.propTypes = {
  status: PropTypes.string,
}

export default TestRunStatus
