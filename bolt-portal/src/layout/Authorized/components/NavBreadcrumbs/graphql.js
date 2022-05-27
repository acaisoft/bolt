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

import { gql } from '@apollo/client'

export const SUBSCRIBE_TO_PROJECTS = gql`
  subscription subscribeToProjectsForSelector {
    projects: project(
      where: { is_deleted: { _eq: false } }
      order_by: { name: asc }
    ) {
      id
      name
    }
  }
`
export const SUBSCRIBE_TO_SCENARIOS = gql`
  subscription subscribeToScenariosForSelector($projectId: uuid!) {
    configurations: configuration(
      where: { project_id: { _eq: $projectId }, is_deleted: { _eq: false } }
      order_by: { name: asc }
    ) {
      id
      name
    }
  }
`
export const SUBSCRIBE_TO_EXECUTIONS = gql`
  subscription subscribeToExecutionsForSelector($configurationId: uuid!) {
    executions: execution(
      where: { configuration_id: { _eq: $configurationId } }
      order_by: { start: desc, start_locust: desc }
    ) {
      id
      start
      start_locust
    }
  }
`
