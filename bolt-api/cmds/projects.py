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

import click
from flask import current_app
from flask.cli import with_appcontext

from services import projects


@click.command(name='project_setup_demo')
@click.argument('project_name', required=True)
@click.argument('user_id', required=True)
@with_appcontext
def project_setup_demo(project_name, user_id):
    """
    Create a project with two configurations and start it's tests.
    """
    projects.setup_demo_project(current_app.config, project_name, user_id)


@click.command(name='project_teardown')
@click.argument('project_name', required=False)
@click.argument('project_id', required=False)
@with_appcontext
def project_teardown(project_name, project_id):
    """
    Teardown a project by its name or its id.
    """
    projects.teardown(current_app.config, project_name, project_id)
