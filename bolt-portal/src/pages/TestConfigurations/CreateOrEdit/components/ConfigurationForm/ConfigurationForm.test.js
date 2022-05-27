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
import { Route, Routes } from 'react-router-dom'
import { screen, waitFor, render, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import routes from 'config/routes'
import { getUrl } from 'utils/router'
import { customRender } from 'utils/tests/mocks'
import { getByRoleAndName } from 'utils/tests'
import ConfigurationForm from './ConfigurationForm'
import { testsPerformedMessage } from './ConfigurationForm.utils'
import {
  configurationTypesMock,
  testParametersMock,
  testSourcesMock,
  testConfigurationPerformedMock,
  testConfigurationNotPerformedMock,
  projectId,
  configurationId,
  testConfigurationBase,
  getParameterLabel,
} from './ConfigurationForm.mocks'

jest.unmock('@material-ui/core')
jest.unmock('@material-ui/icons')

// getting rid of material-ui warnings
console.warn = jest.fn()

const renderWithEditRoute = mocks => ({
  user: userEvent.setup(),
  ...render(
    customRender(
      <Routes>
        <Route
          path={routes.projects.configurations.edit}
          element={<ConfigurationForm />}
        />
      </Routes>,
      [testSourcesMock, testParametersMock, configurationTypesMock, ...mocks],
      [getUrl(routes.projects.configurations.edit, { projectId, configurationId })]
    )
  ),
})

async function loadData() {
  await waitFor(() => {
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })
}

// TODO: uncomment when scenario parts section will be needed
// function checkCheckboxValue(name, value) {
//   if (value) {
//     expect(getByRoleAndName('checkbox', name)).toBeChecked()
//     return
//   }
//
//   expect(getByRoleAndName('checkbox', name)).not.toBeChecked()
// }

function checkInputValue(inputName, value) {
  const input = document.querySelector(`input[name="${inputName}"]`)
  expect(input).toHaveValue(value)
}

describe('component: ConfigurationForm', () => {
  it('should display a loader before fetching any data', () => {
    render(customRender(<ConfigurationForm />))

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('should display only load tests options by default', async () => {
    render(
      customRender(<ConfigurationForm />, [
        testSourcesMock,
        testParametersMock,
        configurationTypesMock,
      ])
    )

    await loadData()

    // all monitoring options
    expect(screen.queryByText('monitoring interval')).not.toBeInTheDocument()
    expect(screen.queryByText('monitoring duration')).not.toBeInTheDocument()

    // all load tests options
    expect(screen.getByText('time')).toBeInTheDocument()
    expect(screen.getByText('users/second')).toBeInTheDocument()
    expect(screen.getByText('users')).toBeInTheDocument()
    expect(screen.getByText('host')).toBeInTheDocument()
  })

  // TODO: unskip when scenario parts section will be needed
  it.skip('should not allow unchecking load tests checkbox', async () => {
    render(
      customRender(<ConfigurationForm />, [
        testSourcesMock,
        testParametersMock,
        configurationTypesMock,
      ])
    )

    await loadData()

    expect(getByRoleAndName('checkbox', 'Load Tests')).toBeChecked()
    expect(getByRoleAndName('checkbox', 'Load Tests')).toBeDisabled()
  })

  // TODO: unskip when scenario parts section will be needed
  it.skip('should display all monitoring options when monitoring checkbox is checked', async () => {
    const user = userEvent.setup()
    render(
      customRender(<ConfigurationForm />, [
        testSourcesMock,
        testParametersMock,
        configurationTypesMock,
      ])
    )

    await loadData()

    await user.click(getByRoleAndName('checkbox', 'Monitoring'))

    expect(screen.getByText('monitoring interval')).toBeInTheDocument()
    expect(screen.getByText('monitoring duration')).toBeInTheDocument()
  })

  // TODO: unskip when scenario parts section will be needed
  it.skip('should display all monitoring and load tests options when both checkboxes are checked', async () => {
    const user = userEvent.setup()
    render(
      customRender(<ConfigurationForm />, [
        testSourcesMock,
        testParametersMock,
        configurationTypesMock,
      ])
    )

    await loadData()

    await user.click(getByRoleAndName('checkbox', 'Monitoring'))

    expect(screen.getByText('time')).toBeInTheDocument()
    expect(screen.getByText('users/second')).toBeInTheDocument()
    expect(screen.getByText('users')).toBeInTheDocument()
    expect(screen.getByText('host')).toBeInTheDocument()

    expect(screen.getByText('monitoring interval')).toBeInTheDocument()
    expect(screen.getByText('monitoring duration')).toBeInTheDocument()
  })

  it('should display repo branch and file path params in test source section', async () => {
    render(
      customRender(<ConfigurationForm />, [
        testSourcesMock,
        testParametersMock,
        configurationTypesMock,
      ])
    )

    await loadData()

    expect(screen.getByLabelText('Test Source panel')).toBeInTheDocument()
    const testSourcePanel = document.querySelector(
      '[aria-label="Test Source panel"]'
    )

    expect(
      within(testSourcePanel).getByLabelText('Repository Branch')
    ).toBeInTheDocument()
    expect(within(testSourcePanel).getByLabelText('File Name')).toBeInTheDocument()
  })

  it('should populate whole form in edit mode', async () => {
    renderWithEditRoute([testConfigurationPerformedMock])

    await loadData()

    const {
      name,
      configuration_parameters,
      configuration_envvars,
      test_source: { source_type, id },
      type_slug,
    } = testConfigurationBase.configuration

    // scenario section
    expect(getByRoleAndName('textbox', 'Name', { noRegex: true })).toHaveValue(name)
    checkInputValue('configuration_type', type_slug)

    // scenario parts section
    // TODO: uncomment when scenario parts section will be needed
    // checkCheckboxValue('Before scenario', has_pre_test)
    // checkCheckboxValue('After Scenario', has_post_test)
    // checkCheckboxValue('Load Tests', has_load_tests)
    // checkCheckboxValue('Monitoring', has_monitoring)

    // test parameters and test source sections
    configuration_parameters.forEach(({ parameter_slug, value }) => {
      const label = getParameterLabel(parameter_slug)
      expect(screen.getByLabelText(new RegExp(`^${label}$`, 'i'))).toHaveValue(value)
    })
    checkInputValue('test_source_type', source_type)
    checkInputValue('test_source.repository', id)

    // env variables section
    configuration_envvars.forEach(({ name, value }, i) => {
      checkInputValue(`configuration_envvars[${i}].name`, name)
      checkInputValue(`configuration_envvars[${i}].value`, value)
    })
  })

  it('should not enable repo options editing when tests has been performed using this scenario', async () => {
    renderWithEditRoute([testConfigurationPerformedMock])

    await loadData()

    expect(screen.getByText(testsPerformedMessage)).toBeInTheDocument()
    expect(getByRoleAndName('button', 'Select Repository')).toHaveAttribute(
      'aria-disabled',
      'true'
    )
    expect(screen.getByLabelText('Repository Branch')).toBeDisabled()
    expect(screen.getByLabelText('File Name')).toBeDisabled()
  })

  it('should enable repo options editing when tests has not been performed using this scenario', async () => {
    renderWithEditRoute([testConfigurationNotPerformedMock])

    await loadData()

    expect(screen.queryByText(testsPerformedMessage)).not.toBeInTheDocument()
    expect(getByRoleAndName('button', 'Select Repository')).not.toHaveAttribute(
      'aria-disabled'
    )
    expect(screen.getByLabelText('Repository Branch')).not.toBeDisabled()
    expect(screen.getByLabelText('File Name')).not.toBeDisabled()
  })

  it('should not keep update button disabled when empty env variable field was added', async () => {
    const { user } = renderWithEditRoute([testConfigurationNotPerformedMock])

    await loadData()

    expect(getByRoleAndName('button', 'Update')).toBeDisabled()
    await user.click(getByRoleAndName('button', 'Add a variable'))
    expect(getByRoleAndName('button', 'Update')).not.toBeDisabled()
  })
})
