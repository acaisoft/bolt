from . import process_test


def register_app(app):
    """
    These registers auth pages
    """
    app.register_blueprint(process_test.bp, url_prefix='/external_tests')
