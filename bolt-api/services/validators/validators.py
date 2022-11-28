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

from services import const


def validate_time(value: str):
    value = value.strip()
    assert value, 'test duration parameter is required'
    assert value.isdigit(), f'expected numeric value of seconds for duration, got {value}'
    assert int(value) <= const.TESTRUN_MAX_DURATION, f'maximum testrun duration {const.TESTRUN_MAX_DURATION} seconds'
    return value


def validate_duration(value: str):
    assert value is not None, 'monitoring duration parameter is required'
    value = value.strip()
    assert value, 'monitoring duration parameter is required'
    assert value.isdigit(), f'expected numeric value of seconds for monitoring duration, got {value}'
    return value


def validate_interval(value: str):
    assert value is not None, 'monitoring interval parameter is required'
    value = value.strip()
    assert value, 'monitoring interval parameter is required'
    assert value.isdigit(), f'expected numeric value of seconds for monitoring interval, got {value}'
    assert int(value) >= const.MONITORING_MIN_INTERVAL, f'monitoring interval must be larger than {const.MONITORING_MIN_INTERVAL}'
    return value


def validate_users(value: str):
    value = value.strip()
    assert value, 'number of users is required'
    assert value.isdigit(), f'expected numeric value for number of users, got {value}'
    assert int(value) <= const.TESTRUN_MAX_USERS, f'maximum simultaneous users limit is {const.TESTRUN_MAX_USERS}'
    return value


def validate_rampup(value: str):
    value = value.strip()
    assert value, 'user rampup rate is required'
    assert value.isdigit(), f'expected numeric value for user rampup, got {value}'
    assert int(value) <= 1000, 'maximum users ramp up is 1000'
    return value


def validate_url(value: str, required=True, key='hostname'):
    value = value.strip()
    if required:
        assert value, f'{key} is required'
    if value:
        assert len(value) > 10, f'{key} too short'
        assert value.startswith('http://') or value.startswith('https://'), f'missing protocol in {key} ({value})'
    return value


def validate_locustfile_name(value: str, required=True, key='locustfile_name'):
    value = value.strip()
    if required:
        assert value, f'{key} is required'
    if value:
        assert len(value) > 4, f'{key} too short'
        assert value.endswith('.py'), f'extension not found in tests file name {key} ({value})'
        assert ('/' not in value) and ('\\' not in value),\
            f'tests file has to reside in repository root {key} ({value})'
    return value


def validate_repository_branch(value: str, required=True, key='repository_branch'):
    value = value.strip()
    if required:
        assert value, f'{key} is required'
    if value:
        assert len(value) > 2, f'{key} too short'
        assert ' ' not in value, f'spaces not allowed in {key}'
    return value


def validate_text(value: str, required=True, key='name'):
    value = value.strip()
    if required:
        assert value, f'{key} is required'
    if value:
        assert len(value) > 2, f'{key} is too short'
        assert len(value) <= 512, f'{key} is too long'
    return value


VALIDATORS = {
    '-t': validate_time,
    '-u': validate_users,
    '-r': validate_rampup,
    '-H': validate_url,
    '-md': validate_duration,
    '-mi': validate_interval,
    '-f': validate_locustfile_name,
    '-b': validate_repository_branch,
    'n/a': lambda x: True
}

if __name__ == '__main__':
    import doctest

    doctest.testmod()
