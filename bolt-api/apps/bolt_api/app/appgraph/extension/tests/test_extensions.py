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

from services import const
from services.testing.testing_util import BoltCase


class TestExtentionMutations(BoltCase):

    def setUp(self) -> None:
        super().setUp()
        # disable keycloack integration as that communication returns random ids not suitable for vcr
        os.environ['SELFSIGNED_TOKEN_FOR_TESTRUNNER'] = '1'
        os.environ['SELFSIGNED_TOKEN_EXECUTION_ID'] = self.recorded_execution_id

    def tearDown(self) -> None:
        os.unsetenv('SELFSIGNED_TOKEN_FOR_TESTRUNNER')
        os.unsetenv('SELFSIGNED_TOKEN_EXECUTION_ID')