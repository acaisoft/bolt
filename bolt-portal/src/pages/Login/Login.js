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
import { Button } from 'components'
import logo from 'assets/images/bolt-logo.png'
import { useAuth0 } from '@auth0/auth0-react'
import useStyles from './Login.styles'

const Login = () => {
  const classes = useStyles()
  const { loginWithRedirect, isAuthenticated } = useAuth0()
  return (
    <div className={classes.textCenter}>
      <img src={logo} alt="logo" className={classes.boltLogo} />
      <div>
        {!isAuthenticated && (
          <Button
            data-testid={`login-button`}
            variant="contained"
            color="primary"
            onClick={() => loginWithRedirect()}
          >
            Log in
          </Button>
        )}
      </div>
    </div>
  )
}

export default Login
