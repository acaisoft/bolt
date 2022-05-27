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

import { makeStyles, alpha } from '@material-ui/core'
import { TestRunStageStatus as Status } from 'config/constants'

export default makeStyles(({ palette, spacing }) => ({
  circle: {
    height: 14,
    width: 14,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: palette.background.paper,
    background: '#CFCFEA',
  },
  active: {
    background: palette.success.main,
    color: '#4E4D6E',

    '&::before': {
      content: "''",
      position: 'absolute',
      height: 30,
      width: 30,
      borderRadius: '50%',
      background: alpha(palette.success.main, 0.4),
    },
  },

  [Status.RUNNING]: {
    '&::before': {
      animation: '$progress 2s ease-in-out infinite',
    },
  },
  [Status.PENDING]: {
    '&::before': {
      animation: '$progress 2s ease-in-out infinite',
    },
  },
  [Status.SUCCEEDED]: {
    animation: 'none',
  },

  [Status.FAILED]: {
    background: palette.chart.graph.line.failed,

    '&::before': {
      background: alpha(palette.error.main, 0.4),
    },
  },
  [Status.ERROR]: {
    background: palette.chart.graph.line.failed,

    '&::before': {
      background: alpha(palette.error.main, 0.4),
    },
  },
  [Status.TERMINATED]: {
    background: palette.warning.main,

    '&::before': {
      background: alpha(palette.warning.secondary, 0.4),
    },
  },

  section: {
    flex: 1,
    height: '100%',
    paddingTop: spacing(4),
  },
  paper: {
    background: '#4E4D6E',
    padding: spacing(2),
  },
  step: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    minHeight: 70,
  },
  typography: {
    fontSize: 13,
    display: 'flex',
    alignItems: 'center',
  },

  stepTitle: {
    fontSize: palette.dropdown.fontSize,
    fontWeight: 'normal',
    padding: spacing(1),
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
  },

  statusIcon: {
    marginRight: spacing(1),
    display: 'flex',
  },

  icon: {
    fontSize: '1rem',
    fontWeight: 'bold',
    borderRadius: '50%',
    background: palette.success.main,
    border: `2px solid ${palette.success.main}`,
  },

  failed: {
    background: palette.error.main,
    border: `2px solid ${palette.error.main}`,
  },

  messageIcon: {
    fontSize: '0.8rem',
    fontWeight: 'bold',
    marginRight: spacing(1),
  },
  successMessage: {
    color: palette.success.main,
  },

  errorMessage: {
    color: palette.error.main,
  },

  line: {
    background: '#4E4D6E',
    display: 'block',
    height: 2,
    position: 'absolute',
    right: 0,
    transform: 'skewY(-5deg)',
    transformOrigin: '100%',
  },

  '@keyframes progress': {
    '0%': { transform: 'scale(0)', opacity: 0 },
    '50%': { transform: 'scale(1)', opacity: 1 },
    '100%': { transform: 'scale(0)', opacity: 0 },
  },
}))
