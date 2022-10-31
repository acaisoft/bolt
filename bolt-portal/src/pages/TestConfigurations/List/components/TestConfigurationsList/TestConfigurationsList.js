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
import { Box } from '@material-ui/core'
import { Add } from '@material-ui/icons'
import {
  Button,
  NoDataPlaceholder,
  LoadingPlaceholder,
  ErrorPlaceholder,
} from 'components'
import { useQuery } from '@apollo/client'
import { GET_SLUG_NAMES } from './graphql'
import useStyles from './TestConfigurationsList.styles'

import { TestConfigurationsTable } from './components/TestConfigurationTable'

export function TestConfigurationsList({
  getTestConfigurationCreateUrl = () => {},
  getTestConfigurationDetailsUrl = () => {},
  getTestConfigurationEditUrl = () => {},
  getE2ETestRunsListUrl = () => {},
  onClone = () => {},
  onRun = () => {},
  projectId,
}) {
  const classes = useStyles()

  const {
    data: { configuration_type = [] } = {},
    data: { configurationsTotal = [] } = {},
    loading,
    error,
  } = useQuery(GET_SLUG_NAMES, {
    variables: { projectId },
    fetchPolicy: 'cache-and-network',
  })

  if (loading || error || configurationsTotal.aggregate['count'] === 0) {
    return (
      <Box p={3}>
        {loading ? (
          <LoadingPlaceholder title="Loading scenarios..." />
        ) : error ? (
          <ErrorPlaceholder error={error} />
        ) : (
          <NoDataPlaceholder
            title="No scenarios"
            description="Seems like you haven't created any scenarios in this project yet."
            buttonUrl={getTestConfigurationCreateUrl()}
            buttonLabel="Create a scenario"
          />
        )}
      </Box>
    )
  }
  return (
    <React.Fragment>
      <div className={classes.newScenarioButtonContainer}>
        <Button
          data-testid="new-scenario-button"
          icon={Add}
          variant="contained"
          color="secondary"
          href={getTestConfigurationCreateUrl()}
        >
          New
        </Button>
      </div>
      {configuration_type &&
        configuration_type.map(type => (
          <TestConfigurationsTable
            type={type}
            key={`${type['slug_name']}-configuration-table`}
            getTestConfigurationCreateUrl={getTestConfigurationCreateUrl}
            getTestConfigurationDetailsUrl={getTestConfigurationDetailsUrl}
            getTestConfigurationEditUrl={getTestConfigurationEditUrl}
            getE2ETestRunsListUrl={getE2ETestRunsListUrl}
            onClone={onClone}
            projectId={projectId}
          />
        ))}
    </React.Fragment>
  )
}

TestConfigurationsList.propTypes = {
  getTestConfigurationCreateUrl: PropTypes.func.isRequired,
  getTestConfigurationDetailsUrl: PropTypes.func.isRequired,
  projectId: PropTypes.string,
}

export default TestConfigurationsList
