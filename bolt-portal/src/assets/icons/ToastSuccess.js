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

function ToastSuccess(props) {
  return (
    <SvgIcon
      width="41"
      height="41"
      viewBox="0 0 41 41"
      fill="none"
      data-testid="toastSuccessIcon"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.5 41C31.8218 41 41 31.8218 41 20.5C41 9.17816 31.8218 0 20.5 0C9.17816 0 0 9.17816 0 20.5C0 31.8218 9.17816 41 20.5 41ZM28.833 16.8121C29.5638 15.9839 29.4848 14.72 28.6566 13.9892C27.8283 13.2584 26.5645 13.3374 25.8336 14.1656L18.3013 22.7023L14.9757 19.8231C14.1406 19.1001 12.8776 19.191 12.1546 20.0261C11.4316 20.8612 11.5225 22.1243 12.3576 22.8473L16.4322 26.3748C17.6765 27.452 19.5564 27.3257 20.6453 26.0915L28.833 16.8121Z"
        fill="white"
      />
    </SvgIcon>
  )
}

export default ToastSuccess
