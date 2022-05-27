from . import login, session


def register_app(app):
    """
    These registers auth pages
    """
    app.register_blueprint(login.bp, url_prefix='/auth')
    app.register_blueprint(session.bp, url_prefix='/auth')
