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

import { useCallback, useState } from 'react'
import { TestSourceType } from 'config/constants'
import { useMutationWithState } from 'hooks'
import {
  ADD_REPOSITORY_MUTATION,
  ADD_REPOSITORY_VALIDATE_MUTATION,
  EDIT_REPOSITORY_MUTATION,
  EDIT_REPOSITORY_VALIDATE_MUTATION,
} from './graphql'
import { preparePayload } from './formSchema'

const testPerformedErrorMessage =
  'cannot change type_slug, a test has been performed using this repository'

export function useConnectionTest({ mode, projectId, sourceId, onTestConnection }) {
  const [connectionError, setConnectionError] = useState(null)
  const [testPerformed, setTestPerformed] = useState(false)
  const [isConnectionOk, setIsConnectionOk] = useState(false)
  const [isTestingConnection, setIsTestingConnection] = useState(false)

  const { mutation: validateRepositoryMutation } = useMutationWithState(
    mode === 'create'
      ? ADD_REPOSITORY_VALIDATE_MUTATION
      : EDIT_REPOSITORY_VALIDATE_MUTATION
  )

  // TODO: validateTestCreatorMutation

  const handleConnectionTest = useCallback(
    async values => {
      setIsTestingConnection(true)
      setIsConnectionOk(false)
      setConnectionError(null)
      const variables = preparePayload(values, {
        mode,
        projectId,
        sourceId,
        testPerformed,
      })

      const { errorMessage } =
        values.source_type === TestSourceType.REPOSITORY
          ? await validateRepositoryMutation({ variables })
          : {} // TODO: validateTestCreatorMutation

      setIsTestingConnection(false)

      if (
        errorMessage === testPerformedErrorMessage &&
        mode === 'edit' &&
        !testPerformed
      ) {
        setTestPerformed(true)
      } else {
        setConnectionError(errorMessage || null)
      }

      setIsConnectionOk(!errorMessage)

      onTestConnection({ variables, errorMessage })
    },
    [
      validateRepositoryMutation,
      mode,
      sourceId,
      projectId,
      onTestConnection,
      testPerformed,
    ]
  )

  return {
    isConnectionOk,
    connectionError,
    isTestingConnection,
    handleConnectionTest,
    testPerformed,
    setIsConnectionOk,
  }
}

export function useTestSourceSubmit({
  mode,
  sourceId,
  projectId,
  onSubmit,
  testPerformed,
}) {
  const { mutation: submitRepositoryMutation } = useMutationWithState(
    mode === 'create' ? ADD_REPOSITORY_MUTATION : EDIT_REPOSITORY_MUTATION,
    {
      refetchQueries: ['getTestSources'],
    }
  )

  // TODO: submitTestCreatorMutation

  const handleSubmit = useCallback(
    async values => {
      const variables = preparePayload(values, {
        mode,
        projectId,
        sourceId,
        testPerformed,
      })

      const { errorMessage } =
        values.source_type === TestSourceType.REPOSITORY
          ? await submitRepositoryMutation({ variables })
          : {} // TODO: submitTestCreatorMutation

      onSubmit({ values, errorMessage })
    },
    [submitRepositoryMutation, mode, sourceId, projectId, onSubmit, testPerformed]
  )

  return handleSubmit
}
