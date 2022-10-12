from marshmallow import Schema, fields, validates, exceptions

ALLOWED_REPORTS_FORMATS = ["JUNITXML"]


class ProcessTestSchema(Schema):
    project_id = fields.UUID(required=True)
    scenario_id = fields.UUID(required=True)
    custom_fields = fields.Dict()
    report_format = fields.Str(required=True)

    @validates("report_format")
    def validate_report_format(self, value):
        if value not in ALLOWED_REPORTS_FORMATS:
            raise exceptions.ValidationError("Not allowed report type")
