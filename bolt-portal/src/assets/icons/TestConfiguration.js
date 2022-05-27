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

function TestConfiguration(props) {
  return (
    <SvgIcon viewBox="0 0 18 13" data-testid="testConfigIcon" {...props}>
      <path
        d="M2.00049 1.44727L4.64299 9.90328C4.90445 10.7399 6.0393 10.8593 6.46905 10.0953L10.5697 2.80527C10.9269 2.17026 11.8214 2.11813 12.25 2.70736L16.6667 8.78038"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M3.99988 2.00007C3.99988 3.1046 3.10448 4.00001 1.99994 4.00001C0.895404 4.00001 0 3.1046 0 2.00007C0 0.895532 0.895404 0.000128486 1.99994 0.000128486C3.10448 0.000128486 3.99988 0.895532 3.99988 2.00007Z"
        fill="currentColor"
      />
      <path
        d="M17.9999 8.11371C17.9999 9.21825 17.1045 10.1136 15.9999 10.1136C14.8954 10.1136 14 9.21825 14 8.11371C14 7.00917 14.8954 6.11377 15.9999 6.11377C17.1045 6.11377 17.9999 7.00917 17.9999 8.11371Z"
        fill="currentColor"
      />
    </SvgIcon>
  )
}

export default TestConfiguration
