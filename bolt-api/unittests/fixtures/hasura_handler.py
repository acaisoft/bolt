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

from .test_const import ERROR_FLAGS, ERROR_MESSAGE_HCE


class MockConfigurationException(Exception):
    ...


def hasura_handler(request, context, **kwargs):
    resp = {"data": {}}
    variables = {}
    if request.text == '':
        resp = {**resp, **get_error("invalid-json", "Error in $: not enough input")}
    try:
        query = json.loads(request.text.replace("\\n", ""))
        if "variables" in query:
            variables = query["variables"]
            if "data" in variables:
                variables = variables["data"]
        if "query" in query:
            query = query["query"].replace(" ", "")
        elif "mutation" in query:
            query = query["mutation"].replace(" ", "")
    except Exception:
        raise MockConfigurationException('Not implemented')
    if variables:
        for val in variables.values():
            for flag in ERROR_FLAGS:
                if flag in val:
                    resp = {**resp, **get_error("SyntheticTestError", ERROR_MESSAGE_HCE)}
    if 'id' in query:
        collection = query.split("{")[1]
        resp["data"] = {**resp["data"], **get_entry(collection, "id")}
    return resp


def get_error(code, msg):
    return {
        "errors": [
            {
                "extensions": {
                    "path": "$",
                    "code": code
                },
                "message": msg
            }
        ]
    }


def get_entry(collection, field):
    return {collection: [{field: 'test'}]}
