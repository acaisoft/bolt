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

import React, { useEffect, useState, useMemo, createContext } from 'react'

const AuthKeycloakContext = createContext(null)
const { Provider } = AuthKeycloakContext

function StatefulProvider({ children, client }) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [shouldSync, setShouldSync] = useState(false)

  const [state, setState] = useState({
    isAuthenticated: false,
    token: null,
    user: null,
  })

  // Initial setup
  useEffect(() => {
    client.registerOnTokenExpired({
      minValidity: -1, // Force instant token refresh
      onSuccess: refreshed => {
        if (refreshed) {
          setShouldSync(true)
        }
      },
      onError: () => {
        setShouldSync(true)
      },
    })

    // useEffect callback cannot be async, but the function inside can.
    // We fire it only once anyway.
    async function initializeClient() {
      await client.init()
      setShouldSync(true)
    }

    initializeClient()
  }, [client])

  // Synchronize client state when necessary
  useEffect(() => {
    if (shouldSync) {
      async function synchronize() {
        setState({
          isAuthenticated: client.getIsAuthenticated(),
          token: await client.getToken(),
          user: await client.getUser(),
        })
        setShouldSync(false)
        setIsInitialized(true)
      }

      synchronize()
    }
  }, [client, shouldSync])

  // Save the current auth state and pass it to the consumers.
  // Memoize to avoid unnecessary re-renders of the whole app.
  const context = useMemo(() => {
    async function login(...args) {
      await client.login(...args)
      setShouldSync(true)
    }

    async function logout(...args) {
      await client.logout(...args)
      setShouldSync(true)
    }

    return {
      isSyncing: shouldSync,
      isInitialized,
      login,
      logout,
      getToken: client.getToken,
      getFreshToken: client.getFreshToken,
      hasToken: !!client.getToken(),
      ...state,
    }
  }, [shouldSync, isInitialized, client, state])

  return <Provider value={context}>{children}</Provider>
}

export { AuthKeycloakContext, StatefulProvider as AuthKeycloakProvider }
