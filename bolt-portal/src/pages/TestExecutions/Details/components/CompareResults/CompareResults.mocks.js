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

import { mockGraphqlData } from 'utils/tests/mocks'
import { SUBSCRIBE_TO_EXECUTIONS_LIST, SUBSCRIBE_TO_SCENARIOS_LIST } from './graphql'

export const mockedConfigurationsList = {
  configurations: [
    {
      id: '01c5b2c8-a5ea-44f8-8f74-d4813042b22c',
      name: '[DEPRECETED] Thread Likes Load Tenant 6000users 100min 1000max',
      executions: [
        {
          id: '8621971c-1125-48a7-8610-5d08a2ef4bee',
        },
        {
          id: '17df38d1-9c2f-4dbc-8c2f-38865dc47ca4',
        },
      ],
    },
    {
      id: '0472c646-f416-4415-96ef-e15fad27a948',
      name: '1k users scenario',
      executions: [
        {
          id: '874a2df1-c245-4253-b05a-c0befdf1046c',
        },
      ],
    },
    {
      id: '05a9c96e-2dac-437c-b360-d565f665d956',
      name: 'JPG File: 120s Interval, 30k Users, without pulling FAST RAMPUP',
      executions: [],
    },
    {
      id: '05fc95da-b1f7-4474-8f77-390eaf686633',
      name: 'Monitoring test',
      executions: [
        {
          id: '14bd689b-ca78-4ea0-b788-a48a63b87af3',
        },
      ],
    },
    {
      id: '06f09a65-ee8d-43b9-a80b-97e5fd9f7370',
      name: '_Benchmark scenario (only POST image) (Cloned at 07/09/2020 - 16:00:21)',
      executions: [],
    },
    {
      id: '072043cf-3ce5-4e3e-ac83-89f68a44ffbb',
      name: 'Basic Scenario [deprecated]',
      executions: [
        {
          id: '313fe219-9a45-40b3-b797-abd341f5e531',
        },
      ],
    },
    {
      id: '0903dc53-c30c-4562-ab6f-631e81f2718f',
      name: '10k user scenario with monitoring',
      executions: [
        {
          id: 'bb14ddf1-58cc-4233-9b6c-cd8547c6f1b5',
        },
      ],
    },
  ],
}

export const mockedHideConfigList = {
  configurations: [
    {
      id: '01c5b2c8-a5ea-44f8-8f74-d4813042b22c',
      name: '[DEPRECETED] Thread Likes Load Tenant 6000users 100min 1000max',
      executions: [
        {
          id: '8621971c-1125-48a7-8610-5d08a2ef4bee',
        },
      ],
    },
    {
      id: '0472c646-f416-4415-96ef-e15fad27a948',
      name: '1k users scenario',
      executions: [
        {
          id: '874a2df1-c245-4253-b05a-c0befdf1046c',
        },
      ],
    },
  ],
}

export const mockedExecutionsList = {
  executions: [
    {
      id: '8621971c-1125-48a7-8610-5d08a2ef4bee',
      start: '2020-09-03T23:32:35.904451+00:00',
    },
    {
      id: 'd507a904-419e-4b13-9475-ea17c1eb691e',
      start: '2020-09-03T20:46:59.99839+00:00',
    },
    {
      id: 'dadc4233-fa9b-4add-a439-fb599abce7f5',
      start: '2020-09-03T19:34:50.417503+00:00',
    },
  ],
}

export const projectId = '83150c3c-239f-4bec-8d0e-973b96ca3c7a'
export const configurationId = '01c5b2c8-a5ea-44f8-8f74-d4813042b22c'
export const executionId = '8621971c-1125-48a7-8610-5d08a2ef4bee'

export const configurationsListMock = mockGraphqlData(
  SUBSCRIBE_TO_SCENARIOS_LIST,
  mockedConfigurationsList,
  {
    order_by: [{ id: 'asc' }],
    projectId: '83150c3c-239f-4bec-8d0e-973b96ca3c7a',
  }
)

export const hideConfigMock = mockGraphqlData(
  SUBSCRIBE_TO_SCENARIOS_LIST,
  mockedHideConfigList,
  {
    order_by: [{ id: 'asc' }],
    projectId: '83150c3c-239f-4bec-8d0e-973b96ca3c7a',
  }
)

export const executionsListMock = mockGraphqlData(
  SUBSCRIBE_TO_EXECUTIONS_LIST,
  mockedExecutionsList,
  {
    configurationId,
  }
)
