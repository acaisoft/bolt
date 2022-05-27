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

import { HttpLink, ApolloLink, Observable } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { onError } from '@apollo/client/link/error'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { setContext } from '@apollo/client/link/context'
import { createClient } from 'graphql-ws'

import Config from 'services/Config'

/*
 * Links
 */
export function makeErrorHandlingLink() {
  return onError(({ graphQLErrors, networkError, operation }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations = [], path = '' }) => {
        const parsedLocations = locations
          .map(l => `(${l.line}:${l.column})`)
          .join(',')

        console.log(
          `[GraphQL error] Error: ${message}`,
          parsedLocations && `, Locations: ${parsedLocations}`,
          path && `, Path: ${path}`,
          `\nFor operation: ${
            operation.operationName || '[no name]'
          } with variables: ${JSON.stringify(operation.variables)}`
        )
      })
    }

    if (networkError) {
      const { name, message, response, result } = networkError
      console.log(`[Network error] ${name}: ${message}`, { response, result })
    }
  })
}

export function makeRequestLink() {
  return new ApolloLink(
    (operation, forward) =>
      new Observable(observer => {
        let handle
        Promise.resolve(operation)
          .then(() => {
            handle = forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            })
          })
          .catch(observer.error.bind(observer))

        return () => {
          if (handle) {
            handle.unsubscribe()
          }
        }
      })
  )
}

export function makeTransportLinks({ getFreshToken, getToken }) {
  const wsLink = new GraphQLWsLink(
    createClient({
      url: Config.hasura.wsUri,
      lazy: true,
      retryAttempts: 3,
      connectionParams: async () => {
        const token = await (getFreshToken ? getFreshToken(20) : getToken())

        if (token) {
          return {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        }
      },
    })
  )

  const httpLink = new HttpLink({
    uri: Config.hasura.apiUri,
  })

  const authLink = setContext(async (operation, prevContext) => {
    const token = await getToken()

    if (token) {
      return {
        headers: {
          ...prevContext.headers,
          authorization: `Bearer ${token}`,
        },
      }
    }
  })

  return authLink.split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query)
      return kind === 'OperationDefinition' && operation === 'subscription'
    },
    wsLink,
    httpLink
  )
}
