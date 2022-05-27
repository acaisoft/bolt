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

import TestExecutionsPage from 'pages/TestExecutions'
import ListPage from './List'
import DetailsPage from './Details'
import CreateOrEditPage from './CreateOrEdit'

export function TestConfigurations() {
  return (
    <Routes>
      <Route index element={<ListPage />} />
      <Route path="create" element={<CreateOrEditPage />} />
      <Route path=":configurationId/*" element={<ConfigurationSubpages />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function ConfigurationSubpages() {
  return (
    <Routes>
      <Route index element={<DetailsPage />} />
      <Route path="edit" element={<CreateOrEditPage />} />
      <Route path="runs/*" element={<TestExecutionsPage />} />
    </Routes>
  )
}

export default TestConfigurations
