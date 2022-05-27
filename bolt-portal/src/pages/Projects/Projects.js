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
import { Navigate, Route, Routes } from 'react-router-dom'
import TestConfigurationsPage from 'pages/TestConfigurations'
import TestExecutionsPage from 'pages/TestExecutions'
import TestSourcesPage from 'pages/TestSources'
import TestsCompare from 'pages/TestsCompare'
import ListPage from './List'
// import DetailsPage from './Details'

export function Projects() {
  return (
    <Routes>
      <Route index element={<ListPage />} />
      <Route path=":projectId/*" element={<ProjectSubpages />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export function ProjectSubpages() {
  return (
    <Routes>
      {/* <Route exact path="/" element={DetailsPage} /> */}
      <Route path="runs/*" element={<TestExecutionsPage />} />
      <Route path="sources/*" element={<TestSourcesPage />} />
      <Route path="configs/*" element={<TestConfigurationsPage />} />
      <Route
        path="compare/:compareIdFirst/to/:compareIdSecond"
        element={<TestsCompare />}
      />
      <Route path="*" element={<Navigate to="configs" replace />} />
    </Routes>
  )
}

export default Projects
