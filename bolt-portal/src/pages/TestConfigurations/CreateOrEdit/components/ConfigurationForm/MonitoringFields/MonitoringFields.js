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
import {
  Grid,
  MenuItem,
  Checkbox,
  FormControlLabel,
  IconButton,
} from '@material-ui/core'
import { FieldArray } from 'react-final-form-arrays'
import { useForm } from 'react-final-form'
import { Add, Delete } from '@material-ui/icons'
import { FormField } from 'containers'
import { Button } from 'components'
import {
  composeValidators,
  requireWhenOtherIsSet,
  uniqueInArray,
  requireWhenCondition,
  validatePrometheusUrl,
} from 'utils/forms'

function MonitoringFields({ isMonitoring, setIsMonitoring }) {
  const { mutators } = useForm()

  const chartTypes = [{ value: 'line_chart', label: 'Line Chart' }]
  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            onChange={event => setIsMonitoring(event.target.checked)}
            checked={isMonitoring}
          />
        }
        label="Monitoring"
      />
      {isMonitoring && (
        <>
          <Grid container spacing={4}>
            <Grid item xs={5}>
              <FormField
                data-testid="prometheus_url"
                id="prometheus_url"
                name="prometheus_url"
                field={{ inputProps: { label: 'Prometheus Url' } }}
                variant="filled"
                fullWidth
                validate={composeValidators(
                  requireWhenCondition(isMonitoring),
                  validatePrometheusUrl()
                )}
              />
            </Grid>
          </Grid>
          <FieldArray name="configuration_monitorings">
            {({ fields: arrayFields }) => (
              <Grid container spacing={4}>
                {arrayFields.map((name, index) => (
                  <>
                    <Grid item xs={5} key={name}>
                      <FormField
                        data-testid="query"
                        id="query"
                        name={`${name}.query`}
                        field={{ inputProps: { label: 'Query' } }}
                        fullWidth
                        variant="filled"
                        validate={composeValidators(
                          requireWhenOtherIsSet(`${name}.chart_type`),
                          uniqueInArray('configuration_monitorings', 'query')
                        )}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <FormField
                        data-testid="chart_type"
                        id="chart_type"
                        name={`${name}.chart_type`}
                        field={{ inputProps: { label: 'Chart Type', select: true } }}
                        fullWidth
                        variant="filled"
                      >
                        {chartTypes.map(option => (
                          <MenuItem key={option.key} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </FormField>
                    </Grid>
                    <Grid item xs={2} key={name}>
                      <FormField
                        data-testid="unit"
                        id="unit"
                        name={`${name}.unit`}
                        field={{ inputProps: { label: 'Unit' } }}
                        fullWidth
                        variant="filled"
                      />
                    </Grid>
                    <Grid item xs={2} md={2}>
                      <IconButton
                        data-testid="remove-envvar-button"
                        variant="outlined"
                        color="default"
                        onClick={() =>
                          mutators.remove('configuration_monitorings', index)
                        }
                      >
                        <Delete />
                      </IconButton>
                    </Grid>
                  </>
                ))}
                <Grid item xs={12}>
                  <Button
                    data-testid="add-envvar-button"
                    onClick={() =>
                      mutators.push('configuration_monitorings', undefined)
                    }
                    variant="contained"
                    color="default"
                    icon={Add}
                  >
                    Add a query
                  </Button>
                </Grid>
              </Grid>
            )}
          </FieldArray>
        </>
      )}
    </>
  )
}

export default MonitoringFields
