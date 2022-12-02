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
import moment from 'moment'
import { SectionHeader, DataTable, Button, LoadingPlaceholder } from 'components'
import { useQuery } from '@apollo/client'
import routes from 'config/routes'
import { Grid, Paper, Typography } from '@material-ui/core'
import { useParams } from 'react-router-dom'
import { GET_SCENARIO } from './graphql'
import { getUrl } from 'utils/router'
import useStyles from './ScenarioDetails.styles'
import ScenarioEvolutionGraph from './ScenarioEvolutionGraph'

import { useListFilters } from 'hooks'

import { Pagination } from 'containers'
import IngestionPayloadMenu from "./IngestionPayloadMenu";

const TestScenarioDetails = () => {
  const params = useParams()
  const { scenarioId, projectId } = params
  const classes = useStyles()

    const { pagination, orderBy, setPagination } = useListFilters({
    pagination: { rowsPerPage: 10 }
  })

  const {
    loading,
    data: { externalTestScenario = [] } = {}
  } = useQuery(
    GET_SCENARIO,
    {
      variables: {
        scenarioId,
        limit: pagination.rowsPerPage,
        offset: pagination.offset,
      },
      fetchPolicy: 'cache-and-network',
    }
  )

  const totalCount = externalTestScenario?.test_runs_total ? externalTestScenario.test_runs_total.aggregate['count'] : 0

  return (
    <React.Fragment>
      <Grid container spacing={5} alignItems="center">
        <Grid item xs={12}>
          <SectionHeader
            title={externalTestScenario?.name || ''}
            description={`${externalTestScenario?.configuration_type?.name} Scenario`}
          >
            <Typography
              color="textSecondary"
              component="p"
              variant="body1"
              className={classes.marginTop}
            >
              {externalTestScenario?.description || ''}
            </Typography>
            <IngestionPayloadMenu scenarioId={scenarioId} projectId={projectId}/>
          </SectionHeader>
        </Grid>
        {externalTestScenario?.test_runs?.length > 0 && (
          <Grid item xs={12}>
            <Paper square className={classes.paper} data-testid="ScenarioExecutions">
              {!loading ? (
                <React.Fragment>
                  <SectionHeader
                    size="small"
                    className={classes.tileTitle}
                    title="Scenario Executions"
                  />
                  <ScenarioEvolutionGraph
                    dataset={externalTestScenario.test_runs}
                  />
                </React.Fragment>
              ) : (
                <LoadingPlaceholder title="Loading test run results..." />
              )}
            </Paper>
          </Grid>
        )}
      </Grid>
      <div className={classes.marginTop}>
        <Pagination
          {...pagination}
          onChange={setPagination}
          totalCount={totalCount}
        />
        <DataTable
          data={externalTestScenario?.test_runs}
          isLoading={loading}
          rowKey={test_run => test_run.id}
        >
          <DataTable.Column
            render={test_run =>
              moment(test_run.timestamp).format('YYYY-MM-DD HH:mm:ss')
            }
            title="Run Date"
          />
          <DataTable.Column
            render={test_run => (
              <div className={classes.success}>{test_run.successes}</div>
            )}
            title="Successes"
          />
          <DataTable.Column render={test_run => test_run.skipped} title="Skipped" />
          <DataTable.Column
            render={test_run => (
              <div className={classes.failure}>{test_run.failures}</div>
            )}
            title="Failures"
          />
          <DataTable.Column
            render={test_run => (
              <div className={classes.error}>{test_run.errors}</div>
            )}
            title="Errors"
          />
          <DataTable.Column render={test_run => test_run.total} title="Total" />
          <DataTable.Column
            key="actions"
            render={test_run => {
              return (
                <div className={classes.actionsContainer}>
                  <Button
                    data-testid={`scenario-${test_run.id}-details`}
                    href={getUrl(routes.projects.E2EScenarios.details, {
                      projectId: projectId,
                      testRunId: test_run.id,
                      scenarioId: scenarioId,
                    })}
                    title="Show scenario details"
                    variant="link"
                  >
                    Details
                  </Button>
                </div>
              )
            }}
            title="Actions"
          />
        </DataTable>
      </div>
    </React.Fragment>
  )
}

export default TestScenarioDetails
