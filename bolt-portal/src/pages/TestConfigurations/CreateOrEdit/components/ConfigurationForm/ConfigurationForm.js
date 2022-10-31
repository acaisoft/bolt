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

import React, { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { Form } from 'react-final-form'
import { FormValue } from 'containers'
import arrayMutators from 'final-form-arrays'
import { SectionHeader, Loader, Button } from 'components'
import {
  makeEmptyInitialValues,
  validateForm,
  makeFlatValidationSchema,
} from 'utils/forms'
import { GET_CONFIGURATION } from './graphql'
import { useFormSchema, prepareInitialValues, preparePayload } from './formSchema'
import { useExternalFormSchema, prepareExternalPayload } from './externalFormSchema'
import ConfigurationTypeFields from './ConfigurarionTypeFields'
import ScenarioFields from './ScenarioFields'
import { useConfigurationSubmit } from './ConfigurationForm.utils'
import MonitoringFields from './MonitoringFields'
import useStyles from './ConfigurationForm.styles'

export function ConfigurationForm(
  { onCancel = () => {}, onSubmit = () => {} },
  props
) {
  const { configurationId, projectId } = useParams()
  const mode = configurationId ? 'edit' : 'create'
  const classes = useStyles()

  const { data: { configuration } = {}, loading: configurationLoading } = useQuery(
    GET_CONFIGURATION,
    {
      fetchPolicy: 'cache-and-network',
      variables: { configurationId },
      skip: mode !== 'edit',
    }
  )

  const [isExternalScenario, setIsExternalScenario] = useState(false)
  const [isMonitoring, setIsMonitoring] = useState(false)

  const { fields, loading: fieldsLoading } = useFormSchema({ projectId })
  const { fields: externalFields, loading: externalFieldsLoading } =
    useExternalFormSchema()

  const handleSubmit = useConfigurationSubmit({
    configurationId,
    projectId,
    mode,
    isMonitoring,
    preparePayload: isExternalScenario ? prepareExternalPayload : preparePayload,
    onSubmit,
  })

  const handleValidate = useCallback(
    values =>
      validateForm(
        values,
        makeFlatValidationSchema(isExternalScenario ? externalFields : fields)
      ),
    [fields, externalFields, isExternalScenario]
  )
  const initialValues = useMemo(
    () => makeEmptyInitialValues(fields, prepareInitialValues(configuration)),
    [fields, configuration]
  )
  React.useEffect(() => {
    if (configuration?.configuration_monitorings[0]) {
      setIsMonitoring(true)
    }
  }, [configuration])

  if (fieldsLoading || configurationLoading || externalFieldsLoading) {
    return <Loader loading />
  }
  return (
    <Form
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validate={handleValidate}
      mutators={{ ...arrayMutators }}
      subscription={{ submitting: true, dirty: true, invalid: true }}
      keepDirtyOnReinitialize
    >
      {form => (
        <form data-testid="ConfigurationForm" onSubmit={form.handleSubmit}>
          <SectionHeader
            title={mode === 'create' ? 'New Scenario' : 'Update Scenario'}
            alignItems="flex-start"
            marginBottom
          >
            <Button
              data-testid="scenario-form-cancel"
              color="default"
              variant="text"
              disabled={form.isSubmitting}
              onClick={onCancel}
              className={classes.button}
            >
              Cancel
            </Button>
            <Button
              data-testid="scenario-form-submit"
              color="secondary"
              variant="contained"
              type="submit"
              disabled={!form.dirty || form.isSubmitting || form.invalid}
              className={classes.button}
            >
              {mode === 'create' ? 'Create' : 'Update'}
            </Button>
          </SectionHeader>
          <FormValue name="configuration_type">
            {configurationType => (
              <ScenarioFields
                fields={isExternalScenario ? externalFields : fields}
                configurationType={configurationType}
                externalConfigurationHook={setIsExternalScenario}
              />
            )}
          </FormValue>
          {/* TODO: uncomment when scenario parts section will be needed */}
          {/*<ScenarioPartsFields fields={fields} />*/}
          <ConfigurationTypeFields fields={fields} configuration={configuration} />
          <MonitoringFields
            key="monitoringFields"
            setIsMonitoring={setIsMonitoring}
            isMonitoring={isMonitoring}
          />
        </form>
      )}
    </Form>
  )
}

ConfigurationForm.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
}

export default ConfigurationForm
