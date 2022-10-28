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
  LoadingPlaceholder,
} from 'components'
import { useQuery } from '@apollo/client'
import { Paper, Grid, Tooltip } from '@material-ui/core'
import { useParams } from 'react-router-dom'
import { Details } from 'assets/icons'
import { SuccessRatePieChart } from 'components'
import { formatPercent } from 'utils/numbers'
import {
  GET_GROUPS_WITH_RESULTS,
  GET_DESCRIPTION_AND_CUSTOM_FIELDS_AND_TOTALS,
} from './graphql'
import useStyles from './TestRun.styles'
import ResultColumn from './ResultColumn'
import TestRunChart from './TestRunChart'
import TestGroupChart from './TestGroupChart'

const TestRunDetails = () => {
  const params = useParams()
  const { testRunId, scenarioId } = params
  const classes = useStyles()

  const { loading, data: { group = [] } = {} } = useQuery(GET_GROUPS_WITH_RESULTS, {
    variables: { testRunId },
    fetchPolicy: 'cache-and-network',
  })

  const { loading: customfieldLoading, data: { configuration = [] } = {} } =
    useQuery(GET_DESCRIPTION_AND_CUSTOM_FIELDS_AND_TOTALS, {
      variables: { testRunId, scenarioId },
      fetchPolicy: 'cache-and-network',
    })

  const customFields = configuration[0]
    ? configuration[0].test_runs[0].custom_fields
    : []

  const results = configuration[0]
    ? configuration[0].total_results[0]
    : [{ name: '', value: 0 }]

  const getStatus = testCase => {
    let status
    switch (testCase.test_results[0]?.result) {
      case 'success':
        status = 'SUCCEEDED'
        break
      case 'failure':
        status = 'FAILED'
        break
      case 'error':
        status = 'ERROR'
        break
      case 'skipped':
        status = 'SKIPPED'
        break
      default:
        status = 'OTHER'
    }
    return status
  }

  const getSuccessRate = test_cases => {
    return (
      test_cases.filter(test_case => test_case.test_results[0]?.result === 'success')
        .length / test_cases.length
    )
  }

  const getNameColumnTitle = group => {
    const success_rate = getSuccessRate(group.test_cases)
    return (
      <div className={classes.rateContainer}>
        <div className={classes.marginRight}>{group.name}</div>
        <SuccessRatePieChart
          value={success_rate * 100}
          size={20}
          variant="multicolor"
        />

        <span className={classes.rateMeter}>{formatPercent(success_rate)}</span>
      </div>
    )
  }

  return (
    <React.Fragment>
      <ExpandablePanel defaultExpanded={true} title="Scenario Details" variant="h5">
        <Paper square className={classes.paper} data-testid="TestConfigDetails">
          {!customfieldLoading ? (
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
                      <Grid key={custom_field.name} item xs={12} md={3}>
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
          ) : (
            <LoadingPlaceholder title="Loading test run results..." />
          )}
        </Paper>
      </ExpandablePanel>
      {!customfieldLoading ? (
        <React.Fragment>
          <Grid container spacing={5} alignItems="center">
            {results?.total && (
              <Grid item xs={5}>
                <Paper square className={classes.paper} data-testid="TestRunRatios">
                  <SectionHeader
                    size="small"
                    className={classes.tileTitle}
                    title="General results"
                  />
                  <TestRunChart data={results} />
                </Paper>
              </Grid>
            )}
            {group.length > 0 && (
              <Grid item xs={7}>
                <Paper square className={classes.paper} data-testid="TestRunRatios">
                  <SectionHeader
                    size="small"
                    className={classes.tileTitle}
                    title="Group results"
                  />
                  <TestGroupChart dataset={group} />
                </Paper>
              </Grid>
            )}
          </Grid>
        </React.Fragment>
      ) : (
        <LoadingPlaceholder title="Loading test run results..." />
      )}

      {!customfieldLoading ? (
        <React.Fragment>
          {group.map(gr => (
            <ExpandablePanel
              key={'group_' + gr.name}
              defaultExpanded={false}
              advancedTitle={getNameColumnTitle(gr)}
              title={gr.name}
            >
              <div className={classes.tableWrapper}>
                <DataTable data={gr.test_cases} isLoading={loading}>
                  <DataTable.Column
                    style={{ width: '300px' }}
                    render={testCase => (
                      <Tooltip
                        title={testCase.name_from_file}
                        placement="bottom-start"
                        classes={{ tooltip: classes.tooltip }}
                      >
                        <div>
                          {testCase.name_from_file.length > 50
                            ? `${testCase.name_from_file.slice(0, 50)}...`
                            : testCase.name_from_file}
                        </div>
                      </Tooltip>
                    )}
                    title="Name"
                  />
                  <DataTable.Column
                    render={testCase => (
                      <TestRunStatus status={getStatus(testCase)} />
                    )}
                    title="Status"
                  />
                  <DataTable.Column
                    render={testCase => (
                      <ResultColumn message={testCase.test_results[0]?.message} />
                    )}
                    title="Message"
                  />
                  <DataTable.Column
                    render={testCase =>
                      testCase.test_results[0]?.duration
                        ? testCase.test_results[0]?.duration + 's'
                        : '-'
                  }
                    title="Duration"
                  />
                </DataTable>
              </div>
            </ExpandablePanel>
          ))}
        </React.Fragment>
      ) : (
        ''
      )}
    </React.Fragment>
  )
}

export default TestRunDetails
