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

import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TestRunStageStatus } from 'config/constants'
import { getByRoleAndName } from 'utils/tests'
import { customRender } from 'utils/tests/mocks'
import GenerateReportButton from './GenerateReportButton'
import {
  REPORT_GENERATION_STATUS,
  downloadReport,
} from './GenerateReportButton.utils'

const mockUrl =
  'https://storage.googleapis.com/tf-acai-bolt-rh/reports/testreport.pdf'

jest.unmock('@material-ui/core')
jest.unmock('@material-ui/icons')

jest.mock('./GenerateReportButton.utils', () => ({
  ...jest.requireActual('./GenerateReportButton.utils'),
  downloadReport: jest.fn(),
}))

describe('component: GenerateReportButton', () => {
  describe('test state: finished', () => {
    it('should display generate report button when report was not generated before', () => {
      customRender(
        <GenerateReportButton
          testStatus={TestRunStageStatus.FINISHED}
          reportGenerationStatus={REPORT_GENERATION_STATUS.NOT_GENERATED}
        />
      )

      expect(screen.getByRole('button')).not.toBeDisabled()
      expect(screen.getByRole('button')).toHaveTextContent('Generate report')
    })

    it('should not trigger report download on button click when report is not generated (it should only trigger its generation)', async () => {
      const user = userEvent.setup()
      customRender(
        <GenerateReportButton
          testStatus={TestRunStageStatus.FINISHED}
          reportGenerationStatus={REPORT_GENERATION_STATUS.NOT_GENERATED}
        />
      )

      await user.click(getByRoleAndName('button', 'Generate report'))
      expect(downloadReport).not.toHaveBeenCalled()
    })

    it('should disable button when it is waiting for report generation', () => {
      customRender(
        <GenerateReportButton
          testStatus={TestRunStageStatus.FINISHED}
          reportGenerationStatus={REPORT_GENERATION_STATUS.GENERATING}
        />
      )

      expect(screen.getByRole('button')).toBeDisabled()
      expect(screen.getByRole('button')).toHaveTextContent('Generating report...')
    })

    it('should show info text about report generation process when it is waiting for report generation', () => {
      customRender(
        <GenerateReportButton
          testStatus={TestRunStageStatus.FINISHED}
          reportGenerationStatus={REPORT_GENERATION_STATUS.GENERATING}
        />
      )

      expect(
        screen.getByText(
          'We started preparing your report, we will inform you when it’s done'
        )
      ).toBeInTheDocument()
    })

    it('should display download report button when report was already generated', () => {
      customRender(
        <GenerateReportButton
          testStatus={TestRunStageStatus.FINISHED}
          reportGenerationStatus={mockUrl}
        />
      )

      expect(screen.getByRole('button')).not.toBeDisabled()
      expect(screen.getByRole('button')).toHaveTextContent('Download report')
    })

    it('should download report pdf on button click when report was already generated', async () => {
      const user = userEvent.setup()
      customRender(
        <GenerateReportButton
          testStatus={TestRunStageStatus.FINISHED}
          reportGenerationStatus={mockUrl}
        />
      )

      await user.click(getByRoleAndName('button', 'Download report'))
      expect(downloadReport).toHaveBeenCalledTimes(1)
    })
  })

  describe('test state: running', () => {
    it('should disable button when test is running', () => {
      customRender(
        <GenerateReportButton
          testStatus={TestRunStageStatus.RUNNING}
          reportGenerationStatus={REPORT_GENERATION_STATUS.NOT_GENERATED}
        />
      )
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('should display info text about generating report for running test', () => {
      customRender(
        <GenerateReportButton
          testStatus={TestRunStageStatus.RUNNING}
          reportGenerationStatus={REPORT_GENERATION_STATUS.NOT_GENERATED}
        />
      )
      expect(
        screen.getByText("You can't generate a report for not finished test")
      ).toBeInTheDocument()
    })
  })

  describe('test state: failed', () => {
    it('should disable button when test failed', () => {
      customRender(
        <GenerateReportButton
          testStatus={TestRunStageStatus.FAILED}
          reportGenerationStatus={REPORT_GENERATION_STATUS.NOT_GENERATED}
        />
      )
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('should display info text about generating report for failed test', () => {
      customRender(
        <GenerateReportButton
          testStatus={TestRunStageStatus.FAILED}
          reportGenerationStatus={REPORT_GENERATION_STATUS.NOT_GENERATED}
        />
      )
      expect(
        screen.getByText("You can't generate a report for failed test")
      ).toBeInTheDocument()
    })
  })

  describe('test state: terminated', () => {
    it('should disable button when test was terminated', () => {
      customRender(
        <GenerateReportButton
          testStatus={TestRunStageStatus.TERMINATED}
          reportGenerationStatus={REPORT_GENERATION_STATUS.NOT_GENERATED}
        />
      )
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('should display info text about generating report for terminated test', () => {
      customRender(
        <GenerateReportButton
          testStatus={TestRunStageStatus.TERMINATED}
          reportGenerationStatus={REPORT_GENERATION_STATUS.NOT_GENERATED}
        />
      )
      expect(
        screen.getByText("You can't generate a report for terminated test")
      ).toBeInTheDocument()
    })
  })
})
