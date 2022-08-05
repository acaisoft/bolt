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

import React, { useMemo } from 'react'

import { Grid, Paper } from '@material-ui/core'
import { useTheme } from '@material-ui/styles'
import { Line } from 'components'
import { useCallbackRef } from 'hooks'
import { TestRunStageStatus } from 'config/constants'
import {
  SUBSCRIBE_TO_EXECUTION_STATUS,
  GET_GRAPH_CONFIGURATION,
  SUBSCRIBE_TO_EXECUTION_STAGE_LOG,
} from '../../graphql'

import Step from './Step'
import useStyles from './StatusGraph.styles'
import { useSubscription, useQuery } from '@apollo/client'
import { LoadingPlaceholder, ErrorPlaceholder } from 'components'

const Stages = {
  START: 'start',
  DOWNLOADING_SOURCE: 'downloading_source',
  IMAGE_PREPARATION: 'image_preparation',
  PRE_START: 'pre_start',
  LOAD_TESTS: 'load_tests',
  MONITORING: 'monitoring',
  CLEAN_UP: 'post_stop',
  FINISHED: 'finished',
}

const stagesOrder = [
  Stages.DOWNLOADING_SOURCE,
  Stages.IMAGE_PREPARATION,
  Stages.PRE_START,
  Stages.LOAD_TESTS,
  Stages.MONITORING,
  Stages.CLEAN_UP,
]

function getCurrentStatus(executionStatus, errorStages, terminatedStage) {
  let stagesData = {}
  stagesOrder.forEach(stage => {stagesData[stage] = TestRunStageStatus.NOT_STARTED});

  switch (executionStatus) {
    case TestRunStageStatus.PENDING:
      stagesData[Stages.DOWNLOADING_SOURCE] = TestRunStageStatus.SUCCEEDED
      stagesData[Stages.IMAGE_PREPARATION] = TestRunStageStatus.RUNNING
      break;
    case TestRunStageStatus.RUNNING:
      stagesData[Stages.DOWNLOADING_SOURCE] = TestRunStageStatus.SUCCEEDED
      stagesData[Stages.IMAGE_PREPARATION] = TestRunStageStatus.SUCCEEDED
      stagesData[Stages.LOAD_TESTS] = TestRunStageStatus.RUNNING
      break;
    case TestRunStageStatus.SUCCEEDED:
    case TestRunStageStatus.FINISHED:
    case TestRunStageStatus.ERROR:
    case TestRunStageStatus.FAILED:
      stagesOrder.forEach(stage => {stagesData[stage] = TestRunStageStatus.SUCCEEDED});
      break;
    case TestRunStageStatus.TERMINATED:
      for (let i=0; i<stagesOrder.length; i++) {
        let stage = stagesOrder[i];
        if (stage === terminatedStage) {
          break
        } else {
          stagesData[stage] = TestRunStageStatus.SUCCEEDED
        }
      }
      break
    default:
      // Keep all stages in NOT_STARTED status
      break
  }

  errorStages.forEach(stage => {
    stagesData[stage.toLowerCase()] = TestRunStageStatus.FAILED
  })

  return stagesData
}

function getFinishStepStatus(stagesData, executionStatus) {
  delete stagesData.finished
  const errorStatuses = [TestRunStageStatus.FAILED, TestRunStageStatus.ERROR]

  const isFinished =
    Object.values(stagesData).length > 0 &&
    Object.values(stagesData).every(value => value === TestRunStageStatus.SUCCEEDED)

  const hasError = Object.values(stagesData).find(
    value =>
      errorStatuses.indexOf(value) > -1
  ) || errorStatuses.indexOf(executionStatus) > -1

  if (executionStatus === TestRunStageStatus.TERMINATED) {
    return TestRunStageStatus.TERMINATED
  }

  if (hasError) {
    return TestRunStageStatus.FAILED
  }

  if (isFinished) {
    return TestRunStageStatus.SUCCEEDED
  }

  return TestRunStageStatus.NOT_STARTED
}

export function StatusGraph({ executionId, configurationId, executionStatus }) {
  const classes = useStyles()
  const theme = useTheme()

  const { data: { configuration = {} } = {} } = useQuery(GET_GRAPH_CONFIGURATION, {
    variables: { configurationId },
    fetchPolicy: 'cache-first',
  })

  const {
    data: { execution } = {},
    loading,
    error,
  } = useSubscription(SUBSCRIBE_TO_EXECUTION_STATUS, {
    variables: { executionId },
    fetchPolicy: 'cache-and-network',
  })

  if (execution) {
    executionStatus = execution[0]["status"];
  }

  const statuses = [TestRunStageStatus.ERROR, TestRunStageStatus.FAILED, TestRunStageStatus.TERMINATED]
  const {
    data: { execution_stage_log } = {},
  } = useSubscription(SUBSCRIBE_TO_EXECUTION_STAGE_LOG, {
    variables: { executionId, statuses },
    fetchPolicy: 'cache-and-network',
  })

  let errorStages = [];
  let terminatedStage = "";
  if (execution_stage_log) {
    execution_stage_log.forEach(status => {
      if (status["level"] === TestRunStageStatus.TERMINATED) {
        terminatedStage = status["stage"]
      } else {
        errorStages.push(status["stage"])
      }})
  }

  const [startEl, startRef] = useCallbackRef()
  const [sourceEl, sourceRef] = useCallbackRef()
  const [preparationEl, preparationRef] = useCallbackRef()
  const [monitoringEl, monitoringRef] = useCallbackRef()
  const [loadTestsEl, loadTestsRef] = useCallbackRef()
  const [cleanupEl, cleanupRef] = useCallbackRef()
  const [finishEl, finishRef] = useCallbackRef()

  const isStarted = useMemo(() => {
    return Boolean(executionStatus !== TestRunStageStatus.NOT_STARTED);
  }, [executionStatus])

  const stagesData = useMemo(() => {
    let tempData = getCurrentStatus(executionStatus, errorStages, terminatedStage)
    tempData[Stages.FINISHED] = getFinishStepStatus(tempData, executionStatus)

    return tempData
  }, [executionStatus, configuration, executionStatus, isStarted, errorStages, terminatedStage])

  const options = useMemo(() => {
    const { line } = theme.palette.chart.graph

    return {
      color: line.default,
      size: 2,
    }
  }, [theme])

  let lines = []

  lines = [
    {
      id: 1,
      from: startEl,
      to: sourceEl,
      options: options,
    },
    {
      id: 2,
      from: sourceEl,
      to: preparationEl,
      options: options,
    },
    {
      id: 3,
      from: preparationEl,
      to: monitoringEl,
      options: options,
    },
    {
      id: 4,
      from: preparationEl,
      to: loadTestsEl,
      options: options,
    },
    {
      id: 5,
      from: monitoringEl,
      to: cleanupEl,
      options: options,
    },
    {
      id: 6,
      from: loadTestsEl,
      to: cleanupEl,
      options: options,
    },
    {
      id: 7,
      from: cleanupEl,
      to: finishEl,
      options: options,
    },
  ]

  if (loading || error) {
    return (
      <Grid item xs={12}>
        <Paper square className={classes.tile}>
          {loading ? (
            <LoadingPlaceholder title="Loading data..." />
          ) : error ? (
            <ErrorPlaceholder error={error} />
          ) : (
            <LoadingPlaceholder title="Waiting for test run status..." />
          )}
        </Paper>
      </Grid>
    )
  }

  return (
    <React.Fragment>
      {lines &&
        lines.map(line => (
          <Line
            key={line.id}
            fromEl={line.from}
            toEl={line.to}
            options={line.options}
          />
        ))}

      <Grid item xs={12} data-testid="StatusGraph">
        <Paper square>
          <Grid
            container
            className={classes.container}
            alignItems="center"
            wrap="nowrap"
          >
            <Grid item className={classes.section}>
              <Grid container justifyContent="center" alignItems="center">
                <Step stepName="Started" ref={startRef} stepData={isStarted} />
              </Grid>
            </Grid>
            <Grid item className={classes.section}>
              <Grid container justifyContent="center" alignItems="center">
                <Step
                  stepName="Downloading Source"
                  ref={sourceRef}
                  stepData={stagesData[Stages.DOWNLOADING_SOURCE]}
                />
              </Grid>
            </Grid>
            <Grid item className={classes.section}>
              <Grid container justifyContent="center" alignItems="center">
                <Step
                  stepName="Image preparation"
                  ref={preparationRef}
                  stepData={stagesData[Stages.IMAGE_PREPARATION]}
                />
              </Grid>
            </Grid>

            {(Boolean(configuration.has_monitoring) ||
              Boolean(configuration.has_load_tests)) && (
              <Grid item className={classes.section}>
                <Grid container direction="column">
                  {Boolean(configuration.has_monitoring) && (
                    <Grid container justifyContent="center" alignItems="center">
                      <Step
                        stepName="Run Monitoring"
                        ref={monitoringRef}
                        stepData={stagesData[Stages.MONITORING]}
                      />
                    </Grid>
                  )}

                  {Boolean(configuration.has_load_tests) && (
                    <Grid container justifyContent="center" alignItems="center">
                      <Step
                        stepName="Run Tests"
                        ref={loadTestsRef}
                        stepData={stagesData[Stages.LOAD_TESTS]}
                      />
                    </Grid>
                  )}
                </Grid>
              </Grid>
            )}

            <Grid item className={classes.section}>
              <Grid container justifyContent="center" alignItems="center">
                <Step
                  stepName="Clean-up"
                  ref={cleanupRef}
                  stepData={stagesData[Stages.CLEAN_UP]}
                />
              </Grid>
            </Grid>

            <Grid item className={classes.section}>
              <Grid container justifyContent="center" alignItems="center">
                <Step
                  stepName="Finished"
                  ref={finishRef}
                  stepData={stagesData[Stages.FINISHED]}
                />
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </React.Fragment>
  )
}

export default StatusGraph
