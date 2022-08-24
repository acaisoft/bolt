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

import { useEffect, useState } from 'react'
import { TestRunStageStatus } from 'config/constants'

export const REPORT_GENERATION_STATUS = {
  NOT_GENERATED: 'not_generated',
  GENERATING: 'generating',
}

export function useReportState({ testStatus, reportGenerationStatus }) {
  const [isTestFinished, setIsTestFinished] = useState(false)
  const [isTestRunning, setIsTestRunning] = useState(false)
  const [isTestTerminated, setIsTestTerminated] = useState(false)
  const [isTestFailed, setIsTestFailed] = useState(false)

  useEffect(() => {
    setIsTestRunning(
      testStatus === TestRunStageStatus.RUNNING ||
        testStatus === TestRunStageStatus.PENDING
    )

    setIsTestFailed(
      testStatus === TestRunStageStatus.FAILED ||
        testStatus === TestRunStageStatus.ERROR
    )

    setIsTestTerminated(testStatus === TestRunStageStatus.TERMINATED)

    setIsTestFinished(
      testStatus === TestRunStageStatus.FINISHED ||
        testStatus === TestRunStageStatus.NOT_STARTED ||
        testStatus === TestRunStageStatus.SUCCEEDED
    )
  }, [testStatus])

  return {
    isTestRunning,
    isTestFinished,
    isTestFailed,
    isTestTerminated,
    disabled:
      isTestRunning ||
      isTestTerminated ||
      isTestFailed ||
      !isTestFinished ||
      reportGenerationStatus === REPORT_GENERATION_STATUS.GENERATING,
    isReportGenerated:
      reportGenerationStatus !== REPORT_GENERATION_STATUS.NOT_GENERATED &&
      reportGenerationStatus !== REPORT_GENERATION_STATUS.GENERATING,
    isReportGenerating:
      reportGenerationStatus === REPORT_GENERATION_STATUS.GENERATING,
  }
}

export function getInfoText({
  isTestFinished,
  isTestRunning,
  isTestFailed,
  isTestTerminated,
  reportGenerationStatus,
  processClick,
}) {
  if (isTestRunning) return "You can't generate a report for not finished test"
  if (isTestFailed) return "You can't generate a report for failed test"
  if (isTestTerminated) return "You can't generate a report for terminated test"
  if (
    (isTestFinished &&
      reportGenerationStatus === REPORT_GENERATION_STATUS.GENERATING) ||
    processClick
  )
    return 'We started preparing your report, we will inform you when it’s done'

  return ''
}

export function getButtonText(reportGenerationStatus, processClick) {
  if (reportGenerationStatus === REPORT_GENERATION_STATUS.GENERATING || processClick)
    return 'Generating report...'
  if (reportGenerationStatus === REPORT_GENERATION_STATUS.NOT_GENERATED)
    return 'Generate report'
  return 'Download report'
}

export function downloadReport(url) {
  const pdfLink = document.createElement('a')
  pdfLink.target = '_blank'
  pdfLink.href = url
  pdfLink.click()
  pdfLink.remove()
}
