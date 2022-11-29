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
import io
from .fixtures.junit_valid_values import EXPECTED_RESPONSE as JUNIT_VALID_EXPECTED_RESPONSE
from . import TEST_JUNIT_PATH

from services.testing.testing_util import BoltCase

FAKE_UUIDS = [
    'bea05e03-aa11-43ea-a390-a2ea774a4b5d',
    'c70a8df4-a5fd-455e-976d-73d672155cc9',
    'b373d93b-d5d2-44d5-b076-969a3e003db2',
    '960cdac2-f58b-4b36-ae88-4d48f3d8b837',
    '6a32907e-781f-4f2f-a25d-72089d62377e',
    'b24398ea-d41a-488f-88b7-173851472583',
    'beb23af0-c798-407c-a289-0082d314e462',
    'f0dd2a7b-91b7-4f02-9445-91e82b8b8885',
    'aa7d6883-f281-4e54-a779-50ddf4c68277',
    '3eabbe3b-e727-4cbc-8ee3-eb71f9908e05',
    'f7b34f94-909c-4a11-96d1-9ee74fba1fa3',
    'cd765630-afec-40d5-966e-0d1b8ab66241',
    'b7914590-ddc8-43b5-bbc7-dbb7d0f12453',
    'b90081a4-ca44-4a9a-b3c9-9d5d5c589cdf',
    '9da7e5ff-bf9e-483e-aa54-3383219c1be1',
    '4fde042a-6ea6-4249-a5da-56e0af52ea88'
]

with open(f"{TEST_JUNIT_PATH}/fixtures/junit_valid.xml", "rb") as f:
    JUNIT_VALID = f.read()


class TestExternalTestIngestion(BoltCase):

    def test_junit_digestible(self):
        with self.patch("junit_parser", uuids=FAKE_UUIDS):
            response = self.client.post(
                path="external_tests/upload_external_tests",
                data={
                    "data": f"""{{
                        "scenario_id": "{self.recorded_e2e_config_id}",
                        "project_id": "{self.recorded_project_id}",
                        "custom_fields": {{}},
                        "report_format": "JUNITXML"
                    }}""",
                    "file": (io.BytesIO(JUNIT_VALID), "test.xml")
                }
            )
        self.assertEqual(response.json(), JUNIT_VALID_EXPECTED_RESPONSE)

    def test_junit_invalid_format(self):
        response = self.client.post(
            path="external_tests/upload_external_tests",
            data={
                "data": f"""{{
                    "scenario_id": "{self.recorded_e2e_config_id}",
                    "project_id": "{self.recorded_project_id}",
                    "custom_fields": {{}},
                    "report_format": "THAT_IS_NOT_GOING_TO_WORK"
                }}""",
                "file": (io.BytesIO(JUNIT_VALID), "test.xml")
            }
        )
        self.assertEqual(response.json(), {'errors': {'report_format': ['Not allowed report type']}})
