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

from marshmallow import Schema
from marshmallow import fields
from marshmallow import post_load

from .dao import JobLoadTests
from .dao import JobMonitoring
from .dao import JobPostStop
from .dao import JobPreStart
from .dao import JobReport
from .dao import Workflow
from .dao import JobMetricWatcher


class PreStartSchema(Schema):
    env_vars = fields.Dict()


class PostStopSchema(Schema):
    env_vars = fields.Dict()


class MonitoringSchema(Schema):
    env_vars = fields.Dict()


class MetricWatcherSchema(Schema):
    env_vars = fields.Dict()


class LoadTestsSchema(Schema):
    env_vars = fields.Dict()
    users = fields.Integer()
    workers = fields.Integer()
    host = fields.String(allow_none=True)
    port = fields.Integer(allow_none=True)
    file = fields.String(allow_none=True)


class JobReportSchema(Schema):
    env_vars = fields.Dict()


class WorkflowSchema(Schema):
    tenant_id = fields.Str(required=True)
    project_id = fields.Str(required=True)

    execution_id = fields.Str(required=True)
    auth_token = fields.Str(required=True)

    repository_url = fields.Str(required=True)
    branch = fields.Str(required=True)

    duration_seconds = fields.Integer(required=True)

    job_pre_start = fields.Nested(PreStartSchema, load_default=None)
    job_post_stop = fields.Nested(PostStopSchema, load_default=None)
    job_monitoring = fields.Nested(MonitoringSchema, load_default=None)
    job_load_tests = fields.Nested(LoadTestsSchema, load_default=None)
    job_metric_watcher = fields.Nested(MetricWatcherSchema, load_default=None)
    job_report = fields.Nested(JobReportSchema, load_default=None)

    no_cache = fields.Boolean(required=False, load_default=False)

    @post_load
    def make_workflow(self, data, **kwargs):
        if data.get("job_pre_start") is not None:
            data["job_pre_start"] = (
                JobPreStart(**data["job_pre_start"])
            )
        if data.get("job_post_stop") is not None:
            data["job_post_stop"] = (
                JobPostStop(**data["job_post_stop"])
            )
        if data.get("job_monitoring") is not None:
            data["job_monitoring"] = (
                JobMonitoring(**data["job_monitoring"])
            )
        if data.get("job_load_tests") is not None:
            data["job_load_tests"] = (
                JobLoadTests(**data["job_load_tests"])
            )
        if data.get("job_metric_watcher") is not None:
            data["job_metric_watcher"] = (
                JobMetricWatcher(**data["job_metric_watcher"])
            )
        if data.get("job_report") is not None:
            data["job_report"] = (
                JobReport(**data["job_report"])
            )
        return Workflow(**data)
