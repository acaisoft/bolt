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

import LoginPage from './Login'
import { useAuth0 } from '@auth0/auth0-react'
import { useAuth } from 'contexts/AuthContext'
import { isAuth0AuthService } from '../config/constants'

export function Guest() {
  const { isAuthenticated: auth0IsAuthenticated } = useAuth0()
  const boltAuth = useAuth()
  const isAuthenticated = isAuth0AuthService
    ? auth0IsAuthenticated
    : boltAuth.hasToken

  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      {!isAuthenticated && (
        <Route path="*" element={<Navigate to="login" replace />} />
      )}
    </Routes>
  )
}

export default Guest
