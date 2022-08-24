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

from dataclasses import dataclass
from typing import Dict
from typing import Optional


@dataclass
class JobPreStart:
    env_vars: Optional[Dict[str, str]] = None


@dataclass
class JobPostStop:
    env_vars: Optional[Dict[str, str]] = None


@dataclass
class JobMonitoring:
    env_vars: Optional[Dict[str, str]] = None


@dataclass
class JobLoadTests:
    workers: int
    users: int
    env_vars: Optional[Dict[str, str]] = None
    host: Optional[str] = None
    port: Optional[int] = None
    file: Optional[str] = None


@dataclass
class JobReport:
    env_vars: Optional[Dict[str, str]] = None


@dataclass
class Workflow:
    tenant_id: str
    project_id: str

    repository_url: str
    branch: str

    execution_id: str
    auth_token: str

    duration_seconds: int

    job_pre_start: Optional[JobPreStart]
    job_post_stop: Optional[JobPostStop]
    job_monitoring: Optional[JobMonitoring]
    job_load_tests: Optional[JobLoadTests]
    job_report: Optional[JobReport]

    no_cache: bool
