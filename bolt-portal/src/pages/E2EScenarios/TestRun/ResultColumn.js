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

import React, { useState } from 'react'
import useStyles from './ResultColumn.styles'
import { Button } from 'components'
import { ExpandMore, ExpandLess } from '@material-ui/icons'

const ResultColumn = ({ message }) => {
  const [isOpen, setIsOpen] = useState(false)
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <div
        className={classes.wrapper}
        style={{maxHeight: (isOpen ? message?.length / 60 : 1.2) + 'rem'}}
      >
        {message || '-'}
      </div>
      {message && message.length > 65 && (
        <div
          style={{ position: 'relative', marginLeft: '2rem', marginRight: '1rem' }}
        >
          <Button
            icon={isOpen ? ExpandLess : ExpandMore}
            className={classes.expandButton}
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
      )}
    </div>
  )
}

export default ResultColumn
