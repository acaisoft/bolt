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

function Terminate(props) {
  return (
    <SvgIcon viewBox="0 0 19 19" fill="none" data-testid="terminateIcon" {...props}>
      <mask id="path-1-inside-1" fill="white">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17.5 9.5C17.5 13.9183 13.9183 17.5 9.5 17.5C5.08172 17.5 1.5 13.9183 1.5 9.5C1.5 5.08172 5.08172 1.5 9.5 1.5C13.9183 1.5 17.5 5.08172 17.5 9.5ZM19 9.5C19 14.7467 14.7467 19 9.5 19C4.25329 19 0 14.7467 0 9.5C0 4.25329 4.25329 0 9.5 0C14.7467 0 19 4.25329 19 9.5ZM6.7 6.5C6.58954 6.5 6.5 6.58954 6.5 6.7V12.3C6.5 12.4105 6.58954 12.5 6.7 12.5H12.3C12.4105 12.5 12.5 12.4105 12.5 12.3V6.7C12.5 6.58954 12.4105 6.5 12.3 6.5H6.7Z"
        />
      </mask>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.5 9.5C17.5 13.9183 13.9183 17.5 9.5 17.5C5.08172 17.5 1.5 13.9183 1.5 9.5C1.5 5.08172 5.08172 1.5 9.5 1.5C13.9183 1.5 17.5 5.08172 17.5 9.5ZM19 9.5C19 14.7467 14.7467 19 9.5 19C4.25329 19 0 14.7467 0 9.5C0 4.25329 4.25329 0 9.5 0C14.7467 0 19 4.25329 19 9.5ZM6.7 6.5C6.58954 6.5 6.5 6.58954 6.5 6.7V12.3C6.5 12.4105 6.58954 12.5 6.7 12.5H12.3C12.4105 12.5 12.5 12.4105 12.5 12.3V6.7C12.5 6.58954 12.4105 6.5 12.3 6.5H6.7Z"
        fill="currentColor"
      />
      <path
        d="M9.5 19C14.7467 19 19 14.7467 19 9.5H16C16 13.0899 13.0899 16 9.5 16V19ZM0 9.5C0 14.7467 4.25329 19 9.5 19V16C5.91015 16 3 13.0899 3 9.5H0ZM9.5 0C4.25329 0 0 4.25329 0 9.5H3C3 5.91015 5.91015 3 9.5 3V0ZM19 9.5C19 4.25329 14.7467 0 9.5 0V3C13.0899 3 16 5.91015 16 9.5H19ZM9.5 20.5C15.5751 20.5 20.5 15.5751 20.5 9.5H17.5C17.5 13.9183 13.9183 17.5 9.5 17.5V20.5ZM-1.5 9.5C-1.5 15.5751 3.42487 20.5 9.5 20.5V17.5C5.08172 17.5 1.5 13.9183 1.5 9.5H-1.5ZM9.5 -1.5C3.42487 -1.5 -1.5 3.42487 -1.5 9.5H1.5C1.5 5.08172 5.08172 1.5 9.5 1.5V-1.5ZM20.5 9.5C20.5 3.42487 15.5751 -1.5 9.5 -1.5V1.5C13.9183 1.5 17.5 5.08172 17.5 9.5H20.5ZM8 6.7C8 7.41797 7.41797 8 6.7 8V5C5.76112 5 5 5.76112 5 6.7H8ZM8 12.3V6.7H5V12.3H8ZM6.7 11C7.41797 11 8 11.582 8 12.3H5C5 13.2389 5.76112 14 6.7 14V11ZM12.3 11H6.7V14H12.3V11ZM11 12.3C11 11.582 11.582 11 12.3 11V14C13.2389 14 14 13.2389 14 12.3H11ZM11 6.7V12.3H14V6.7H11ZM12.3 8C11.582 8 11 7.41797 11 6.7H14C14 5.76112 13.2389 5 12.3 5V8ZM6.7 8H12.3V5H6.7V8Z"
        fill="currentColor"
        mask="url(#path-1-inside-1)"
      />
    </SvgIcon>
  )
}

export default Terminate
