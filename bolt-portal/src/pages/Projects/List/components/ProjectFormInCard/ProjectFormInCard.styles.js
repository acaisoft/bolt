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

export default makeStyles(({ palette, spacing }) => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'stretch',
    height: 560,
  },
  header: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '150%',
    marginBottom: spacing(3),
  },
  headerIcon: {
    height: 78,
    marginRight: spacing(3),
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  form: {
    paddingLeft: spacing(4),
    paddingRight: spacing(4),
  },
  formFields: {
    flexGrow: 1,
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    '& > button:not(:first-child)': {
      marginLeft: spacing(1),
    },
  },
  cancelButton: {
    '&:hover': {
      backgroundColor: palette.button.cancel.hover,
    },
    '& svg': {
      color: palette.text.error,
    },
  },
  imagePreviewContainer: {
    maxWidth: '100%',
    width: 200,
  },
}))
