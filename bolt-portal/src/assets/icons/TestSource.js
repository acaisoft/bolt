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

import { SvgIcon } from '@material-ui/core'

function TestSource(props) {
  return (
    <SvgIcon viewBox="0 0 15 18" data-testid="testSourceIcon" {...props}>
      <path
        d="M14 3C14 1.89543 11.6421 1 7.5 1C3.35786 1 1 1.89543 1 3"
        stroke="currentColor"
        fill="none"
      />
      <path
        d="M1 3C1 4.10457 3.35786 5 7.5 5C11.6421 5 14 4.10457 14 3"
        stroke="currentColor"
        fill="none"
      />
      <path
        d="M1 9C1 10.1046 3.35786 11 7.5 11"
        stroke="currentColor"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M14 15C14 16.1046 11.6421 17 7.5 17C3.35786 17 1 16.1046 1 15"
        stroke="currentColor"
        fill="none"
      />
      <path d="M14 3V15M1 3V15" stroke="currentColor" fill="none" />
    </SvgIcon>
  )
}

export default TestSource
