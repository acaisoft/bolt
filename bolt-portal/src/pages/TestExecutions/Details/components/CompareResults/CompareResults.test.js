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
import { Routes, Route } from 'react-router-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import moment from 'moment'
import routes from 'config/routes'
import { TestRunStatus } from 'config/constants'
import { getUrl } from 'utils/router'
import { customRender } from 'utils/tests/mocks'
import { getByRoleAndName } from 'utils/tests'
import CompareResults from './CompareResults'
import {
  configurationsListMock,
  executionsListMock,
  mockedConfigurationsList,
  configurationId,
  executionId,
  projectId,
  mockedHideConfigList,
  hideConfigMock,
  mockedExecutionsList,
} from './CompareResults.mocks'
import { getFilteredConfigurations } from './CompareResults.utils'

jest.unmock('@material-ui/core')
jest.unmock('@material-ui/icons')

console.warn = jest.fn()

const renderWithRoute = (
  configsMock = configurationsListMock,
  executionsMock = executionsListMock,
  status = TestRunStatus.SUCCEEDED
) => ({
  user: userEvent.setup(),
  ...render(
    customRender(
      <Routes>
        <Route
          path={routes.projects.configurations.executions.details}
          element={<CompareResults status={status} />}
        />
      </Routes>,
      [configsMock, executionsMock],
      [
        getUrl(routes.projects.configurations.executions.details, {
          projectId,
          configurationId,
          executionId,
        }),
      ]
    )
  ),
})

async function loadForm() {
  await waitFor(() => {
    expect(screen.queryByText('Loading data to compare...')).not.toBeInTheDocument()
  })
}

async function showSelectOptions(user, name) {
  // select is opened on mouseDown event, user-events dispatches it under the hood
  await user.click(getByRoleAndName('button', name, { hidden: true }))
}

async function waitForEnabledTestRunSelect() {
  await waitFor(() => {
    expect(
      getByRoleAndName('button', 'test run', { hidden: true })
    ).not.toHaveAttribute('aria-disabled')
  })
}

async function selectScenario(user) {
  const { name } = mockedConfigurationsList.configurations[0]
  await user.click(screen.getByText(name))

  return name
}

describe('component: CompareResults', () => {
  it('should display a loader while data is loading', () => {
    render(
      customRender(<CompareResults status={TestRunStatus.SUCCEEDED} />, [
        configurationsListMock,
        executionsListMock,
      ])
    )

    expect(screen.getByText('Loading data to compare...')).toBeInTheDocument()
    expect(
      screen.queryByRole('form', {
        name: 'Compare Form',
      })
    ).not.toBeInTheDocument()
  })

  it('should display whole compare form when data are loaded', async () => {
    renderWithRoute()

    await loadForm()

    expect(getByRoleAndName('form', 'Compare Form')).toBeInTheDocument()
    expect(getByRoleAndName('button', 'Compare')).toBeInTheDocument()
    expect(screen.getByLabelText('Scenario')).toBeInTheDocument()
    expect(screen.getByLabelText('Test Run')).toBeInTheDocument()
  })

  it('test run compare button should be disabled when no scenario and test run are selected', async () => {
    renderWithRoute()

    await loadForm()

    expect(getByRoleAndName('button', 'Compare')).toBeDisabled()
  })

  it('test run select should be disabled when no scenario is selected', async () => {
    renderWithRoute()

    await loadForm()

    expect(getByRoleAndName('button', 'test run', { hidden: true })).toHaveAttribute(
      'aria-disabled',
      'true'
    )
  })

  it('should show all scenarios with test runs different than the current one in scenario select', async () => {
    const { user } = renderWithRoute()

    await loadForm()
    await showSelectOptions(user, 'scenario')

    expect(screen.getByRole('listbox')).toBeInTheDocument()

    const presentConfigs = getFilteredConfigurations(
      mockedConfigurationsList.configurations,
      executionId
    )
    const filteredOutConfigs = mockedConfigurationsList.configurations.filter(
      config => !presentConfigs.includes(config)
    )

    presentConfigs.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument()
    })
    filteredOutConfigs.forEach(({ name }) => {
      expect(screen.queryByText(name)).not.toBeInTheDocument()
    })
  })

  it('should not show current scenario in scenario select when current test run is the only one in it', async () => {
    const { user } = renderWithRoute(hideConfigMock)

    await loadForm()
    await showSelectOptions(user, 'scenario')

    const configWithCurrentExecution = mockedHideConfigList.configurations.find(
      ({ executions }) => {
        return executions.findIndex(({ id }) => id === executionId) !== -1
      }
    )

    expect(configWithCurrentExecution.executions).toHaveLength(1)
    expect(
      screen.queryByText(configWithCurrentExecution.name)
    ).not.toBeInTheDocument()
  })

  it('test run select should not be disabled when scenario is selected', async () => {
    const { user } = renderWithRoute()

    await loadForm()
    await showSelectOptions(user, 'scenario')
    const name = await selectScenario(user)

    expect(
      getByRoleAndName('button', 'scenario', { hidden: true })
    ).toHaveTextContent(name)
    await waitForEnabledTestRunSelect()
  })

  it('test run select should show all test runs from the chosen scenario, excluding a current test run', async () => {
    const { user } = renderWithRoute()

    await loadForm()
    await showSelectOptions(user, 'scenario')

    const { name } = mockedConfigurationsList.configurations.find(
      ({ executions }) => {
        return executions.findIndex(({ id }) => id === executionId) !== -1
      }
    )
    await user.click(screen.getByText(name))

    await waitForEnabledTestRunSelect()
    await showSelectOptions(user, 'test run')

    const visibleExecutions = mockedExecutionsList.executions.filter(
      ({ id }) => id !== executionId
    )
    const notVisibleExecutions = mockedExecutionsList.executions.filter(
      ({ id }) => id === executionId
    )

    visibleExecutions.forEach(({ start }) => {
      const formattedDate = moment(start).format('YYYY-MM-DD HH:mm')
      expect(screen.getByText(formattedDate)).toBeInTheDocument()
    })
    notVisibleExecutions.forEach(({ start }) => {
      const formattedDate = moment(start).format('YYYY-MM-DD HH:mm')
      expect(screen.queryByText(formattedDate)).not.toBeInTheDocument()
    })
  })

  it('submit button should be enabled when both scenario and test run are selected', async () => {
    const { user } = renderWithRoute()

    await loadForm()
    await showSelectOptions(user, 'scenario')
    await selectScenario(user)
    await waitForEnabledTestRunSelect()
    await showSelectOptions(user, 'test run')

    const { start } = mockedExecutionsList.executions[1]
    const formattedDate = moment(start).format('YYYY-MM-DD HH:mm')
    await user.click(screen.getByText(formattedDate))

    expect(getByRoleAndName('button', 'Compare')).not.toBeDisabled()
  })

  it('selected test run should reset when different scenario was selected', async () => {
    const { user } = renderWithRoute()

    await loadForm()
    await showSelectOptions(user, 'scenario')
    await selectScenario(user)
    await waitForEnabledTestRunSelect()
    await showSelectOptions(user, 'test run')

    const { start } = mockedExecutionsList.executions[1]
    const formattedDate = moment(start).format('YYYY-MM-DD HH:mm')
    await user.click(screen.getByText(formattedDate))

    const { name: newName } = mockedConfigurationsList.configurations[1]
    await showSelectOptions(user, 'scenario')
    await user.click(screen.getByText(newName))

    expect(screen.queryByText(formattedDate)).not.toBeInTheDocument()
  })

  it('should hide form when current test run has FAILED status', async () => {
    renderWithRoute(configurationsListMock, executionsListMock, TestRunStatus.FAILED)

    await loadForm()

    expect(screen.getByText("You can't compare failed tests.")).toBeInTheDocument()
    expect(
      screen.queryByRole('form', {
        name: 'Compare Form',
      })
    ).not.toBeInTheDocument()
  })
})
