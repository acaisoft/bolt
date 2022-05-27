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

export class Config {
  constructor() {
    this.stage = process.env.REACT_APP_STAGE || ''
    this.version = process.env.REACT_APP_VERSION
    this.env = process.env.NODE_ENV
    // Include all possible keys for better IntelliSense in IDEs
    this.keycloak = {
      url: process.env.REACT_APP_KEYCLOAK_URL || 'https://localhost:7000/auth',
      realm: 'Bolt',
      clientId: 'bolt-portal',
    }
    this.hasura = {
      wsUri: process.env.REACT_APP_HASURA_WS_URL || 'ws://localhost:8080/v1alpha1/graphql',
      apiUri: process.env.REACT_APP_HASURA_API_URL || 'http://localhost:8080/v1alpha1/graphql',
    }

    // switch (this.stage.toLowerCase()) {
    //   case 'prod':
    //     this.hasura = {
    //       ...this.hasura,
    //       wsUri: 'wss://hasura.bolt.acaisoft.io/v1alpha1/graphql',
    //       apiUri: 'https://hasura.bolt.acaisoft.io/v1alpha1/graphql',
    //     }
    //     this.keycloak = {
    //       ...this.keycloak,
    //       url: 'https://keycloak.bolt.acaisoft.io/auth',
    //     }
    //     break
    //   case 'stage':
    //     this.hasura = {
    //       ...this.hasura,
    //       wsUri: 'wss://www.hasura.dev.bolt.acaisoft.io/v1alpha1/graphql',
    //       apiUri: 'https://www.hasura.dev.bolt.acaisoft.io/v1alpha1/graphql',
    //     }
    //     this.keycloak = {
    //       ...this.keycloak,
    //       url: 'https://keycloak.dev.bolt.acaisoft.io/auth',
    //     }
    //     break
    //   case 'dev-lite':
    //     this.hasura = {
    //       ...this.hasura,
    //       wsUri: 'wss://hasura.dev-lite.bolt.acaisoft.io/v1alpha1/graphql',
    //       apiUri: 'https://hasura.dev-lite.bolt.acaisoft.io/v1alpha1/graphql',
    //     }
    //     this.keycloak = {
    //       ...this.keycloak,
    //       url: 'https://keycloak.dev.bolt.acaisoft.io/auth',
    //     }
    //     break
    //   default:
    //     this.hasura = {
    //       ...this.hasura,
    //       wsUri: 'ws://localhost:8080/v1alpha1/graphql',
    //       apiUri: 'http://localhost:8080/v1alpha1/graphql',
    //     }
    //     this.keycloak = {
    //       ...this.keycloak,
    //       url: 'https://keycloak.dev.bolt.acaisoft.io/auth',
    //     }
    // }

    console.info('APP INFO', {
      stage: this.stage,
      version: `${this.env}-${this.version}`,
      env: process.env,
    })
  }
}

export default new Config()
