import graphene
from flask import current_app

from services import gql_util, const
from services.testruns.generate_report import generate_report


class TestrunReportInterface(graphene.Interface):
    """Holds report data response."""
    data = graphene.String(description='report data')


class TestrunReportResponse(graphene.ObjectType):
    class Meta:
        interfaces = (TestrunReportInterface,)


class TestrunReport(graphene.Mutation):
    """Generates or gets report, depending on whether report has already been generated recently
    """

    class Arguments:
        execution_id = graphene.UUID(required=True, description='execution id for which to get or generate report')

    Output = TestrunReportInterface

    def mutate(self, info, execution_id, debug=False):
        role, user_id = gql_util.get_request_role_userid(
            info, (const.ROLE_ADMIN, const.ROLE_TENANT_ADMIN, const.ROLE_MANAGER, const.ROLE_TESTER))

        response = generate_report(current_app.config, execution_id)
        return TestrunReportResponse(response)
