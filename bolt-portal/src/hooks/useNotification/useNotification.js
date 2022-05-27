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

import React, { useCallback, useMemo } from 'react'
import { toast } from 'react-toastify'
import { makeStyles } from '@material-ui/styles'
import { ToastSuccess, ToastError, ToastInfo } from 'assets/icons'
import { ToastContent } from './components'

const variants = {
  info: {
    defaultTitle: 'Information',
    icon: ToastInfo,
    name: 'info',
  },
  success: {
    defaultTitle: 'Success',
    icon: ToastSuccess,
    name: 'success',
  },
  error: {
    defaultTitle: 'Error',
    icon: ToastError,
    name: 'error',
  },
}

// @TODO: Possible optimization:
//        Rewrite as a context + useNotification hook which gets API from the context
function useNotification() {
  const success = useVariant(variants.success)
  const info = useVariant(variants.info)
  const error = useVariant(variants.error)

  // Preserve object identity between calls.
  return useMemo(
    () => ({
      success,
      info,
      error,
    }),
    [success, info, error]
  )
}

const useStyle = makeStyles(() => {
  return {
    className: {
      borderRadius: 5,
      minHeight: 125,
    },
    progressClassName: {
      height: 10,
    },
  }
})

function useVariant({ name, defaultTitle, icon }) {
  const classes = useStyle({ name })

  return useCallback(
    (message, options = {}) => {
      const { title, ...toastifyOptions } = options

      toast[name](
        <ToastContent
          IconComponent={icon}
          message={message}
          title={title || defaultTitle}
        />,
        {
          ...toastifyOptions,
          ...classes,
          icon: !icon,
        }
      )
    },
    [classes, defaultTitle, icon, name]
  )
}

export default useNotification
