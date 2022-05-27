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
import { useParams } from 'react-router-dom'
import { useSubscription } from '@apollo/client'
import { Box, Grid } from '@material-ui/core'
import {
  LoadingPlaceholder,
  ErrorPlaceholder,
  NotFoundPlaceholder,
  SectionHeader,
} from 'components'
import { TestDetails } from './components'
import { SUBSCRIBE_TO_EXECUTION_DETAILS } from './graphql'
import useStyles from './TestsCompare.styles'

function TestsCompare() {
  const classes = useStyles()
  const { compareIdFirst, compareIdSecond } = useParams()

  const {
    data: { execution } = {},
    loading,
    error,
  } = useSubscription(SUBSCRIBE_TO_EXECUTION_DETAILS, {
    variables: {
      executionId: compareIdFirst,
    },
    fetchPolicy: 'cache-and-network',
  })

  const {
    data: { execution: compareExecution } = {},
    loading: compareLoading,
    error: compareError,
  } = useSubscription(SUBSCRIBE_TO_EXECUTION_DETAILS, {
    variables: {
      executionId: compareIdSecond,
    },
    fetchPolicy: 'cache-and-network',
  })

  if (
    loading ||
    compareLoading ||
    error ||
    compareError ||
    !execution ||
    !compareExecution
  ) {
    return (
      <Box p={3}>
        {loading || compareLoading ? (
          <LoadingPlaceholder title="Loading data to compare..." />
        ) : error || compareError ? (
          <ErrorPlaceholder error={error || compareError} />
        ) : (
          <NotFoundPlaceholder title="Sufficient compare data not found" />
        )}
      </Box>
    )
  }

  return (
    <>
      <SectionHeader
        className={classes.title}
        size="large"
        title="Test Runs Comparison"
      />

      <Grid container spacing={2}>
        <Grid item xs={12} lg={6}>
          <TestDetails titleStart="Test no. 1: " execution={execution} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <TestDetails titleStart="Test no. 2: " execution={compareExecution} />
        </Grid>
      </Grid>
    </>
  )
}

export default TestsCompare
