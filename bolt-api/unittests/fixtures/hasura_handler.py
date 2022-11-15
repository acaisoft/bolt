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
