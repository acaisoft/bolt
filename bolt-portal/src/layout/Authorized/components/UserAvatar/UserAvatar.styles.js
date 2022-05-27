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

import { makeStyles } from '@material-ui/core'

const avatarBorderMargin = 2
const avatarBorderWidth = 2
const avatarOffset = -(avatarBorderMargin + avatarBorderWidth)

export default makeStyles(({ palette }) => ({
  avatarContainer: {
    borderRadius: '50%',
    width: 30,
    height: 30,
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: palette.text.secondary,
    '&::before': {
      content: "''",
      position: 'absolute',
      top: avatarOffset,
      bottom: avatarOffset,
      left: avatarOffset,
      right: avatarOffset,
      borderRadius: '50%',
      border: `${avatarBorderWidth}px solid ${palette.text.secondary}`,
    },
  },
  badge: {
    backgroundColor: palette.success.main,
  },

  avatar: {
    width: '100%',
    height: '100%',
  },
}))
