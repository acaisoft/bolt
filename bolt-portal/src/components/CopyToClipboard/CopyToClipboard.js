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

import React, { useState, useCallback, useRef, useEffect } from 'react'

import { TextField, InputAdornment, IconButton, Tooltip } from '@material-ui/core'
import { FileCopy, Check } from '@material-ui/icons'
import { copyValueFromInput } from 'utils/browser'

export function CopyToClipboard({ label, text, timeout = 2000, ...textFieldProps }) {
  const [copied, setCopied] = useState(false)
  const inputRef = useRef(null)

  const handleCopy = useCallback(() => {
    const inputEl = inputRef.current
    copyValueFromInput(inputEl)
    setCopied(true)
    inputEl.focus()
  }, [])

  useEffect(() => {
    if (copied) {
      const handle = setTimeout(() => setCopied(false), timeout)
      return () => clearTimeout(handle)
    }
  }, [copied, timeout])

  const tooltipText = copied ? 'Copied!' : 'Copy to clipboard'

  return (
    <TextField
      inputRef={inputRef}
      label={label}
      value={text}
      id="copy-to-clipboard"
      data-testid="CopyToClipboard"
      InputProps={{
        readOnly: true,
        endAdornment: (
          <InputAdornment position="end">
            <Tooltip
              data-testid="tooltip"
              title={tooltipText}
              aria-label={tooltipText}
            >
              <span>
                {copied ? (
                  <IconButton data-testid="copied-button" disabled>
                    <Check />
                  </IconButton>
                ) : (
                  <IconButton data-testid="copy-button" onClick={handleCopy}>
                    <FileCopy />
                  </IconButton>
                )}
              </span>
            </Tooltip>
          </InputAdornment>
        ),
      }}
      {...textFieldProps}
    />
  )
}

export default CopyToClipboard
