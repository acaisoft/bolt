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

import graphene
from flask import current_app

from services import const, gql_util
from services import projects


class PurgeProject(graphene.Mutation):
    """DO NOT USE. Purges project and all related objects from database."""

    class Arguments:
        project_id = graphene.UUID(required=False)
        project_name = graphene.String(required=False, description='Accepts an sql-style wildcard')

    deleted_projects = graphene.List(graphene.UUID)

    def mutate(self, info, project_id=None, project_name=None):
        role, user_id = gql_util.get_request_role_userid(info, (const.ROLE_ADMIN,))

        project_ids_list = projects.teardown(current_app.config, project_name=project_name, project_id=project_id)

        return PurgeProject(deleted_projects=project_ids_list)


class DemoProject(graphene.Mutation):
    """DO NOT USE.
    Debug use only. Creates a complete project and starts two tests.
    Optionally creates a reader user in keycloak.
    """

    class Arguments:
        name = graphene.String()
        project_user_id = graphene.UUID(required=False)
        project_user_email = graphene.String(required=False)
        not_sync = graphene.Boolean(required=False)

    project_id = graphene.UUID()

    def mutate(self, info, name, project_user_id=None, project_user_email=None, not_sync=True):
        role, user_id = gql_util.get_request_role_userid(info, (const.ROLE_ADMIN,))

        project_id = projects.setup_demo_project(current_app.config, name, str(project_user_id), project_user_email, not_sync)

        return DemoProject(project_id=project_id)
