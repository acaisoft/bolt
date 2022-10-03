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

from apps.bolt_api.app.appgraph import (
    argo,
    configuration,
    execution_metrics,
    extension,
    project,
    repository,
    test_creator,
    test_runs,
    uploads,
    users,
    healthcheck
)
from apps.bolt_api.app.appgraph.project import demo
from services import gql_util


class TestrunQuery(
    test_runs.TestrunQueries,
    project.TestrunQueries,
    execution_metrics.ExecutionMetricsQueries,
    healthcheck.RemoteSchemaQueries
):
    pass


def to_field(gqlClass):
    return gqlClass.Field(description=gqlClass.__doc__)


class TestrunMutations(graphene.ObjectType):
    # uploads
    testrun_upload = to_field(uploads.UploadUrl)

    # configurations
    testrun_configuration_create = to_field(configuration.Create)
    testrun_configuration_create_validate = to_field(configuration.CreateValidate)
    testrun_configuration_update = to_field(configuration.Update)
    testrun_configuration_update_validate = to_field(configuration.UpdateValidate)
    testrun_configuration_delete = to_field(configuration.Delete)
    testrun_configuration_clone = to_field(configuration.Clone)

    # configuration extension
    testrun_extension_create = to_field(extension.Create)
    testrun_extension_create_validate = to_field(extension.CreateValidate)
    testrun_extension_update = to_field(extension.Update)
    testrun_extension_update_validate = to_field(extension.UpdateValidate)

    # projects
    testrun_project_create = to_field(project.Create)
    testrun_project_create_validate = to_field(project.CreateValidate)
    testrun_project_update = to_field(project.Update)
    testrun_project_update_validate = to_field(project.UpdateValidate)
    testrun_project_delete = to_field(project.Delete)

    # repositories
    testrun_repository_create = to_field(repository.Create)
    testrun_repository_create_validate = to_field(repository.CreateValidate)
    testrun_repository_update = to_field(repository.Update)
    testrun_repository_update_validate = to_field(repository.UpdateValidate)
    testrun_repository_delete = to_field(repository.Delete)

    # test creator
    testrun_creator_create = to_field(test_creator.Create)
    testrun_creator_validate = to_field(test_creator.Validate)
    testrun_creator_update = to_field(test_creator.Update)

    # testrun management
    testrun_start = to_field(test_runs.TestrunStart)
    testrun_terminate = to_field(test_runs.TestrunTerminate)
    testrun_get_report = to_field(test_runs.TestrunReport)

    # user management
    testrun_user_assign = to_field(users.UserAssignToProject)
    testrun_user_roles = to_field(users.UserAddRole)
    testrun_user_unassign = to_field(users.UserRemoveFromProject)
    testrun_invitation_open = to_field(users.GetProjectInvitationToken)
    testrun_invitation_register_user = to_field(users.RegisterUser)
    testrun_invitation_disable = to_field(users.DisableInvitation)

    # argo
    testrun_argo_create_execution_log = to_field(argo.CreateExecutionLog)

    # debug only
    testrun_project_purge = to_field(demo.PurgeProject)
    testrun_project_demo = to_field(demo.DemoProject)


AppSchema = graphene.Schema(
    query=TestrunQuery,
    mutation=TestrunMutations,
    types=[
        configuration.ConfigurationType,
        extension.ExtensionType,
        test_creator.TestCreatorType,
        test_runs.TestrunStartObject,
        test_runs.TestrunTerminateObject,
        test_runs.TestrunReportResponse,
        test_runs.StatusResponse,
        gql_util.ValidationResponse,
        project.SummaryResponse,
        execution_metrics.ExecutionMetricsDataResponse,
    ],
    auto_camelcase=False,
)
