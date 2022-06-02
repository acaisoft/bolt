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

import json
import unittest

from schematics.exceptions import DataError

from services.validators.test_creator import validate_test_creator


class TestTestCreatorValidation(unittest.TestCase):
    @staticmethod
    def _get_fixture(fixture_path):
        with open(fixture_path, 'r') as f:
            return json.dumps(json.load(f))

    def test_validate_with_wrong_data(self):
        # all fields None
        with self.assertRaises(AssertionError) as context:
            validate_test_creator(None, None, None)
        self.assertEqual(str(context.exception), 'json data is required\nassert None')
        # JSON data is empty
        with self.assertRaises(AssertionError) as context:
            validate_test_creator('', None, None)
        self.assertEqual(str(context.exception), 'json data is required\nassert \'\'')
        # wrong JSON structure
        with self.assertRaises(AssertionError) as context:
            validate_test_creator('hello world', None, None)
        self.assertEqual(str(context.exception), 'Error during converting JSON data to python Dict\nassert None')

    def test_validate_min_and_max_wait(self):
        # string min wait
        with self.assertRaises(AssertionError) as context:
            validate_test_creator('{}', '100', 200)
        self.assertEqual(str(context.exception), 'Min wait and Max wait must be integers\nassert None')
        # string max wait
        with self.assertRaises(AssertionError) as context:
            validate_test_creator('{}', 100, '200')
        self.assertEqual(str(context.exception), 'Min wait and Max wait must be integers\nassert None')
        # Max wait < Min wait
        with self.assertRaises(AssertionError) as context:
            validate_test_creator('{}', 200, 150)
        self.assertEqual(str(context.exception), 'Max wait should be greater than Min wait\nassert None')
        # Min wait < 50
        with self.assertRaises(AssertionError) as context:
            validate_test_creator('{}', 49, 100)
        self.assertEqual(str(context.exception), 'Min wait value should be greater than or equal 50 ms\nassert None')
        # Max wait < 100
        with self.assertRaises(AssertionError) as context:
            validate_test_creator('{}', 50, 99)
        self.assertEqual(str(context.exception), 'Max wait value should be greater than or equal 100 ms\nassert None')

    def test_validate_json_fixtures(self):
        # good 1
        json_data = self._get_fixture('services/validators/tests/fixtures/good_1.json')
        self.assertIsNone(validate_test_creator(json_data, 100, 200))
        # good 2
        json_data = self._get_fixture('services/validators/tests/fixtures/good_2.json')
        self.assertIsNone(validate_test_creator(json_data, 100, 200))
        # good 3
        json_data = self._get_fixture('services/validators/tests/fixtures/good_3.json')
        self.assertIsNone(validate_test_creator(json_data, 100, 200))
        # bad 1
        json_data = self._get_fixture('services/validators/tests/fixtures/bad_1.json')
        with self.assertRaises(DataError) as context:
            validate_test_creator(json_data, 100, 200)
        self.assertEqual(str(context.exception), '{"test_type": ["Value must be one of (\'set\', \'sequence\')."]}')
        # bad 2
        json_data = self._get_fixture('services/validators/tests/fixtures/bad_2.json')
        with self.assertRaises(DataError) as context:
            validate_test_creator(json_data, 100, 200)
        self.assertEqual(str(context.exception), '{"payload": ["Only mappings may be used in a DictType"]}')
        # bad 3
        json_data = self._get_fixture('services/validators/tests/fixtures/bad_3.json')
        with self.assertRaises(DataError) as context:
            validate_test_creator(json_data, 100, 200)
        self.assertEqual(str(context.exception), '{"endpoints": ["This field is required."]}')
