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

const routes = {
  argo: {
    workflows: {
      details: 'https://argo.dev.bolt.acaisoft.io/workflows/argo/:argo_name',
    },
  },
  projects: {
    list: '/projects',
    details: '/projects/:projectId',
    compare: '/projects/:projectId/compare/:compareIdFirst/to/:compareIdSecond',
    sources: {
      list: '/projects/:projectId/sources',
      create: '/projects/:projectId/sources/create',
      edit: '/projects/:projectId/sources/:sourceId/edit',
      details: '/projects/:projectId/sources/:sourceId',
    },
    configurations: {
      list: '/projects/:projectId/configs',
      create: '/projects/:projectId/configs/create',
      edit: '/projects/:projectId/configs/:configurationId/edit',
      details: '/projects/:projectId/configs/:configurationId',
      executions: {
        list: '/projects/:projectId/configs/:configurationId/runs',
        details: '/projects/:projectId/configs/:configurationId/runs/:executionId',
        monitoring:
          '/projects/:projectId/configs/:configurationId/runs/:executionId/monitoring',
        endpoints: {
          details:
            '/projects/:projectId/configs/:configurationId/runs/:executionId/endpoint/:endpointId',
        },
      },
    },
    executions: {
      list: '/projects/:projectId/runs',
    },
  },
}

export default routes
