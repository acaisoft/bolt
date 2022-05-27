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

import KeycloakClient from 'keycloak-js'

export default class AuthKeycloak {
  constructor(config) {
    this.client = KeycloakClient(config)

    this.getToken = this.getToken.bind(this)
    this.getFreshToken = this.getFreshToken.bind(this)
  }

  logInfo(...args) {
    console.info('[AuthKeycloak]', ...args)
  }

  logError(...args) {
    console.error('[AuthKeycloak]', ...args)
  }

  refreshToken(minValidity) {
    return new Promise((resolve, reject) => {
      this.client
        .updateToken(minValidity)
        .success(refreshed => {
          this.logInfo('Token updated. Refreshed?', refreshed)
          resolve()
        })
        .error(error => {
          this.logError('Token update failed. Error:', error)
          reject()
        })
    })
  }

  async getFreshToken(minValidity = 20) {
    await this.refreshToken(minValidity)
    return this.getToken()
  }

  getToken() {
    return this.client.token
  }

  getIsAuthenticated() {
    return this.client.authenticated
  }

  getUser() {
    return new Promise((resolve, reject) => {
      if (this.client.profile) {
        return resolve({
          id: this.client.subject,
          ...this.client.profile,
        })
      }

      this.client
        .loadUserProfile()
        .success(profile => {
          this.logInfo('Profile loaded')
          resolve({
            id: this.client.subject,
            ...profile,
          })
        })
        .error(() => {
          this.logError('Profile loading failed')
          // reject()
        })
    })
  }

  registerOnTokenExpired({
    minValidity,
    onSuccess = () => {},
    onError = () => {},
  } = {}) {
    this.client.onTokenExpired = () => {
      this.client
        .updateToken(minValidity)
        .success(refreshed => {
          if (refreshed) {
            this.logInfo('Token was successfully refreshed')
          } else {
            this.logInfo('Token is still valid')
          }
          onSuccess(refreshed)
        })
        .error(error => {
          this.logError(
            'Failed to refresh the token, or the session has expired',
            error
          )
          onError(error)
        })
    }
  }

  init({ onLoad = 'login-required', ...options } = {}) {
    return new Promise((resolve, reject) => {
      this.client
        .init({ onLoad, ...options })
        .success(authenticated => {
          this.logInfo('Initialized successfully. Authenticated?', authenticated)
          resolve(authenticated)
        })
        .error(error => {
          this.logError('Initialization error', error)
          reject(error)
        })
    })
  }

  logout(options) {
    return new Promise((resolve, reject) => {
      this.client
        .logout(options)
        .success(result => {
          this.logInfo('Logout successful', result)
          resolve(result)
        })
        .error(error => {
          this.logError('Logout failed', error)
          reject(error)
        })
    })
  }

  login(options) {
    return new Promise((resolve, reject) => {
      this.client
        .login(options)
        .success(result => {
          this.logInfo('Login successful', result)
          resolve(result)
        })
        .error(error => {
          this.logError('Login failed', error)
          reject(error)
        })
    })
  }
}
