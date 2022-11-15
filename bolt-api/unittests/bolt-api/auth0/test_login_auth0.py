from requests import HTTPError

from apps.bolt_api.app.auth0_client import ProcessBoltUser
from pytest import raises

from services.configure import ConfigurationError
from services.hasura import generate_hasura_token
from unittests.fixtures.test_const import ERROR_UUID_FLAG, ERROR_MESSAGE_HCE, ERROR_MESSAGE_AUTH0

LOGIN_ROUTE = '/auth/login'


def test_login_get_no_priv_key(app_critical_config_auth0, client_critical_config_auth0):
    resp = client_critical_config_auth0.get(LOGIN_ROUTE)
    assert 'Service is not configured properly' in resp.text


def test_process_user_wrong_domain(app_auth0, fake_auth0):
    with (
        app_auth0.app_context(),
        raises(ValueError) as ve
    ):
        user = ProcessBoltUser('test@email.com', 'project_id', app_auth0.config, processed_by_script=True)
    assert ve.value.args[0] == 'Not trusted email domain'


def test_process_user_malformed_email(app_auth0, fake_auth0):
    with (
        app_auth0.app_context(),
        raises(ValueError) as ve
    ):
        user = ProcessBoltUser('that.wont.work', 'project_id', app_auth0.config, processed_by_script=True)
    assert ve.value.args[0] == 'Incorrect email pattern'


def test_process_user_malformed_project_id(app_auth0, fake_auth0):
    with (
        app_auth0.app_context(),
        raises(ValueError) as ve
    ):
        user = ProcessBoltUser('test@acaisoft.com', 'project_id', app_auth0.config, processed_by_script=True)
    assert ve.value.args[0] == 'badly formed hexadecimal UUID string'


def test_process_user_bad_config(app_critical_config_auth0, fake_auth0):
    with (
        app_critical_config_auth0.app_context(),
        raises(ConfigurationError) as ce
    ):
        user = ProcessBoltUser(
            'test@acaisoft.com',
            'aec53805-703e-46c6-a475-5a28dce0d6e2',
            app_critical_config_auth0.config,
            processed_by_script=True
        )
        user.process_user()
    assert ce.value.args[0] == 'Hasura is not properly configured'


def test_process_user_no_google(app_auth0, fake_auth0):
    with app_auth0.app_context():
        user = ProcessBoltUser(
            'test@acaisoft.com',
            'aec53805-703e-46c6-a475-5a28dce0d6e2',
            app_auth0.config,
            processed_by_script=True
        )
        user.process_user()


def test_process_user_multiple_google(app_auth0, fake_auth0):
    email = 'multiple_google@acaisoft.com'
    with (
        app_auth0.app_context(),
        raises(ValueError) as ve
    ):
        user = ProcessBoltUser(
            email,
            'aec53805-703e-46c6-a475-5a28dce0d6e2',
            app_auth0.config,
            processed_by_script=True
        )
        user.process_user()
    assert ve.value.args[0] == f'More then one google user for email {email}'


def test_process_user_nonexistent_role(app_auth0, fake_auth0, monkeypatch):
    monkeypatch.setattr("apps.bolt_api.app.auth0_client.ROLE_TO_ASSIGN", "nonexistent")
    email = 'single_google@acaisoft.com'
    with (
        app_auth0.app_context(),
        raises(Exception) as e
    ):
        user = ProcessBoltUser(
            email,
            'aec53805-703e-46c6-a475-5a28dce0d6e2',
            app_auth0.config,
            processed_by_script=True
        )
        user.process_user()
    assert e.value.args[0] == "Role nonexistent does not exists in auth0"


def test_process_user_assign_role_error(app_auth0, fake_auth0, fake_hasura):
    email = 'single_google@acaisoft.com'
    with (
        app_auth0.app_context(),
        raises(ValueError) as ve
    ):
        user = ProcessBoltUser(
            email,
            ERROR_UUID_FLAG,
            app_auth0.config,
            processed_by_script=True
        )
        user.process_user()
    assert ERROR_MESSAGE_HCE in ve.value.args[0].args[0]


def test_auth0_token_error(app_auth0, fake_broken_auth0_token):
    email = 'single_google@acaisoft.com'
    with (
        app_auth0.app_context(),
        raises(HTTPError) as he
    ):
        user = ProcessBoltUser(
            email,
            ERROR_UUID_FLAG,
            app_auth0.config,
            processed_by_script=True
        )
        user.process_user()
    assert ERROR_MESSAGE_AUTH0 in he.value.args[0]


def test_auth0_hasura_token_error(app_auth0, fake_broken_auth0_token):
    with (
        app_auth0.app_context(),
        raises(HTTPError) as he
    ):
        generate_hasura_token()
    assert ERROR_MESSAGE_AUTH0 in he.value.args[0]


def test_auth0_list_users_error(app_auth0, fake_broken_auth0_list_email):
    email = 'test@acaisoft.com'
    with (
        app_auth0.app_context(),
        raises(HTTPError) as he
    ):
        user = ProcessBoltUser(
            email,
            ERROR_UUID_FLAG,
            app_auth0.config,
            processed_by_script=True
        )
        user.process_user()
    assert ERROR_MESSAGE_AUTH0 in he.value.args[0]


def test_auth0_roles_error(app_auth0, fake_broken_auth0_get_role):
    email = 'single_google@acaisoft.com'
    with (
        app_auth0.app_context(),
        raises(HTTPError) as he
    ):
        user = ProcessBoltUser(
            email,
            ERROR_UUID_FLAG,
            app_auth0.config,
            processed_by_script=True
        )
        user.process_user()
    assert ERROR_MESSAGE_AUTH0 in he.value.args[0]


def test_process_user_success(app_auth0, fake_auth0, fake_hasura):
    email = 'single_google@acaisoft.com'
    with app_auth0.app_context():
        user = ProcessBoltUser(
            email,
            'aec53805-703e-46c6-a475-5a28dce0d6e2',
            app_auth0.config,
            processed_by_script=True
        )
        user.process_user()

