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

import os

from . import users
from .projects import project_setup_demo, project_teardown
from .repositories import validate_repo
from .sentry import sentry_check
from .tokens import job_token

if os.getenv('HTTP_DEBUG', False):
    # helpful for debugging client communication
    import logging
    import http.client as http_client

    http_client.HTTPConnection.debuglevel = 1

    # You must initialize logging, otherwise you'll not see debug output.
    logging.basicConfig()
    logging.getLogger().setLevel(logging.DEBUG)
    requests_log = logging.getLogger("requests.packages.urllib3")
    requests_log.setLevel(logging.DEBUG)
    requests_log.propagate = True


def register_commands(app):
    app.cli.add_command(sentry_check)
    app.cli.add_command(job_token)
    app.cli.add_command(users.user_create)
    app.cli.add_command(users.user_list_in_project)
    app.cli.add_command(users.user_assign_role)
    app.cli.add_command(users.user_unassign)
    app.cli.add_command(users.user_create_invitation)
    app.cli.add_command(users.user_register)
    app.cli.add_command(users.disable_invitation)
    app.cli.add_command(users.user_login)
    app.cli.add_command(project_setup_demo)
    app.cli.add_command(project_teardown)
    app.cli.add_command(validate_repo)
