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

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useParams, useNavigate } from 'react-router-dom'
import { useSubscription } from '@apollo/client'
import { Box, Grid, MenuItem } from '@material-ui/core'
import { Form } from 'react-final-form'
import moment from 'moment'
import routes from 'config/routes'
import { TestRunStatus } from 'config/constants'
import { getUrl } from 'utils/router'
import { Details } from 'assets/icons'
import { useListFilters } from 'hooks'
import { FormField, FormValue } from 'containers'
import {
  Button,
  ErrorPlaceholder,
  LoadingPlaceholder,
  NotFoundPlaceholder,
  SectionHeader,
} from 'components'
import { getFilteredConfigurations } from './CompareResults.utils'
import { SUBSCRIBE_TO_EXECUTIONS_LIST, SUBSCRIBE_TO_SCENARIOS_LIST } from './graphql'

function CompareResults({ status }) {
  const navigate = useNavigate()
  const { projectId, executionId } = useParams()
  const [selectedConfigId, setSelectedConfigId] = useState('')
  const { orderBy } = useListFilters({
    orderBy: [{ id: 'asc' }],
  })

  const {
    data: { configurations = [] } = {},
    loading: configurationsLoading,
    error: configurationsError,
  } = useSubscription(SUBSCRIBE_TO_SCENARIOS_LIST, {
    variables: {
      projectId,
      order_by: orderBy,
    },
    fetchPolicy: 'cache-and-network',
  })

  const {
    data: { executions = [] } = {},
    loading: executionsLoading,
    error: executionsError,
  } = useSubscription(SUBSCRIBE_TO_EXECUTIONS_LIST, {
    fetchPolicy: 'cache-first',
    variables: {
      configurationId: selectedConfigId,
    },
    skip: !selectedConfigId,
  })

  const fields = {
    scenario_id: {
      options: [],
      inputProps: {
        select: true,
        label: 'Scenario',
      },
    },
    execution_to_compare_id: {
      options: [],
      inputProps: {
        select: true,
        label: 'Test Run',
      },
    },
  }

  function handleSubmit({ execution_to_compare_id }) {
    navigate(
      getUrl(routes.projects.compare, {
        projectId,
        compareIdFirst: executionId,
        compareIdSecond: execution_to_compare_id,
      })
    )
  }

  if (configurationsLoading) {
    return (
      <Box p={3}>
        <LoadingPlaceholder title="Loading data to compare..." />
      </Box>
    )
  }

  if (configurationsError || executionsError) {
    return (
      <Box p={3}>
        <ErrorPlaceholder error={configurationsError || executionsError} />
      </Box>
    )
  }

  if (!configurations?.length) {
    return (
      <Box p={3}>
        <NotFoundPlaceholder title="Data to compare not found" />
      </Box>
    )
  }

  function renderContent() {
    if (status === TestRunStatus.FAILED) {
      return (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <SectionHeader size="small" title="You can't compare failed tests." />
          </Grid>
        </Grid>
      )
    }

    return (
      <Form onSubmit={handleSubmit} keepDirtyOnReinitialize>
        {form => (
          <form
            data-testid="Compare Form"
            aria-label="Compare Form"
            onSubmit={form.handleSubmit}
          >
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <SectionHeader size="medium" title="Compare to" />
              </Grid>
              <Grid item xs={12} md={5}>
                <FormField
                  id="scenario_id"
                  name="scenario_id"
                  field={fields.scenario_id}
                  variant="outlined"
                  fullWidth
                  disabled={configurationsLoading || executionsLoading}
                >
                  {getFilteredConfigurations(configurations, executionId).map(
                    ({ id, name }) => (
                      <MenuItem
                        key={id}
                        value={id}
                        onClick={() => setSelectedConfigId(id)}
                      >
                        {name}
                      </MenuItem>
                    )
                  )}
                </FormField>
              </Grid>
              <Grid item xs={12} md={5}>
                <FormValue name="scenario_id">
                  {scenarioName => (
                    <FormField
                      id="execution_to_compare_id"
                      name="execution_to_compare_id"
                      field={fields.execution_to_compare_id}
                      variant="outlined"
                      fullWidth
                      disabled={
                        !scenarioName || configurationsLoading || executionsLoading
                      }
                    >
                      {executions
                        .filter(({ id }) => id !== executionId)
                        .map(({ id, start }) => (
                          <MenuItem key={id} value={id}>
                            {moment(start).format('YYYY-MM-DD HH:mm')}
                          </MenuItem>
                        ))}
                    </FormField>
                  )}
                </FormValue>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  color="secondary"
                  variant="contained"
                  type="submit"
                  disabled={
                    !form.dirty ||
                    form.isSubmitting ||
                    form.invalid ||
                    !form.values.scenario_id ||
                    !form.values.execution_to_compare_id
                  }
                >
                  Compare
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Form>
    )
  }

  return (
    <Grid container spacing={5} alignItems="center">
      <Grid item hidden="sm" md={1} container justifyContent="center">
        <Grid item>
          <Details height={80} width={70} />
        </Grid>
      </Grid>

      <Grid item xs>
        {renderContent()}
      </Grid>
    </Grid>
  )
}

CompareResults.propTypes = {
  status: PropTypes.string.isRequired,
}

export default CompareResults
