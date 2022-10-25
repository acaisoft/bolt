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
import { Grid, MenuItem, Checkbox, FormControlLabel } from '@material-ui/core'
import { FormField } from 'containers'

function MonitoringFields({ fields, isMonitoring, setIsMonitoring }) {
  return (
    <>
      <FormControlLabel
        control={
          <Checkbox onChange={event => setIsMonitoring(event.target.checked)} />
        }
        label="Monitoring"
      />
      {isMonitoring && (
        <Grid container spacing={4}>
          <Grid item xs={6}>
            <FormField
              data-testid="query"
              id="query"
              name="query"
              field={fields.query}
              fullWidth
              variant="filled"
            />
          </Grid>
          <Grid item xs={6}>
            <FormField
              data-testid="chart_type"
              id="chart_type"
              name="chart_type"
              field={fields.chart_type}
              fullWidth
              variant="filled"
            >
              {fields.chart_type.options.map(option => (
                <MenuItem key={option.key} value={option.value}>
                  {option.value}
                </MenuItem>
              ))}
            </FormField>
          </Grid>
        </Grid>
      )}
    </>
  )
}

export default MonitoringFields
