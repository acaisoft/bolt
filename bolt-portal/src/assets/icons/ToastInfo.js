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

function ToastInfo(props) {
  return (
    <SvgIcon
      width="41"
      height="41"
      viewBox="0 0 41 41"
      fill="none"
      data-testid="toastInfoIcon"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M41 20.5C41 31.8218 31.8218 41 20.5 41C9.17816 41 0 31.8218 0 20.5C0 9.17816 9.17816 0 20.5 0C31.8218 0 41 9.17816 41 20.5ZM22.5 14.55C22.5 15.9307 21.3807 17.05 20 17.05C18.6193 17.05 17.5 15.9307 17.5 14.55C17.5 13.1693 18.6193 12.05 20 12.05C21.3807 12.05 22.5 13.1693 22.5 14.55ZM22.0849 20.9499C22.0849 19.8454 21.1895 18.9499 20.0849 18.95C18.9803 18.95 18.0849 19.8454 18.0849 20.95L18.0849 27.1198C18.0849 28.2244 18.9804 29.1198 20.0849 29.1198C21.1895 29.1198 22.0849 28.2244 22.0849 27.1198L22.0849 20.9499Z"
        fill="white"
      />
    </SvgIcon>
  )
}

export default ToastInfo
