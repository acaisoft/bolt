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

export default makeStyles(({ palette, shape, spacing, typography }) => {
  return {
    card: {
      minHeight: 250,
      justifyContent: 'center',
      height: '100%',
      padding: spacing(3, 3, 4),
      display: 'flex',
      flexDirection: 'column',
      borderRadius: shape.borderRadius * 2,
      position: 'relative',
      flexGrow: 1,
      '& > *': {
        zIndex: 1,
      },
    },
    gridContainer: {
      // Fallback for browsers not supporting CSS grid.
      display: 'flex',
      flexWrap: 'wrap',
      margin: '0 auto',

      // For browsers supporting grid.
      '&': {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(430px, 1fr))',
      },
    },
    gridItem: {
      flex: '1 1 250px',
      margin: spacing(1),
    },
    gridItemBig: {
      flexBasis: '100%',
      gridRowEnd: 'span 2',
      gridColumnEnd: 'span 2',
    },
    formCard: {
      border: `2px dashed ${palette.border}`,
      backgroundColor: 'transparent',
    },
    newProjectContainer: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative',
    },
  }
})
