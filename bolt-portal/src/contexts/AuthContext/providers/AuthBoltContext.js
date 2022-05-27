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

import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import { AUTH_TOKEN_NAME } from 'config/constants'
import { redirectToExternalLoginPage } from 'utils/router'

const AuthBoltContext = createContext(null)

const fetchToken = async logout => {
  return await axios
    .get(`${process.env.REACT_APP_AUTH_SERVICE_BASE_URL}/session`, {
      withCredentials: true,
    })
    .then(({ data }) => data)
    .catch(() => logout())
}

const requestToken = async logout => {
  const resp = await fetchToken(logout)
  if (!resp?.AUTH_TOKEN) return logout()

  const token = resp?.AUTH_TOKEN
  localStorage.setItem(AUTH_TOKEN_NAME, token)

  return token
}

function AuthBoltProvider({ children }) {
  const [hasToken, setHasToken] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_NAME)
    return redirectToExternalLoginPage()
  }, [])

  const getToken = useCallback(async () => {
    let token = localStorage.getItem(AUTH_TOKEN_NAME)
    if (!token) token = await requestToken(logout)
    setHasToken(true)

    try {
      const { exp: expires, given_name: firstName } = jwtDecode(token)
      const isExpired = Date.now() >= expires * 1000
      if (isExpired) return logout()

      setIsAuthenticated(true)
      setUser({ firstName })
      setIsInitialized(true)

      return token
    } catch (e) {
      console.error(e)
      return logout()
    }
  }, [logout])

  useEffect(() => {
    async function initAuth() {
      await getToken()
    }

    initAuth()
  }, [getToken])

  const context = useMemo(
    () => ({
      getToken,
      logout,
      user,
      isAuthenticated,
      isInitialized,
      hasToken,
    }),
    [getToken, logout, user, isAuthenticated, isInitialized, hasToken]
  )

  return (
    <AuthBoltContext.Provider value={context}>{children}</AuthBoltContext.Provider>
  )
}

export { AuthBoltContext, AuthBoltProvider }
