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

import React , { useEffect } from 'react'
import { Grid, MenuItem } from '@material-ui/core'
import { FormField } from 'containers'
import { ExpandablePanel } from 'components'

function ScenarioFields({ fields, configurationType, externalConfigurationHook }) {
  useEffect(()=> {
    externalConfigurationHook(configurationType !== "load_tests")
  })

  return (
    <ExpandablePanel defaultExpanded title="Scenario">
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <FormField
            data-testid="scenario_name"
            id="scenario_name"
            name="scenario_name"
            field={fields.scenario_name}
            fullWidth
            variant="filled"
          />
        </Grid>
        <Grid item xs={6}>
          <FormField
            aria-label="configuration type select"
            data-testid="configuration_type"
            id="configuration_type"
            name="configuration_type"
            field={fields.configuration_type}
            variant="filled"
            fullWidth
          >
            {fields.configuration_type.options.map(option => (
              <MenuItem key={option.key} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </FormField>
        </Grid>
        <Grid item xs={6}>
          <FormField
            data-testid="scenario_description"
            id="scenario_description"
            name="scenario_description"
            field={fields.scenario_description}
            fullWidth
            variant="filled"
            multiline
          />
        </Grid>
      </Grid>
    </ExpandablePanel>
  )
}

export default ScenarioFields
