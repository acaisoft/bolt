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
import { Grid } from '@material-ui/core'
import { LabeledValue, SectionHeader } from 'components'

function ScenarioPartsDetails({ configuration, gridProps }) {
  const { configuration_parameters = [], has_load_tests } = configuration
  const { configParameterItemProps } = gridProps

  return (
    <>
      <Grid item xs={12}>
        <SectionHeader size="medium" title="Configuration" />
      </Grid>
      {/* TODO: uncomment when script options will be needed */}
      {/*{Boolean(has_pre_test) && (*/}
      {/*  <Grid item xs={12}>*/}
      {/*    <LabeledValue label="Pre-test Script" value="Yes" />*/}
      {/*  </Grid>*/}
      {/*)}*/}
      {/*{Boolean(has_post_test) && (*/}
      {/*  <Grid item xs={12}>*/}
      {/*    <LabeledValue label="Post-test Script" value="Yes" />*/}
      {/*  </Grid>*/}
      {/*)}*/}
      {/*{Boolean(has_monitoring) && (*/}
      {/*  <React.Fragment>*/}
      {/*    <Grid item xs={12}>*/}
      {/*      <LabeledValue label="Monitoring Script" value="Yes" />*/}
      {/*    </Grid>*/}
      {/*    {configuration_parameters*/}
      {/*      .filter(parameter => parameter.parameter_slug.includes('monitoring'))*/}
      {/*      .map(*/}
      {/*        parameter =>*/}
      {/*          parameter.parameter && (*/}
      {/*            <Grid*/}
      {/*              key={parameter.parameter_slug}*/}
      {/*              item*/}
      {/*              xs={12}*/}
      {/*              md={3}*/}
      {/*              {...configParameterItemProps}*/}
      {/*            >*/}
      {/*              <LabeledValue*/}
      {/*                label={parameter.parameter.name}*/}
      {/*                value={parameter.value}*/}
      {/*              />*/}
      {/*            </Grid>*/}
      {/*          )*/}
      {/*      )}*/}
      {/*  </React.Fragment>*/}
      {/*)}*/}

      {Boolean(has_load_tests) && (
        <React.Fragment>
          {/* TODO: uncomment when script options will be needed */}
          {/*<Grid item xs={12}>*/}
          {/*  <LabeledValue label="Load Tests Script" value="Yes" />*/}
          {/*</Grid>*/}
          {configuration_parameters
            .filter(parameter => parameter.parameter_slug.includes('load_tests'))
            .map(
              parameter =>
                parameter.parameter && (
                  <Grid
                    key={parameter.parameter_slug}
                    item
                    xs={12}
                    md={3}
                    {...configParameterItemProps}
                  >
                    <LabeledValue
                      label={parameter.parameter.name}
                      value={parameter.value}
                    />
                  </Grid>
                )
            )}
        </React.Fragment>
      )}
    </>
  )
}

export default ScenarioPartsDetails
