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

function ToastError(props) {
  return (
    <SvgIcon
      width="41"
      height="41"
      viewBox="0 0 41 41"
      fill="none"
      data-testid="toastErrorIcon"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M41 20.5C41 31.8218 31.8218 41 20.5 41C9.17816 41 0 31.8218 0 20.5C0 9.17816 9.17816 0 20.5 0C31.8218 0 41 9.17816 41 20.5ZM26.9601 14.9393C27.5458 15.5251 27.5458 16.4749 26.9601 17.0607L23.071 20.9497L26.9601 24.8388C27.5458 25.4245 27.5458 26.3743 26.9601 26.9601C26.3743 27.5459 25.4245 27.5459 24.8387 26.9601L20.9497 23.071L17.0606 26.9602C16.4748 27.5459 15.525 27.5459 14.9392 26.9602C14.3535 26.3744 14.3535 25.4246 14.9392 24.8388L18.8284 20.9497L14.9392 17.0606C14.3535 16.4748 14.3535 15.5251 14.9392 14.9393C15.525 14.3535 16.4748 14.3535 17.0606 14.9393L20.9497 18.8284L24.8387 14.9393C25.4245 14.3536 26.3743 14.3536 26.9601 14.9393Z"
        fill="white"
      />
    </SvgIcon>
  )
}

export default ToastError
