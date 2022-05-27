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

import { FormControl, FormHelperText } from '@material-ui/core'
import { Button } from 'components'
import { UploadImage } from 'assets/icons'

import useStyles from './FileUploader.component.styles'

function FileUploader({ accept, error, id, label, loading, onChange }) {
  const classes = useStyles()

  return (
    <FormControl error={!!error} margin="normal">
      <input
        type="file"
        accept={accept}
        onChange={onChange}
        id={id}
        className={classes.input}
      />
      <label htmlFor={id}>
        <Button
          variant="outlined"
          color="default"
          component="span"
          icon={UploadImage}
          className={classes.button}
        >
          {label}
        </Button>
      </label>
      {loading && <p>Loading: {loading}</p>}
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  )
}

FileUploader.propTypes = {
  accept: PropTypes.string,
  error: PropTypes.string,
  id: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default FileUploader
