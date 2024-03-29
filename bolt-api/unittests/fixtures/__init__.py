# Copyright (c) 2022 Acaisoft
#
# Permission is hereby granted, free of charge, to any person obtaining a copy of
# this software and associated documentation files (the "Software"), to deal in
# the Software without restriction, including without limitation the rights to
# use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
# the Software, and to permit persons to whom the Software is furnished to do so,
# subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
# FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
# COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
# IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
# CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

from .app import (
    app,
    app_auth0,
    app_critical_config,
    app_critical_config_auth0,
    client,
    client_auth0,
    client_critical_config,
    client_critical_config_auth0
)
from .fake_apis import (
    fake_auth0,
    fake_hasura,
    fake_hasura_synced,
    fake_hasura_dead,
    fake_hasura_desync,
    fake_hasura_desync_repairable,
    fake_broken_auth0_token,
    fake_broken_auth0_list_email,
    fake_broken_auth0_get_role
)
from .data.env import values as environment

from .mocked_modules import (
    fake_threading,
    fake_cmd_zero,
    fake_cmd_nonzero
)
