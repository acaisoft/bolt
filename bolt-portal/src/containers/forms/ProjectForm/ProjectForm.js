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

import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Mutation } from '@apollo/client/react/components'
import { Form } from 'react-final-form'

import { createFormConfig } from './formSchema'
import { validateForm, mutators } from 'utils/forms'
import { ADD_PROJECT, EDIT_PROJECT } from './graphql'
import { useNotification } from 'hooks'

export function ProjectForm({
  children,
  initialValues,
  mode = 'create',
  onSubmit = () => {},
  onCancel = () => {},
}) {
  const notify = useNotification()

  const handleSubmit = useCallback(
    async (values, { projectMutation }) => {
      const { id, name, description } = values

      try {
        await projectMutation({
          variables: {
            id: mode === 'create' ? undefined : id,
            name,
            description,
          },
        })
        onSubmit(values)
      } catch (err) {
        notify.error(err.message)
      }
    },
    [mode, notify, onSubmit]
  )

  const formConfig = useMemo(() => createFormConfig(), [])

  return (
    <Mutation
      mutation={mode === 'create' ? ADD_PROJECT : EDIT_PROJECT}
      refetchQueries={['getProjectCards']}
    >
      {(projectMutation, { data }) => (
        <Form
          initialValues={initialValues}
          mutators={{ ...mutators }}
          onSubmit={values => handleSubmit(values, { projectMutation })}
          validate={validateForm(formConfig.validationSchema)}
        >
          {form => children({ form, fields: formConfig.fields })}
        </Form>
      )}
    </Mutation>
  )
}

ProjectForm.propTypes = {
  initialValues: PropTypes.object,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  mode: PropTypes.oneOf(['create', 'edit']),
}

export default ProjectForm
