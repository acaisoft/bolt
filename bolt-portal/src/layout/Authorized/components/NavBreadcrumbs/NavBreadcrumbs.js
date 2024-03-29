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

import React, { useCallback } from 'react'
import moment from 'moment'
import { useSubscription, useQuery } from '@apollo/client'
import { Link, matchPath, useLocation } from 'react-router-dom'
import { ExpandMore } from '@material-ui/icons'
import { Loader, Breadcrumbs } from 'components'

import routes from 'config/routes'

import useStyles from './NavBreadcrumbs.styles'

import _ from 'lodash'

import {
  SUBSCRIBE_TO_PROJECTS,
  SUBSCRIBE_TO_SCENARIOS,
  SUBSCRIBE_TO_EXECUTIONS,
  GET_SCENARIO_TYPE,
} from './graphql'
import { TextField, MenuItem } from '@material-ui/core'
import { getUrl } from 'utils/router'

function NavBreadcrumbs() {
  const location = useLocation()
  const { projectId, configurationId, executionId, scenarioId } = getRouteParams(
    location.pathname
  )

  const { getConfigurationUrl, getExecutionUrl, getProjectUrl, getE2EUrl } =
    useUrlGetters({
      projectId,
      configurationId,
      scenarioId,
      executionId,
    })

  const {
    data: { projects, configurations, executions, scenario },
    loading,
  } = useSelectorsData({
    projectId,
    configurationId,
    scenarioId,
    executionId,
  })

  if (loading) {
    return <Loader loading />
  }

  const options = projects.map(item => ({
    value: item.id,
    label: _.truncate(item.name, { length: 45, omission: '...' }),
  }))

  const breadcrumbs = [
    {
      key: 'projects',
      render: () => (
        <Selector
          label="Project"
          options={options}
          generateUrl={getProjectUrl}
          value={options.find(item => item.value === projectId) ? projectId : ''}
        />
      ),
    },
  ]

  if (configurationId && configurations.find(item => item.id === configurationId)) {
    breadcrumbs.push({
      key: 'configurations',
      render: () => (
        <Selector
          label="Scenario"
          options={configurations
            .filter(item => item.type_slug === 'load_tests')
            .map(item => ({
              value: item.id,
              label: item.name,
            }))}
          generateUrl={getConfigurationUrl}
          value={configurationId || ''}
        />
      ),
    })
  }
  if (scenarioId && configurations.find(item => item.id === scenarioId)) {
    breadcrumbs.push({
      key: 'configurations',
      render: () => (
        <Selector
          label={`${scenario?.configuration_type?.name} Scenario`}
          options={configurations
            .filter(item => item.type_slug === scenario?.type_slug)
            .map(item => ({
              value: item.id,
              label: item.name,
            }))}
          generateUrl={getE2EUrl}
          value={scenarioId || ''}
        />
      ),
    })
  }

  if (executionId && executions.find(item => item.id === executionId)) {
    breadcrumbs.push({
      key: 'executions',
      render: () => (
        <Selector
          label="Test Run"
          placeholder="Select a test run"
          options={executions.map(item => ({
            value: item.id,
            label: moment(item.start || item.start_locust).format(
              'YYYY-MM-DD HH:mm:ss'
            ),
          }))}
          generateUrl={getExecutionUrl}
          value={executionId || ''}
        />
      ),
    })
  }

  return <Breadcrumbs items={breadcrumbs} />
}

function Selector({ options, value, generateUrl, ...fieldProps }) {
  const classes = useStyles()

  return (
    <TextField
      select
      value={value}
      {...fieldProps}
      variant="filled"
      SelectProps={{
        autoWidth: true,
        disableUnderline: true,
        SelectDisplayProps: {
          style: { width: 200, paddingRight: 40 },
        },
        IconComponent: ExpandMore,
      }}
    >
      {options.map(option => (
        <MenuItem
          key={option.value}
          to={generateUrl(option.value)}
          value={option.value}
          component={Link}
        >
          {option.label}
        </MenuItem>
      ))}

      {fieldProps.label === 'Project' && (
        <MenuItem
          className={classes.allItem}
          to={getUrl(routes.projects.list)}
          component={Link}
        >
          All Projects
        </MenuItem>
      )}
    </TextField>
  )
}

function getRouteParams(url) {
  const routesMatchingBreadcrumbs = [
    // Match more detailed routes first to prevent reading route parts as IDs
    // E.g. /configurations/create, where 'create' is treated as ID
    routes.projects.configurations.create,
    routes.projects.E2EScenarios.list,

    routes.projects.configurations.executions.details,
    routes.projects.configurations.details,
    routes.projects.details,
  ]

  for (let i = 0; i < routesMatchingBreadcrumbs.length; ++i) {
    const match = matchPath(
      {
        path: routesMatchingBreadcrumbs[i],
        end: false,
      },
      url
    )

    if (match) {
      return match.params
    }
  }

  return {}
}

function useSelectorsData({ projectId, configurationId, scenarioId, executionId }) {
  const { data: { projects = [] } = {}, projectsLoading } = useSubscription(
    SUBSCRIBE_TO_PROJECTS,
    {
      fetchPolicy: 'cache-first',
    }
  )
  const { data: { configurations = [] } = {}, configurationsLoading } =
    useSubscription(SUBSCRIBE_TO_SCENARIOS, {
      fetchPolicy: 'cache-first',
      variables: { projectId },
      skip: configurationId && scenarioId,
    })
  const { data: { executions = [] } = {}, executionsLoading } = useSubscription(
    SUBSCRIBE_TO_EXECUTIONS,
    {
      fetchPolicy: 'cache-first',
      variables: { configurationId },
      skip: !executionId,
    }
  )
  const { data: { scenario = [] } = {}, scenarioTypeLoading } = useQuery(
    GET_SCENARIO_TYPE,
    {
      fetchPolicy: 'cache-first',
      variables: { scenarioId },
      skip: !scenarioId,
    }
  )

  return {
    data: {
      projects,
      configurations,
      executions,
      scenario,
    },
    loading:
      projectsLoading ||
      configurationsLoading ||
      executionsLoading ||
      scenarioTypeLoading,
  }
}

function useUrlGetters({ projectId, configurationId, executionId }) {
  const getProjectUrl = useCallback(
    id => getUrl(routes.projects.details, { projectId: id }),
    []
  )
  const getConfigurationUrl = useCallback(
    id =>
      getUrl(routes.projects.configurations.details, {
        projectId,
        configurationId: id,
      }),
    [projectId]
  )
  const getExecutionUrl = useCallback(
    id =>
      getUrl(routes.projects.configurations.executions.details, {
        projectId,
        configurationId,
        executionId: id,
      }),
    [projectId, configurationId]
  )
  const getE2EUrl = useCallback(
    id =>
      getUrl(routes.projects.E2EScenarios.list, {
        projectId,
        scenarioId: id,
      }),
    [projectId]
  )

  return { getProjectUrl, getConfigurationUrl, getExecutionUrl, getE2EUrl }
}

export default NavBreadcrumbs
