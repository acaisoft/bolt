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
    width: 'auto',
    padding: spacing(2, 2, 1),
    color: palette.chart.tooltip.color,
    fontFamily: palette.chart.tooltip.fontFamily,
    fontSize: palette.chart.tooltip.fontSize,
    backgroundColor: [palette.chart.tooltip.fill, '!important'],
  },
  label: {},
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    flexBasis: '30%',
    flexGrow: 1,
    margin: spacing(1),
  },
  itemColor: {
    borderRadius: '50%',
    width: 5,
    height: 5,
    marginRight: spacing(1),
  },
  itemName: {
    fontWeight: 'bold',
  },
  itemValue: {
    width: '100%',
    marginLeft: spacing(1) + 5,
  },
}))
