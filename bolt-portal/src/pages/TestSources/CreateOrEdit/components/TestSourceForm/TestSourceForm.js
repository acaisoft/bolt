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

import React, { useCallback, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'

import { useQuery } from '@apollo/client'
import { Form } from 'react-final-form'
import { Grid, MenuItem, FormHelperText } from '@material-ui/core'
import { Add, VpnKey } from '@material-ui/icons'
import { FormField, FormCondition } from 'containers'
import {
  SectionHeader,
  Button,
  CopyToClipboard,
  Loader,
  ButtonWithState,
} from 'components'

import { TestSourceType } from 'config/constants'
import { useToggle } from 'hooks'
import {
  makeEmptyInitialValues,
  makeFlatValidationSchema,
  validateForm,
} from 'utils/forms'

import { GET_REPOSITORY_KEY, GET_TEST_SOURCE } from './graphql'
import { useFormSchema, prepareInitialValues } from './formSchema'
import { useConnectionTest, useTestSourceSubmit } from './TestSourceForm.utils'
import useStyles from './TestSourceForm.styles'

function TestSourceForm({ onCancel, onSubmit, onTestConnection = () => {} }) {
  const classes = useStyles()
  const { sourceId, projectId } = useParams()
  const mode = sourceId ? 'edit' : 'create'
  const [isKeyVisible, toggleKeyInput] = useToggle(false)

  const { data: { repositoryKey } = {}, loading: repositoryKeyLoading } = useQuery(
    GET_REPOSITORY_KEY,
    {
      fetchPolicy: 'cache-first',
    }
  )

  const { data: { testSource } = {}, loading: testSourceLoading } = useQuery(
    GET_TEST_SOURCE,
    {
      fetchPolicy: 'cache-and-network',
      variables: { sourceId },
      skip: mode !== 'edit',
    }
  )

  const { fields, loading: fieldsLoading } = useFormSchema({ mode })

  const {
    isConnectionOk,
    connectionError,
    isTestingConnection,
    handleConnectionTest,
    testPerformed,
    setIsConnectionOk,
  } = useConnectionTest({ mode, projectId, sourceId, onTestConnection })

  const handleSubmit = useTestSourceSubmit({
    sourceId,
    projectId,
    mode,
    onSubmit,
    testPerformed,
  })

  const handleValidate = useCallback(
    values => validateForm(values, makeFlatValidationSchema(fields)),
    [fields]
  )

  const initialValues = useMemo(
    () => makeEmptyInitialValues(fields, prepareInitialValues(testSource)),
    [fields, testSource]
  )

  useEffect(() => {
    if (mode === 'edit') {
      handleConnectionTest(initialValues)
    }
  }, [])

  if (repositoryKeyLoading || testSourceLoading || fieldsLoading) {
    return <Loader loading />
  }

  const repositoryFields = fields.repository.fields

  return (
    <Form
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validate={handleValidate}
      subscription={{
        submitting: true,
        dirty: true,
        invalid: true,
        dirtySinceLastSubmit: true,
        validating: true,
      }}
      keepDirtyOnReinitialize
    >
      {form => (
        <React.Fragment>
          <SectionHeader title="Test Source">
            <Button
              color="default"
              variant="text"
              disabled={form.submitting}
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              className={classes.marginLeft}
              color="secondary"
              variant="contained"
              disabled={
                !isConnectionOk ||
                !form.dirty ||
                form.submitting ||
                form.validating ||
                form.invalid ||
                form.dirtySinceLastSubmit
              }
              icon={Add}
              onClick={form.handleSubmit}
              type="submit"
            >
              {mode === 'create' ? 'Create' : 'Update'}
            </Button>
          </SectionHeader>

          <form data-testid="TestSourceForm" onSubmit={form.handleSubmit}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <FormField
                  aria-label="source type select"
                  name="source_type"
                  field={fields.source_type}
                  margin="normal"
                  variant="filled"
                  fullWidth
                  // TODO: remove disable prop when TEST_CREATOR will be available
                  disabled
                >
                  {fields.source_type.options.map(type => (
                    <MenuItem
                      key={type.key}
                      value={type.value}
                      disabled={type.value === TestSourceType.TEST_CREATOR}
                    >
                      {type.label}
                    </MenuItem>
                  ))}
                </FormField>
              </Grid>
              <Grid item xs={12} md={6} />

              <FormCondition when="source_type" is={TestSourceType.REPOSITORY}>
                <Grid item xs={12} md={6}>
                  <FormField
                    aria-label="repository type select"
                    name="repository.type_slug"
                    field={repositoryFields.type_slug}
                    margin="normal"
                    variant="filled"
                    fullWidth
                    // TODO: remove disabled prop when more options will be added
                    disabled
                  >
                    {repositoryFields.type_slug.options.map(type => (
                      <MenuItem key={type.key} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </FormField>
                </Grid>
                <Grid item xs={12} md={6} />
                <Grid item xs={12} md={6}>
                  <FormField
                    id="repository.name"
                    name="repository.name"
                    field={repositoryFields.name}
                    margin="normal"
                    variant="filled"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} />
                <Grid item xs={12} md={6}>
                  <FormField
                    id="repository.url"
                    name="repository.url"
                    field={repositoryFields.url}
                    margin="normal"
                    variant="filled"
                    fullWidth
                    disabled={testPerformed}
                    parse={value => {
                      setIsConnectionOk(false)
                      return value
                    }}
                  />
                  <div>
                    {testPerformed && (
                      <FormHelperText>
                        You cannot change repository url - a test has been performed
                        using this repository
                      </FormHelperText>
                    )}
                    {isKeyVisible && (
                      <CopyToClipboard
                        text={repositoryKey || ''}
                        label="Repository Key"
                        margin="normal"
                        variant="filled"
                        multiline
                        fullWidth
                      />
                    )}
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={() => toggleKeyInput()}
                      icon={VpnKey}
                    >
                      {isKeyVisible ? 'Hide' : 'Show'} Key
                    </Button>
                    <ButtonWithState
                      color="primary"
                      variant="contained"
                      disabled={form.invalid || isTestingConnection}
                      onClick={() =>
                        handleConnectionTest(form.form.getState().values)
                      }
                      className={classes.marginLeft}
                      loading={isTestingConnection}
                      success={isConnectionOk}
                      error={Boolean(connectionError)}
                    >
                      Test Connection
                    </ButtonWithState>
                    {Boolean(connectionError) && (
                      <FormHelperText error>
                        Connection error: {connectionError}
                      </FormHelperText>
                    )}
                  </div>
                </Grid>
              </FormCondition>
            </Grid>
          </form>
        </React.Fragment>
      )}
    </Form>
  )
}

TestSourceForm.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  onTestConnection: PropTypes.func,
}

export default TestSourceForm
