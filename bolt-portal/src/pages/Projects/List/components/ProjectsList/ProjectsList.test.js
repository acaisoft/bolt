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
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { customRender } from 'utils/tests/mocks'
import ProjectsList from './ProjectsList'
import { mockedProjectsList, projectsGraphqlMock } from './ProjectsList.mocks'

jest.unmock('@material-ui/core')
jest.unmock('@material-ui/icons')

async function loadProjects() {
  await waitFor(() => {
    expect(screen.queryByText('Loading projects...')).not.toBeInTheDocument()
  })
}

describe('component: ProjectsList', () => {
  it('should display a loader while projects are loading', () => {
    render(customRender(<ProjectsList />, [projectsGraphqlMock]))

    expect(screen.getByText('Loading projects...')).toBeInTheDocument()
  })

  it('should display exact projects count', async () => {
    render(customRender(<ProjectsList />, [projectsGraphqlMock]))

    await loadProjects()

    const projectsCount = mockedProjectsList.summaries.projects.length
    const projectsHeader = document.querySelector(`[aria-label="Your Projects"]`)
    expect(within(projectsHeader).getByText(`(${projectsCount})`))
  })

  it('should display all projects', async () => {
    render(customRender(<ProjectsList />, [projectsGraphqlMock]))

    await loadProjects()

    mockedProjectsList.summaries.projects.forEach(
      ({ name, description, num_sources, num_scenarios }) => {
        expect(screen.getByLabelText(`project ${name}`)).toBeInTheDocument()

        const project = document.querySelector(`[aria-label="project ${name}"]`)

        expect(within(project).getByText(name)).toBeInTheDocument()
        if (description) {
          expect(within(project).getByText(description)).toBeInTheDocument()
        }

        expect(
          within(project).getByText(
            `${num_sources} Test Source${num_sources === 1 ? '' : 's'}`
          )
        ).toBeInTheDocument()
        expect(
          within(project).getByText(
            `${num_scenarios} Test Scenario${num_scenarios === 1 ? '' : 's'}`
          )
        ).toBeInTheDocument()
      }
    )
  })

  it('should display new project form after clicking new button', async () => {
    const user = userEvent.setup()
    render(customRender(<ProjectsList />, [projectsGraphqlMock]))

    await loadProjects()

    expect(screen.getByLabelText('Project Form')).toBeInTheDocument()
    await user.click(
      screen.getByRole('button', {
        name: 'New',
      })
    )

    const projectForm = document.querySelector(`[aria-label="Project Form"]`)
    expect(within(projectForm).getByText('New Project')).toBeInTheDocument()

    // TODO: uncomment when upload will be needed
    // expect(
    //   within(projectForm).getByRole('button', { name: 'Upload Image' })
    // ).toBeInTheDocument()

    expect(within(projectForm).getByLabelText('Name')).toBeInTheDocument()
    expect(within(projectForm).getByLabelText('Description')).toBeInTheDocument()

    expect(
      within(projectForm).getByRole('button', { name: 'Cancel' })
    ).not.toBeDisabled()
    expect(within(projectForm).getByRole('button', { name: 'Add' })).toBeDisabled()
  })

  it('should display project edit form with populated inputs after menu click', async () => {
    const user = userEvent.setup()
    render(customRender(<ProjectsList />, [projectsGraphqlMock]))

    await loadProjects()

    const { name, description } = mockedProjectsList.summaries.projects[0]
    const project = document.querySelector(`[aria-label="project ${name}"]`)

    await user.click(within(project).getByRole('button', { name: 'Project Menu' }))
    await user.click(
      screen.getByRole('menuitem', {
        name: 'Edit project',
      })
    )

    expect(within(project).getByText('Update project data')).toBeInTheDocument()
    // TODO: uncomment when upload will be needed
    // expect(
    //   within(project).getByRole('button', { name: 'Upload Image' })
    // ).toBeInTheDocument()

    expect(within(project).getByLabelText('Name')).toHaveValue(name)
    expect(within(project).getByLabelText('Description')).toHaveValue(description)

    expect(
      within(project).getByRole('button', { name: 'Cancel' })
    ).not.toBeDisabled()
    expect(within(project).getByRole('button', { name: 'Update' })).toBeDisabled()
  })
})
