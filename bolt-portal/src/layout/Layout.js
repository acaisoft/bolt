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
import 'react-toastify/dist/ReactToastify.min.css'
import { ToastContainer } from 'react-toastify'

import { CloseToast } from 'assets/icons'
import Authorized from './Authorized'
import Guest from './Guest'
import Splash from './Splash'
import { useAuth0 } from '@auth0/auth0-react'
import useStyles from './Layout.styles'

export function Layout() {
  const classes = useStyles()
  const { isAuthenticated, isLoading } = useAuth0()

  function CloseButton({ closeToast }) {
    return <CloseToast onClick={closeToast} className={classes.closeIcon} />
  }
  if (isLoading) return <Splash />

  return (
    <React.Fragment>
      <ToastContainer
        className={classes.toastContainer}
        autoClose={8000}
        closeButton={<CloseButton />}
        theme="colored"
      />
      <div className={classes.root}>
        {isAuthenticated ? <Authorized /> : <Guest />}
      </div>
    </React.Fragment>
  )
}

export default Layout
