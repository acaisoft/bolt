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
import {
  DataTable,
  ExpandablePanel,
  TestRunStatus,
  LabeledValue,
  SectionHeader,
} from 'components'
import { useQuery } from '@apollo/client'
import { Paper, Grid } from '@material-ui/core'
import { useParams } from 'react-router-dom'
import { Details } from 'assets/icons'
import {
  GET_GROUPS_WITH_RESULTS,
  GET_DESCRIPTION_AND_CUSTOM_FIELDS,
} from './graphql'
import useStyles from './TestRun.styles'

const TestRunDetails = () => {
  const params = useParams()
  const { testRunId, scenarioId } = params
  const classes = useStyles()

  const { loading, data: { group = [] } = {} } = useQuery(GET_GROUPS_WITH_RESULTS, {
    variables: { testRunId },
    fetchPolicy: 'cache-and-network',
  })

  const { loading: customfieldLoading, data: { configuration = [] } = {} } =
    useQuery(GET_DESCRIPTION_AND_CUSTOM_FIELDS, {
      variables: { testRunId, scenarioId },
      fetchPolicy: 'cache-and-network',
    })

  const customFields = configuration[0].test_runs[0].custom_fields

  return (
    <React.Fragment>
      {!customfieldLoading && (
        <ExpandablePanel defaultExpanded={true} title="Scenario Details">
          <Paper square className={classes.paper} data-testid="TestConfigDetails">
            <Grid container spacing={5} alignItems="center">
              <Grid item hidden="sm" md={1} container justifyContent="center">
                <Grid item>
                  <Details height={80} width={70} />
                </Grid>
              </Grid>
              <Grid item xs>
                <Grid container spacing={4} alignItems="flex-start">
                  <Grid item>
                    <LabeledValue
                      label="Description"
                      value={configuration[0].description}
                    />
                  </Grid>
                </Grid>
                {customFields.length > 0 && (
                  <Grid container spacing={4} alignItems="flex-start">
                    <Grid item xs={12}>
                      <SectionHeader size="medium" title="Additional Info" />
                    </Grid>
                    {customFields.map(custom_field => (
                      <Grid item xs={12} md={3}>
                        <LabeledValue
                          label={custom_field.name}
                          value={custom_field.value}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Paper>
        </ExpandablePanel>
      )}

      {group.map(gr => (
        <ExpandablePanel defaultExpanded={false} title={gr.name}>
          <div className={classes.tableWrapper}>
            <DataTable data={gr.test_cases} isLoading={loading}>
              <DataTable.Column
                render={testCase => testCase.name_from_file}
                title="Name"
              />
              <DataTable.Column
                render={testCase => {
                  let status
                  switch (testCase.test_results[0].result) {
                    case 'success':
                      status = 'SUCCEEDED'
                      break
                    case 'failure':
                      status = 'FAILED'
                      break
                    case 'skipped':
                      status = 'SKIPPED'
                      break
                    default:
                      status = 'OTHER'
                  }

                  return <TestRunStatus status={status} />
                }}
                title="Status"
              />
              <DataTable.Column
                render={testCase => testCase.test_results[0].message || '-'}
                title="Message"
              />
              <DataTable.Column
                render={testCase => testCase.test_results[0].duration + 's'}
                title="Duration"
              />
            </DataTable>
          </div>
        </ExpandablePanel>
      ))}
    </React.Fragment>
  )
}

export default TestRunDetails
