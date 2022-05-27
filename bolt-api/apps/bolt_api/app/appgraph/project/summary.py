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
from services.projects.summary import get_project_summary


class SummaryItem(graphene.ObjectType):
    project_id = graphene.String()
    description = graphene.String()
    image_url = graphene.String()
    name = graphene.String()
    num_scenarios = graphene.Int()
    num_sources = graphene.Int()
    num_tests_passed = graphene.Int()
    num_tests_failed = graphene.Int()
    invitation_open = graphene.Boolean()


class SummaryResponse(graphene.ObjectType):
    projects = graphene.List(SummaryItem)


class TestrunQueries(graphene.ObjectType):

    testrun_project_summary = graphene.Field(
        SummaryResponse,
        description='Summary of all projects.',
    )

    def resolve_testrun_project_summary(self, info):
        role, user_id = gql_util.get_request_role_userid(info, const.ROLE_CHOICE)

        stats = get_project_summary(current_app.config, user_id, role)

        out = [SummaryItem(**i) for i in stats]

        return SummaryResponse(projects=out)
