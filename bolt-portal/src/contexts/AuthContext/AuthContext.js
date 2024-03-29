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

import { useContext } from 'react'
import { AuthServiceName } from 'config/constants'
import Config from 'services/Config'
import AuthKeycloak from 'services/AuthKeycloak'
import {
  AuthBoltContext,
  AuthKeycloakContext,
  AuthBoltProvider,
  AuthKeycloakProvider,
} from './providers'
import { Auth0Provider } from '@auth0/auth0-react'
import { AUTH_SERVICE, AUTH0_AUDIENCE, AUTH0_CLIENT_ID, AUTH0_DOMAIN } from "utils/values";

const keycloak = new AuthKeycloak(Config.keycloak)

export function AuthProvider({ children }) {
  const authService = process.env.REACT_APP_AUTH_SERVICE || AUTH_SERVICE || AuthServiceName.BOLT

  if (authService === AuthServiceName.KEYCLOAK)
    return <AuthKeycloakProvider client={keycloak}>{children}</AuthKeycloakProvider>
  if (authService === AuthServiceName.BOLT)
    return <AuthBoltProvider>{children}</AuthBoltProvider>
  if (authService === AuthServiceName.AUTH0) {
    console.log(AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_AUDIENCE, window.location.origin)
    return (
      <Auth0Provider
        domain={process.env.REACT_APP_AUTH0_DOMAIN || AUTH0_DOMAIN}
        clientId={process.env.REACT_APP_AUTH0_CLIENT_ID || AUTH0_CLIENT_ID}
        audience={process.env.REACT_APP_AUTH0_AUDIENCE || AUTH0_AUDIENCE}
        redirectUri={window.location.origin + '/projects'}
      >
        {children}
      </Auth0Provider>
    )
  }

  return <p>Auth provider {authService} not implemented</p>
}

export function useAuth() {
  const authService = process.env.REACT_APP_AUTH_SERVICE || AUTH_SERVICE || AuthServiceName.BOLT

  const authContext =
    authService === AuthServiceName.KEYCLOAK ? AuthKeycloakContext : AuthBoltContext
  const context = useContext(authContext)
  if (context === undefined) {
    throw new Error(`Auth provider ${authService} not implemented`)
  }

  return context
}
