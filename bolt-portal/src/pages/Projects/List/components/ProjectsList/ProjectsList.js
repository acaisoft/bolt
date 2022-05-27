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

import React, { useState, useCallback } from 'react'
import classNames from 'classnames'

import { Card, Box } from '@material-ui/core'
import { ErrorPlaceholder, LoadingPlaceholder, SectionHeader } from 'components'

import { GET_PROJECT_SUMMARIES } from './graphql'
import { useQuery } from '@apollo/client'

import useStyles from './ProjectsList.styles'
import { BackgroundImage, ProjectFormInCard, NewProjectCard, ProjectCard } from '..'

function ProjectsList() {
  const classes = useStyles()
  const { summaries, loading, error } = useProjectSummaries()

  const { editedItem, handleClickCreate, handleClickEdit, handleFormClose } =
    useProjectsListState()

  if (loading || error) {
    return (
      <Box p={2}>
        {loading ? (
          <LoadingPlaceholder title="Loading projects..." />
        ) : (
          <ErrorPlaceholder error={error} />
        )}
      </Box>
    )
  }

  const projectsItems = [{ id: 'new-project' }, ...summaries]

  return (
    <React.Fragment>
      <SectionHeader
        title="Your Projects"
        subtitle={`(${summaries.length})`}
        marginBottom
        aria-label="Your Projects"
      />

      <div className={classes.gridContainer} data-testid="ProjectsList">
        {projectsItems.map(project => {
          const isNewProject = project.id === 'new-project'
          const isEditedProject = editedItem && editedItem.id === project.id

          return (
            <div
              className={classNames({
                [classes.gridItem]: true,
                [classes.gridItemBig]: isEditedProject,
              })}
              key={project.id}
            >
              <Card
                aria-label={
                  isNewProject ? 'Project Form' : `project ${project.name}`
                }
                className={classNames({
                  [classes.card]: true,
                  [classes.formCard]: isNewProject,
                })}
              >
                <div className={classes.newProjectContainer}>
                  <BackgroundImage url={project.image_url} />
                  {isEditedProject ? (
                    <ProjectFormInCard
                      initialValues={editedItem}
                      mode={isNewProject ? 'create' : 'edit'}
                      onCancel={handleFormClose}
                      onSubmit={handleFormClose}
                    />
                  ) : isNewProject ? (
                    <NewProjectCard onCreate={handleClickCreate} />
                  ) : (
                    <ProjectCard onEdit={handleClickEdit} project={project} />
                  )}
                </div>
              </Card>
            </div>
          )
        })}
      </div>
    </React.Fragment>
  )
}

function useProjectSummaries() {
  const {
    data: { summaries = {} } = {},
    loading,
    error,
  } = useQuery(GET_PROJECT_SUMMARIES, {
    fetchPolicy: 'cache-and-network',
  })

  return { loading, error, summaries: summaries?.projects || [] }
}

function useProjectsListState() {
  const [editedItem, setEditedItem] = useState(null)

  const handleFormClose = useCallback(() => {
    setEditedItem(null)
  }, [])
  const handleClickCreate = useCallback(() => {
    setEditedItem({ id: 'new-project' })
  }, [])
  const handleClickEdit = useCallback(project => {
    setEditedItem(project)
  }, [])

  return {
    editedItem,
    handleFormClose,
    handleClickCreate,
    handleClickEdit,
  }
}

export default ProjectsList
