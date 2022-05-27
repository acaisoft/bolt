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

export const TestSourceType = {
  REPOSITORY: 'repository',
  TEST_CREATOR: 'test_creator',
}

export const Chart = {
  HEIGHT: 400,
}

export const TestRunStatus = {
  PENDING: 'PENDING',
  RUNNING: 'RUNNING',
  FINISHED: 'FINISHED',
  SUCCEEDED: 'SUCCEEDED',
  TERMINATED: 'TERMINATED',
  ERROR: 'ERROR',
  MONITORING: 'MONITORING',
  UNKNOWN: 'UNKNOWN',
  FAILED: 'FAILED',
}

export const TestRunStageStatus = {
  NOT_STARTED: 'NOT_STARTED',
  FAILED: 'FAILED',
  PENDING: 'PENDING',
  RUNNING: 'RUNNING',
  SUCCEEDED: 'SUCCEEDED',
  TERMINATED: 'TERMINATED',
  ERROR: 'ERROR',
  FINISHED: 'FINISHED',
}

export const AUTH_TOKEN_NAME = 'AUTH_TOKEN'

export const AuthServiceName = {
  KEYCLOAK: 'keycloak',
  BOLT: 'bolt',
}
