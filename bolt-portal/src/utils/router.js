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

import { generatePath } from 'react-router-dom'

export const getUrl = (path, params) => generatePath(path, params)

export const getSubpageUrl = (match, relativePath, params = {}) => {
  return generatePath(`${match.path}${relativePath}`, {
    ...match.params,
    ...params,
  })
}

export const getParentUrl = (url, steps = 1) =>
  url.split('/').slice(0, -steps).join('/')

export const redirectToExternalLoginPage = (fromUrl = window.location.href) => {
  window.location.href = `${process.env.REACT_APP_AUTH_SERVICE_BASE_URL}/login?redirect_url=${fromUrl}`
  return null
}
