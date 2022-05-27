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

export default makeStyles(({ palette, spacing, zIndex }) => ({
  root: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: 350,
    zIndex: zIndex.appBar + 1,
  },
  paper: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'stretch',
    background: palette.dropdown.main,
  },
  menu: {
    flexGrow: 1,
  },
  footerMenu: {
    borderTop: `1px solid ${palette.divider}`,
  },
  header: {
    height: 85,
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid transparent',
  },
  item: {
    padding: spacing(2, 3),
    marginLeft: 2,
    borderLeft: '3px solid transparent',
  },
  itemSelected: {
    backgroundColor: palette.dropdown.hover,
    borderLeftColor: palette.action.selected,
    fontWeight: 'bold',
    color: palette.text.primary,

    '& $icon': {
      color: palette.action.selected,
    },
  },
  title: {
    height: '100%',
    padding: '30px 0px',
  },
  icon: {
    marginRight: spacing(2),
  },
  button: {
    marginRight: 20,
  },
  logo: {
    height: '100%',
  },
}))
