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

import { useState, useCallback } from 'react'
import { useMutation } from '@apollo/client'
import {
  parseGraphqlResponseError,
  parseGraphqlException,
} from 'utils/errorHandling'

function useMutationWithState(mutationDoc, options) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const [rawMutation] = useMutation(mutationDoc, options)

  const mutation = useCallback(
    async mutationCallOptions => {
      setLoading(true)
      setError(null)

      let errorMessage = null
      let response
      try {
        response = await rawMutation(mutationCallOptions)
        errorMessage = parseGraphqlResponseError(response)
      } catch (ex) {
        errorMessage = parseGraphqlException(ex)
      }
      setData((response && response.data) || null)
      setError(errorMessage)
      setLoading(false)

      return { errorMessage, response }
    },
    [rawMutation]
  )

  return { loading, mutation, error, data }
}

export default useMutationWithState
