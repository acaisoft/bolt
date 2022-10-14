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

import {useMemo} from "react";
import {useQuery} from "@apollo/client";
import {GET_CONFIGURATION_TYPES} from "./graphql";

function useExternalFormSchema () {
  const { data: { configurationTypes } = {}, loading: configurationTypesLoading } =
    useQuery(GET_CONFIGURATION_TYPES, {
      fetchPolicy: 'cache-and-network',
    })
  const fields =  useMemo(
    () =>
      generateFields({
        configurationTypes: configurationTypes || []
      }), [configurationTypes]
  )
  return {
    loading: configurationTypesLoading,
    fields
  }
}

function generateFields({
  configurationTypes
}) {
  const configurationTypeOptions = configurationTypes.map(ct => ({
    key: ct.id,
    label: ct.name,
    value: ct.slug_name,
  }))

  return {
    scenario_name: {
      validator: {
        presence: {allowEmpty: false},
      },
      inputProps: {
        label: 'Name',
      },
    },
    configuration_type: {
      validator: {
        inclusion: configurationTypeOptions.map(cto => cto.value),
      },
      options: configurationTypeOptions,
      inputProps: {
        select: true,
        label: 'Test Type',
      },
    },
    scenario_description: {
      inputProps: {
        label: 'Description',
      },
    },
  }
}

function prepareExternalPayload(formValues, { mode, configurationId, projectId }) {
  if (!formValues) {
    return {}
  }

  const {
    scenario_name,
    configuration_type,
    scenario_description
  } = formValues

  const variables = {
    name: scenario_name,
    type_slug: configuration_type,
    description: scenario_description
  }

  if (mode === 'create') {
    variables.project_id = projectId
  } else {
    variables.id = configurationId
  }

  return variables
}


export { useExternalFormSchema, prepareExternalPayload }
