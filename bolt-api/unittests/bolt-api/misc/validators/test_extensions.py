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

import unittest

from services.validators import validate_extensions


class TestExtensionsValidation(unittest.TestCase):

    def test_correct_data(self):
        ins = [
            {
                "type": "nfs",
                "extension_params": [
                    {"name": "server", "value": "1.2.3.4"},
                    {"name": "path", "value": "/bob/sinclair"},
                    {"name": "mount_options", "value": "async"},
                    {"name": "mount_options", "value": "ro"},
                ]
            }
        ]
        out = validate_extensions(ins)
        expected = [{
            'name': 'nfs',
            'server': '1.2.3.4',
            'path': '/bob/sinclair',
            'mounts_per_worker': 1,
            'mount_options': ['async', 'ro'],
        }]
        self.assertEqual(expected, out)

    def test_invalid_data(self):
        ins = [
            {
                "type": "nfs",
                "extension_params": [
                    {"name": "server", "value": "1.2.3.4"},
                    {"name": "path", "value": "/bob/sinclair"},
                    {"name": "invalid_options", "value": "invalid value"},
                ]
            }
        ]
        try:
            validate_extensions(ins)
        except AssertionError as e:
            out = str(e)
        else:
            out = 'did not raise AssertionError'
        expected = '''invalid option for "nfs": "invalid_options", valid choices are: ('server', 'path', 'mounts_per_worker', 'mount_options')'''
        self.assertEqual(expected, out)
