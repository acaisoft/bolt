from flask import Blueprint, request, make_response
from werkzeug.exceptions import Unauthorized

from services.logger import setup_custom_logger

logger = setup_custom_logger(__file__)
bp = Blueprint('auth-session', __name__)


@bp.route('/session', methods=['GET'])
def session():
    token = request.cookies.get('AUTH_TOKEN', False)
    app_url = request.cookies.get('APP_URL', False)
    if not token or not app_url:
        err = f"Missing cookies:" \
              f"{chr(10) + 'AUTH_TOKEN' if not token else ''}" \
              f"{chr(10) + 'APP_URL' if not app_url else ''}"

        response = make_response(Unauthorized(err))
    else:
        response = make_response({'AUTH_TOKEN': token})
        response.set_cookie('AUTH_TOKEN', expires=0)
        response.set_cookie('APP_URL', expires=0)

    response.headers.add("Access-Control-Allow-Origin", app_url)
    response.headers.add("Access-Control-Allow-Credentials", "true")
    return response
