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

function TestRun(props) {
  return (
    <SvgIcon viewBox="0 0 16 16" data-testid="testRunIcon" {...props}>
      <path
        d="M14.0239 8.78087L6.62469 14.7002C5.96993 15.2241 5 14.7579 5 13.9194L5 8L5 2.08062C5 1.24212 5.96993 0.775945 6.6247 1.29976L14.0239 7.21913C14.5243 7.61946 14.5243 8.38054 14.0239 8.78087Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M1 1V15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* <path
        d="M14.0239 8.78087L6.62469 14.7002C5.96993 15.2241 5 14.7579 5 13.9194L5 8L5 2.08062C5 1.24212 5.96993 0.775945 6.6247 1.29976L14.0239 7.21913C14.5243 7.61946 14.5243 8.38054 14.0239 8.78087Z"
        stroke="currentColor"
        fill="none"
        strokeWidth="1.5"
      />
      <path
        d="M1 1V15"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      /> */}
    </SvgIcon>
  )
}

export default TestRun
