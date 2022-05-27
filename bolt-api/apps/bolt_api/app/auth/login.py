from flask import Blueprint, request, render_template, flash, redirect, current_app, make_response
from urllib.parse import urlparse

from apps.bolt_api.app.utils.token import generate_token
from services import const
from services.logger import setup_custom_logger

logger = setup_custom_logger(__file__)
bp = Blueprint('auth-login', __name__)


@bp.route('/login', methods=['GET', 'POST'])
def login():
    redirect_url = request.args.get('redirect_url', False)
    priv_key = current_app.config.get(const.JWT_AUTH_PRIV_KEY, False)
    logger.info(current_app.config.get(const.AUTH_LOGIN))

    if request.method == 'POST':
        login = request.form['login']
        password = request.form['password']

        if login != current_app.config.get(const.AUTH_LOGIN) or \
                password != current_app.config.get(const.AUTH_PASSWORD):
            flash('Invalid credentials', 'error')
        else:
            token = generate_token(current_app.config, priv_key)

            parsed_url = urlparse(redirect_url)
            app_url = f"{parsed_url.scheme}://{parsed_url.netloc}"
            base_url = urlparse(request.base_url)

            response = make_response(redirect(redirect_url))

            if current_app.config.get(const.AUTH_LOCAL_DEV, False):
                response.set_cookie('AUTH_TOKEN', token, samesite='None', secure=True)
                response.set_cookie('APP_URL', app_url, samesite='None', secure=True)
            else:
                response.set_cookie('AUTH_TOKEN', token, domain=base_url.netloc, samesite='None', secure=True)
                response.set_cookie('APP_URL', app_url, domain=base_url.netloc, samesite='None', secure=True)

            return response

    if not priv_key:
        flash('Service is not configured properly', 'error')

    if not redirect_url:
        flash('Expected "redirect_url" parameter in URL', 'error')

    return render_template('auth/login.html')
