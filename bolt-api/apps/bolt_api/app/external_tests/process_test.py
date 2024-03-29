import json
from flask import Blueprint, request, current_app, make_response
from services.logger import setup_custom_logger
from marshmallow.exceptions import ValidationError
from apps.bolt_api.app.external_tests.schemas import ProcessTestSchema
from apps.bolt_api.app.external_tests.parsers import JunitParser
from apps.bolt_api.app.auth.requires_auth import requires_auth


logger = setup_custom_logger(__file__)
bp = Blueprint('external-tests', __name__)


@bp.route('/upload_external_tests', methods=['POST'])
def upload_external_tests():
    try:
        data = ProcessTestSchema().loads(request.form.get('data'))
    except ValidationError as err:
        return current_app.response_class(
            response=json.dumps({"errors": err.messages}),
            status=400,
            mimetype="application/json",
        )
    root = JunitParser(request.files['file'], data).process_xml()
    return make_response({"data": root})

