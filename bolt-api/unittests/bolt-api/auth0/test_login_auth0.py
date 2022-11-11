LOGIN_ROUTE = '/auth/login'


def test_login_get_no_priv_key(app_critical_config_auth0, client_critical_config_auth0):
    resp = client_critical_config_auth0.get(LOGIN_ROUTE)
    assert 'Service is not configured properly' in resp.text


