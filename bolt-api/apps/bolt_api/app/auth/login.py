import json
import requests
from flask import Blueprint, request, render_template, flash, redirect, current_app, make_response, jsonify, abort, g
from urllib.parse import urlparse

from apps.bolt_api.app.utils.token import generate_token
from apps.bolt_api.app.auth0_client import ProcessBoltUser
from apps.bolt_api.app.auth.requires_auth import requires_auth
from services import const
from services.logger import setup_custom_logger

logger = setup_custom_logger(__file__)
bp = Blueprint('auth-login', __name__)


@bp.errorhandler(requests.exceptions.HTTPError)
def http_error_handler(ex: requests.exceptions.HTTPError):
    # TODO format error response message, now returns string with full auth0 err message
    return current_app.response_class(
        response=json.dumps({"errors": ex.response.text}),
        status=400,
        mimetype="application/json",
    )


@bp.errorhandler(ValueError)
def value_error_handler(ex: ValueError):
    # TODO format error response message, now returns string with full auth0 err message
    return current_app.response_class(
        response=json.dumps({"errors": str(ex)}),
        status=400,
        mimetype="application/json",
    )


@bp.route('/login', methods=['GET', 'POST'])
def login():
    redirect_url = request.args.get('redirect_url', False)
    priv_key = current_app.config.get(const.JWT_AUTH_PRIV_KEY, False)
    g.__setattr__('errors', [])
    code = 200

    if request.method == 'POST':
        login = request.form['login']
        password = request.form['password']

        if login != current_app.config.get(const.AUTH_LOGIN) or \
                password != current_app.config.get(const.AUTH_PASSWORD):
            g.get('errors').append('Invalid credentials')
            code = 401
        else:
            token = generate_token(current_app.config, priv_key)

            parsed_url = urlparse(redirect_url)
            app_url = f"{parsed_url.scheme}://{parsed_url.netloc}"
            base_url = urlparse(request.base_url)

            response = make_response(redirect(redirect_url))

            if current_app.config.get(const.AUTH_PROVIDER, 'BOLT') == 'BOLT':
                response.set_cookie('AUTH_TOKEN', token, samesite='None', secure=True)
                response.set_cookie('APP_URL', app_url, samesite='None', secure=True)
            else:
                response.set_cookie('AUTH_TOKEN', token, domain=base_url.netloc, samesite='None', secure=True)
                response.set_cookie('APP_URL', app_url, domain=base_url.netloc, samesite='None', secure=True)

            return response

    if not priv_key:
        g.get('errors').append('Service is not configured properly')

    if not redirect_url:
        g.get('errors').append('Expected "redirect_url" parameter in URL')

    return render_template('auth/login.html'), code


@bp.route('/process_user', methods=['POST'])
@requires_auth
def process_user():
    email = request.get_json().get('email')
    project_id = request.get_json().get('project_id')
    ProcessBoltUser(email, project_id, current_app.config).process_user()
    return jsonify({'messages': f'User: {email} successfully assigned to project {project_id}'})

