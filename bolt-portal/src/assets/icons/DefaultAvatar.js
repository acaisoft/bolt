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

function DefaultAvatar(props) {
  return (
    <SvgIcon
      width="25"
      height="29"
      viewBox="0 0 25 29"
      fill="none"
      data-testid="defaultAvatarIcon"
      {...props}
    >
      <path
        d="M25 24C24.9564 23.5023 16.4178 19.6909 16.4178 19.6909L16.1782 16.8779C16.1782 16.8779 17.267 15.558 17.5065 15.0603C17.7242 14.6059 18.0291 13.0912 18.0291 13.0912C18.0291 13.0912 18.813 12.0093 18.9219 11.7064C19.2049 10.9057 19.096 9.23959 18.9654 8.54716C18.9001 8.17931 18.3775 7.74654 18.3993 7.8331C18.3993 7.8331 18.6606 4.78209 18.4428 3.78673C17.6589 -0.043256 12.4983 2.11364e-05 12.4983 2.11364e-05C12.2588 2.11364e-05 7.33774 0.0432978 6.55385 3.80837C6.35788 4.80373 6.5974 7.85474 6.5974 7.85474C6.61918 7.74654 6.09659 8.17931 6.03126 8.5688C5.90062 9.26123 5.79174 10.9057 6.07481 11.728C6.18369 12.0309 6.96757 13.1129 6.96757 13.1129C6.96757 13.1129 7.27242 14.6275 7.49016 15.0819C7.72969 15.6013 8.81842 16.8996 8.81842 16.8996L8.5789 19.7125C8.5789 19.7125 1.0433 23.4807 0.999752 24C0.825555 26.5966 9.18525 28.5 12.5 28.5C19.6806 28.5 24.5 26 25 24Z"
        fill="currentColor"
      />
    </SvgIcon>
  )
}

export default DefaultAvatar
