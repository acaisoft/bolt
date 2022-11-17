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

import React, { useEffect, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { FormHelperText } from '@material-ui/core'
import { CircularProgress } from '@material-ui/core'
import { TestRunStageStatus } from 'config/constants'
import { useMutationWithState, useNotification, useDidUpdateEffect } from 'hooks'
import { Button } from 'components'
import { GENERATE_EXECUTION_REPORT_MUTATION } from './graphql'
import {
  useReportState,
  getInfoText,
  getButtonText,
  downloadReport,
} from './GenerateReportButton.utils'
import useStyles from './GenerateReportButton.styles'

const loadingIcon = props => (
  <CircularProgress
    data-testid="loader"
    color="inherit"
    variant="indeterminate"
    size={15}
    {...props}
  />
)

function GenerateReportButton({ testStatus, reportGenerationStatus }) {
  const classes = useStyles()
  const { executionId } = useParams()
  const notify = useNotification()

  const [processClick, setProcessClick] = useState(false)
  const reportState = useReportState({ testStatus, reportGenerationStatus })
  const { disabled, isReportGenerating } = reportState

  const {
    error,
    loading,
    mutation: generateReportMutation,
  } = useMutationWithState(GENERATE_EXECUTION_REPORT_MUTATION, {
    variables: {
      executionId,
    },
  })

  useEffect(() => {
    if (!error) return
    notify.error(error)
  }, [notify, error])

  useDidUpdateEffect(() => {
    setProcessClick(false)
  })

  async function handleClick() {
    try {
      let data = await generateReportMutation()
      let url = data.response.data.testrun_get_report.data
      if (typeof url === 'string' && url.startsWith('http')) {
        downloadReport(url)
        setProcessClick(false)
      } else {
        setProcessClick(true)
      }
    } catch (e) {
      notify.error(e.message)
      setProcessClick(false)
    }
  }

  const infoText = useMemo(
    () => getInfoText({ reportGenerationStatus, processClick, ...reportState }),
    [processClick, reportGenerationStatus]
  )

  return (
    <div className={classes.wrapper} style={{ ...(infoText && { marginTop: 24 }) }}>
      <Button
        color="secondary"
        variant="contained"
        disabled={disabled || loading || processClick}
        icon={processClick || isReportGenerating ? loadingIcon : undefined}
        onClick={handleClick}
      >
        {getButtonText(reportGenerationStatus, processClick)}
      </Button>

      <FormHelperText>{infoText}</FormHelperText>
    </div>
  )
}

GenerateReportButton.propTypes = {
  testStatus: PropTypes.oneOf(Object.values(TestRunStageStatus)).isRequired,
  reportGenerationStatus: PropTypes.string.isRequired,
}

export default GenerateReportButton
