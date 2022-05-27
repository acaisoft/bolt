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
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import routes from 'config/routes'
import { getUrl } from 'utils/router'
import { customRender } from 'utils/tests/mocks'
import { getByRoleAndName } from 'utils/tests'
import TestSourceForm from './TestSourceForm'
import {
  repositoryKeyMock,
  configurationTypesMock,
  addRepositoryConnectionSuccessMock,
  addRepositoryConnectionErrorMock,
  editRepositoryTestsPerformedMock,
  editRepositoryTestsNotPerformedMock,
  getTestSourceMock,
  projectId,
  repoName,
  repoUrl,
  validationErrorMessage,
  sourceId,
} from './TestSourceForm.mocks'

jest.unmock('@material-ui/core')
jest.unmock('@material-ui/icons')

const renderWithRoute = (
  repositoryConnectionMock = addRepositoryConnectionSuccessMock,
  sourceId
) => {
  const mode = sourceId ? 'edit' : 'create'
  const url = routes.projects.sources[mode]
  const params = {
    projectId,
    ...(!!sourceId && { sourceId }),
  }

  return {
    user: userEvent.setup(),
    ...render(
      customRender(
        <Routes>
          <Route path={url} element={<TestSourceForm />} />
        </Routes>,
        [
          repositoryKeyMock,
          configurationTypesMock,
          repositoryConnectionMock,
          getTestSourceMock,
        ],
        [getUrl(url, params)]
      )
    ),
  }
}

async function loadData() {
  await waitFor(() => {
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })
}

async function fillForm(user) {
  const urlInput = getByRoleAndName('textbox', 'repository url')
  const nameInput = getByRoleAndName('textbox', 'repository name')

  await user.type(urlInput, repoUrl)
  await user.type(nameInput, repoName)
}

async function testConnectionClick(user) {
  const testConnectionButton = getByRoleAndName('button', 'Test Connection')
  await user.click(testConnectionButton)

  return testConnectionButton
}

async function testConnection(user) {
  const testConnectionButton = await testConnectionClick(user)

  await waitFor(() => {
    expect(
      within(testConnectionButton).queryByTestId('loader')
    ).not.toBeInTheDocument()
  })
}

describe('component: TestSourceForm', () => {
  it('should display a loader while data is loading', () => {
    renderWithRoute()

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('should display all necessary source form elements', async () => {
    renderWithRoute()

    await loadData()

    expect(screen.getByLabelText('source type select')).toBeInTheDocument()
    expect(screen.getByLabelText('repository type select')).toBeInTheDocument()

    expect(getByRoleAndName('textbox', 'repository name')).toBeInTheDocument()
    expect(getByRoleAndName('textbox', 'repository url')).toBeInTheDocument()

    expect(getByRoleAndName('button', 'Create')).toBeDisabled()
    expect(getByRoleAndName('button', 'Test Connection')).toBeDisabled()
  })

  it('should enable testing connection when valid url and repository name are provided', async () => {
    const { user } = renderWithRoute()

    await loadData()

    const urlInput = getByRoleAndName('textbox', 'repository url')
    const nameInput = getByRoleAndName('textbox', 'repository name')

    await user.type(urlInput, repoUrl)
    expect(getByRoleAndName('button', 'Test Connection')).toBeDisabled()

    await user.type(nameInput, repoName)
    expect(getByRoleAndName('button', 'Test Connection')).not.toBeDisabled()
  })

  it('should disable form submit button when form is filled but connection is not tested', async () => {
    const { user } = renderWithRoute()

    await loadData()
    await fillForm(user)

    expect(getByRoleAndName('button', 'Create')).toBeDisabled()
  })

  it('should display test connection loader when url is being checked', async () => {
    const { user } = renderWithRoute()

    await loadData()
    await fillForm(user)
    const testConnectionButton = await testConnectionClick(user)

    expect(within(testConnectionButton).getByTestId('loader')).toBeInTheDocument()
  })

  it('should enable creating test source when connection was tested and it is valid', async () => {
    const { user } = renderWithRoute()

    await loadData()
    await fillForm(user)
    await testConnection(user)

    expect(screen.getByTestId('success')).toBeInTheDocument()
    expect(getByRoleAndName('button', 'Create')).not.toBeDisabled()
  })

  it('should require another connection test when valid url was edited', async () => {
    const { user } = renderWithRoute()

    await loadData()
    await fillForm(user)
    await testConnection(user)

    const urlInput = getByRoleAndName('textbox', 'repository url')
    await user.type(urlInput, 'git@bitbucket.org:acaisoft/bolt-rctesttest.git')

    expect(screen.queryByTestId('success')).not.toBeInTheDocument()
    expect(getByRoleAndName('button', 'Create')).toBeDisabled()
  })

  it('should not enable test source creation when test connection gives an error', async () => {
    const { user } = renderWithRoute(addRepositoryConnectionErrorMock)

    await loadData()
    await fillForm(user)
    await testConnection(user)

    expect(screen.getByTestId('error')).toBeInTheDocument()
    expect(screen.getByText(new RegExp(validationErrorMessage))).toBeInTheDocument()
    expect(getByRoleAndName('button', 'Create')).toBeDisabled()
  })

  it('should populate repo url and name inputs when test source is being edited', async () => {
    renderWithRoute(editRepositoryTestsNotPerformedMock, sourceId)

    await loadData()

    expect(getByRoleAndName('textbox', 'repository name')).toHaveValue(repoName)
    expect(getByRoleAndName('textbox', 'repository url')).toHaveValue(repoUrl)
  })

  it('should not enable url editing for existing test source when tests have been performed with it', async () => {
    renderWithRoute(editRepositoryTestsPerformedMock, sourceId)

    await loadData()

    expect(
      screen.getByText(
        'You cannot change repository url - a test has been performed using this repository'
      )
    ).toBeInTheDocument()
    expect(getByRoleAndName('textbox', 'repository url')).toBeDisabled()
  })

  it('should enable url editing for existing test source when tests have not been performed with it', async () => {
    renderWithRoute(editRepositoryTestsNotPerformedMock, sourceId)

    await loadData()

    expect(
      screen.queryByText(
        'You cannot change repository url - a test has been performed using this repository'
      )
    ).not.toBeInTheDocument()
    expect(getByRoleAndName('textbox', 'repository url')).not.toBeDisabled()
  })
})
