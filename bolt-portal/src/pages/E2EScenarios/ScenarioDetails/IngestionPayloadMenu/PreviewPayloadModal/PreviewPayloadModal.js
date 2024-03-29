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
import PropTypes from 'prop-types'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core'
import {makeStyles} from "@material-ui/styles";

const useStyle = makeStyles(() => {
  return {
    dialog: {
      width: '40vw'
    }
  }
})

export function PreviewPayloadModal({
  cancelLabel = 'Close',
  children,
  id = 'preview-payload-modal',
  isOpen = false,
  onClose,
  title = 'Testdata ingestion payload',
}) {
  const classes = useStyle()

  return (
    <Dialog
      data-testid="PreviewPayloadModal"
      open={isOpen}
      onClose={onClose}
      maxWidth={false}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
    >
      <DialogTitle id={`${id}-title`}>{title}</DialogTitle>
      <DialogContent
        className={classes.dialog}
      >
        {children}
      </DialogContent>
      <DialogActions>
        <Button data-testid="cancel-remove-button" onClick={onClose} color="primary">
          {cancelLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
PreviewPayloadModal.propTypes = {
  cancelLabel: PropTypes.string,
  children: PropTypes.node,
  id: PropTypes.string,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
}

export default PreviewPayloadModal
