import json


class MockConfigurationException(Exception):
    ...


def hasura_handler(*args, **kwargs):
    resp = {"data": {}}
    if args[0].text == '':
        resp = {**resp, **get_error("invalid-json", "Error in $: not enough input")}
    try:
        query = json.loads(args[0].text.replace("\\n", ""))["query"].replace(" ", "")
    except Exception:
        raise MockConfigurationException('Not implemented')
    if 'id' in query:
        collection = query.split("{")[1]
        resp["data"] = {**resp["data"], **get_entry(collection, "id")}
    return json.dumps(resp)


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
