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

import useStyles from './ChartTooltip.styles'
import { Paper } from '@material-ui/core'

const identity = x => x

function ChartTooltip({
  active,
  formatter = identity,
  label,
  labelFormatter = identity,
  payload,
}) {
  const classes = useStyles()

  if (!payload) {
    return null
  }

  return (
    <Paper className={classes.root} elevation={4} data-testid="ChartTooltip">
      <div className={classes.label}>{labelFormatter(label)}</div>
      <ul className={classes.list}>
        {payload.map(item => (
          <li key={item.name} className={classes.item}>
            <div
              className={classes.itemColor}
              style={{ backgroundColor: item.color }}
            />
            <div className={classes.itemName}>{item.name}</div>
            <div className={classes.itemValue}>{formatter(item.value)}</div>
          </li>
        ))}
      </ul>
    </Paper>
  )
}

export default ChartTooltip
