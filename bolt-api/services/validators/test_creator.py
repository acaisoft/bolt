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

from services.logger import setup_custom_logger
from services.models import TestConfiguration

logger = setup_custom_logger(__name__)


def validate_test_creator(json_data, min_wait, max_wait):
    assert bool(json_data), f'json data is required'
    # logger.info(f'Executed validator for Test Creator with data: {json_data}, {min_wait}, {max_wait}')
    try:
        data = json.loads(json_data)
    except json.decoder.JSONDecodeError:
        assert None, 'Error during converting JSON data to python Dict'
    else:
        # validate min/max wait values
        if not isinstance(min_wait, int) or not isinstance(max_wait, int):
            assert None, 'Min wait and Max wait must be integers'
        if min_wait < 50:
            assert None, 'Min wait value should be greater than or equal 50 ms'
        elif max_wait < 100:
            assert None, 'Max wait value should be greater than or equal 100 ms'
        elif min_wait > max_wait:
            assert None, 'Max wait should be greater than Min wait'
        # validate test creator fields
        test_configuration = TestConfiguration({
            'test_type': data.get('test_type'), 'global_headers': data.get('global_headers')})
        test_configuration.set_endpoints(data.get('endpoints'))
        test_configuration.set_setup_endpoints(data.get('setup'))
        test_configuration.set_teardown_endpoints(data.get('teardown'))
        test_configuration.set_on_start_endpoints(data.get('on_start'))
        test_configuration.set_on_stop_endpoints(data.get('on_stop'))
        test_configuration.validate()
