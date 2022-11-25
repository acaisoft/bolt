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

import useStyles from "./CPUWarningBadge.style";
import {Grid, Paper, Typography} from "@material-ui/core";
import {WarningRounded} from '@material-ui/icons'
import React from "react";


export function CPUWarningBadge() {
  const classes = useStyles()

  return (
    <Grid item xs={12}>
      <Paper square className={classes.tile}>
        <div className={classes.wrapper} data-testid="cpu-warning-badge">
          <WarningRounded data-testid="test-run-status-icon" className={classes.icon} />
          <Typography className={classes.text} variant="body1" displayBlock>
            CPU usage has surpassed 90% on at least one of the worker nodes.
            This may cause test results to be inaccurate.
            Please consider lowering users/worker ratio.
          </Typography>
        </div>
      </Paper>
    </Grid>
  )
}

export default CPUWarningBadge
