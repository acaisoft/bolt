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

export const ADD_PROJECT = gql`
  mutation addProject($name: String!, $description: String, $image_url: String) {
    testrun_project_create(
      name: $name
      description: $description
      image_url: $image_url
    ) {
      returning {
        id
        name
        description
        image_url
      }
    }
  }
`

export const EDIT_PROJECT = gql`
  mutation editProject(
    $id: UUID!
    $name: String!
    $description: String
    $image_url: String
  ) {
    testrun_project_update(
      id: $id
      name: $name
      description: $description
      image_url: $image_url
    ) {
      returning {
        id
        name
        description
        image_url
      }
    }
  }
`
