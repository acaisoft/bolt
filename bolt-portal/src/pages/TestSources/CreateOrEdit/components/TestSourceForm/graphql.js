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

import { gql } from '@apollo/client'

export const GET_REPOSITORY_KEY = gql`
  query getRepositoryKey {
    repositoryKey: testrun_repository_key
  }
`

export const GET_TEST_SOURCE = gql`
  query getTestSource($sourceId: uuid!) {
    testSource: test_source_by_pk(id: $sourceId) {
      id
      source_type
      test_creator {
        id
        name
        type_slug
      }
      repository {
        id
        name
        type_slug
        url
      }
    }
  }
`

export const ADD_REPOSITORY_MUTATION = gql`
  mutation addRepository(
    $name: String!
    $project_id: UUID!
    $repository_url: String!
    $type_slug: String!
  ) {
    repository: testrun_repository_create(
      name: $name
      project_id: $project_id
      repository_url: $repository_url
      type_slug: $type_slug
    ) {
      returning {
        id
      }
    }
  }
`

export const EDIT_REPOSITORY_MUTATION = gql`
  mutation editRepository(
    $id: UUID!
    $name: String!
    $repository_url: String!
    $type_slug: String
  ) {
    repository: testrun_repository_update(
      id: $id
      name: $name
      repository_url: $repository_url
      type_slug: $type_slug
    ) {
      returning {
        id
      }
    }
  }
`

export const ADD_REPOSITORY_VALIDATE_MUTATION = gql`
  mutation addRepositoryValidate(
    $name: String!
    $project_id: UUID!
    $repository_url: String!
    $type_slug: String!
  ) {
    validationResult: testrun_repository_create_validate(
      name: $name
      project_id: $project_id
      repository_url: $repository_url
      type_slug: $type_slug
    ) {
      ok
    }
  }
`

export const EDIT_REPOSITORY_VALIDATE_MUTATION = gql`
  mutation editRepositoryValidate(
    $id: UUID!
    $name: String!
    $repository_url: String!
    $type_slug: String
  ) {
    validationResult: testrun_repository_update_validate(
      id: $id
      name: $name
      repository_url: $repository_url
      type_slug: $type_slug
    ) {
      ok
    }
  }
`

export const GET_CONFIGURATION_TYPES_QUERY = gql`
  query getConfigurationTypesForSelector {
    configurationTypes: configuration_type {
      id
      name
      slug_name
    }
  }
`
