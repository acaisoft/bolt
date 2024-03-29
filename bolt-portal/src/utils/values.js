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

const getValue = (name) => {
  return window.bolt_values?.[name]
}

const REACT_APP_API_SERVICE_BASE_URL = getValue('REACT_APP_API_SERVICE_BASE_URL')
const HASURA_API_URL = getValue('REACT_APP_HASURA_API_URL')
const HASURA_WS_URL = getValue('REACT_APP_HASURA_WS_URL')
const AUTH_SERVICE = getValue('REACT_APP_AUTH_SERVICE')
const ARGO_URL = getValue('REACT_APP_ARGO_URL')
const AUTH0_AUDIENCE = getValue('REACT_APP_AUTH0_AUDIENCE')
const AUTH0_CLIENT_ID = getValue('REACT_APP_AUTH0_CLIENT_ID')
const AUTH0_DOMAIN = getValue('REACT_APP_AUTH0_DOMAIN')

export  {
  REACT_APP_API_SERVICE_BASE_URL,
  HASURA_API_URL,
  HASURA_WS_URL,
  AUTH_SERVICE,
  ARGO_URL,
  AUTH0_AUDIENCE,
  AUTH0_CLIENT_ID,
  AUTH0_DOMAIN
}
