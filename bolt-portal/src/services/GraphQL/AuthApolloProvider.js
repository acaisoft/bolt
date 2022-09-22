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

import React, { useEffect, useMemo } from 'react'
import {
  ApolloProvider,
  ApolloClient,
  ApolloLink,
  InMemoryCache,
} from '@apollo/client'
import { LocalStorageWrapper, persistCache } from 'apollo3-cache-persist'
import { useAuth } from 'contexts/AuthContext'
import jwtDecode from 'jwt-decode'
import {
  makeErrorHandlingLink,
  makeRequestLink,
  makeTransportLinks,
} from './handlers'
import { useAuth0 } from '@auth0/auth0-react'

const cache = new InMemoryCache()

function AuthApolloProvider({ children }) {
  const { getAccessTokenSilently, logout } = useAuth0()

  const getToken = async () => {
    let token = localStorage.getItem('AUTH_TOKEN')
    if (!token)
      token = await getAccessTokenSilently({
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      })
    try {
      localStorage.setItem('AUTH_TOKEN', token)
      const { exp: expires, given_name: firstName } = jwtDecode(token)
      const isExpired = Date.now() >= expires * 1000
      if (isExpired) return logout()

      return token
    } catch (e) {
      console.error(e)
      return logout()
    }
  }

  // I don't think that we need to put our cache results in local storage when we have apollo client devtools to inspect cache
  useEffect(() => {
    async function initCache() {
      await persistCache({
        cache,
        storage: new LocalStorageWrapper(window.localStorage),
      })
    }

    initCache()
  }, [])

  const client = useMemo(
    () =>
      new ApolloClient({
        link: ApolloLink.from([
          makeErrorHandlingLink(),
          makeRequestLink(),
          makeTransportLinks({
            undefined,
            getToken,
          }),
        ]),
        cache,
      }),
    [getAccessTokenSilently]
  )

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}

export default AuthApolloProvider
