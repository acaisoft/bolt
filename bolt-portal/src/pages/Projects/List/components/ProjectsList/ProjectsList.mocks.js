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
import { GET_PROJECT_SUMMARIES } from './graphql'

export const mockedProjectsList = {
  summaries: {
    projects: [
      {
        id: 'f3e2db7e-20b7-43c7-a32c-a47f958a2647',
        name: 'project for developers',
        description: 'Dummy project for devs',
        image_url: null,
        num_scenarios: 10,
        num_sources: 4,
        num_tests_failed: 366,
        num_tests_passed: 1171,
      },
      {
        id: '83150c3c-239f-4bec-8d0e-973b96ca3c7a',
        name: 'AKS-eastus-kub02',
        description: null,
        image_url: null,
        num_scenarios: 0,
        num_sources: 0,
        num_tests_failed: 0,
        num_tests_passed: 0,
      },
      {
        id: '1e63ce59-87c1-4a7f-aaad-cb19a6e0211f',
        name: 'Event App',
        description: 'test project for load testing',
        image_url: null,
        num_scenarios: 6,
        num_sources: 1,
        num_tests_failed: 129429,
        num_tests_passed: 193054,
      },
      {
        id: '4544e188-be5f-4206-9dc3-f3f124b898c6',
        name: 'Sample load project',
        description: 'by artiom',
        image_url: null,
        num_scenarios: 6,
        num_sources: 1,
        num_tests_failed: 11025068,
        num_tests_passed: 1518794,
      },
      {
        id: 'bddffe85-1f54-46eb-ac31-b15589cceef0',
        name: 'RightPerson',
        description: 'RightPerson Customer and Candidate Flow',
        image_url: null,
        num_scenarios: 0,
        num_sources: 0,
        num_tests_failed: 0,
        num_tests_passed: 0,
      },
    ],
  },
}

export const projectsGraphqlMock = mockGraphqlData(
  GET_PROJECT_SUMMARIES,
  mockedProjectsList
)
