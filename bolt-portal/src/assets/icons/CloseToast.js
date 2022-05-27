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

function CloseToast(props) {
  return (
    <SvgIcon
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      data-testid="closeToastIcon"
      {...props}
    >
      <path
        d="M9.94971 3L2.99996 9.94974"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M9.94971 9.94971L2.99996 2.99996"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </SvgIcon>
  )
}

export default CloseToast
