import jwt
from jwt.algorithms import RSAAlgorithm
from functools import wraps
from flask import current_app, request

from services.logger import setup_custom_logger

logger = setup_custom_logger(__file__)


class AuthError(Exception):
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code


# Format error response and append status code
def get_token_auth_header():
    """Obtains the Access Token from the Authorization Header"""

    auth = request.headers.get("Authorization", None)
    if not auth:
        raise AuthError({"code": "authorization_header_missing",
                        "description":
                            "Authorization header is expected"}, 401)

    parts = auth.split()

    if parts[0].lower() != "bearer":
        raise AuthError({"code": "invalid_header",
                        "description":
                            "Authorization header must start with"
                            " Bearer"}, 401)
    elif len(parts) == 1:
        raise AuthError({"code": "invalid_header",
                        "description": "Token not found"}, 401)
    elif len(parts) > 2:
        raise AuthError({"code": "invalid_header",
                        "description":
                            "Authorization header must be"
                            " Bearer token"}, 401)

    token = parts[1]
    return token


def requires_auth(func):
    """Determines if the Access Token is valid"""

    @wraps(func)
    def decorated(*args, **kwargs):
        token = get_token_auth_header()
        config = current_app.config
        try:
            if config.get("AUTH_PROVIDER", 'BOLT') == 'AUTH0':
                public_key = RSAAlgorithm.from_jwk(config.get("JWT_AUTH_JASON"))
                jwt.decode(token, public_key, options={"verify_aud": False}, algorithms='RS256')
            else:
                jwt.decode(token, config.get("JWT_AUTH_PUBLIC_KEY"), options={"verify_aud": False}, algorithms='RS256')
        except jwt.ExpiredSignatureError:
            raise AuthError({"code": "token_expired",
                            "description": "token is expired"}, 401)
        except Exception as err:
            logger.error(f"Parse auth token error: {err}")
            raise AuthError({"code": "invalid_header",
                            "description":
                                "Unable to parse authentication"
                                " token."}, 401)

        return func(*args, **kwargs)
    return decorated
