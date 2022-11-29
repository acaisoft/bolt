# Copyright (c) 2022 Acaisoft
#
# Permission is hereby granted, free of charge, to any person obtaining a copy of
# this software and associated documentation files (the "Software"), to deal in
# the Software without restriction, including without limitation the rights to
# use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
# the Software, and to permit persons to whom the Software is furnished to do so,
# subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
# FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
# COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
# IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
# CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import os

import apps.bolt_api.app.remote_schema_check as rsc
from mock import Mock


def do_nothing(*args, **kwargs):
    pass


class TestRemoteSchemaChecker:
    @classmethod
    def setup_class(cls):
        os.environ.__setitem__("WERKZEUG_RUN_MAIN", "true")

    @classmethod
    def teardown_class(cls):
        os.environ.__delitem__("WERKZEUG_RUN_MAIN")

    @staticmethod
    def test_schema_synced(app, fake_hasura_synced, fake_threading, monkeypatch):
        monkeypatch.setattr(rsc, "sleep", do_nothing)
        logger = Mock()
        monkeypatch.setattr(rsc, "logger", logger)
        reload = Mock()
        monkeypatch.setattr(rsc, "request_remote_schema_reload", reload)
        with app.app_context():
            rsc.verify_remote_schema_state(app)
        reload.assert_not_called()
        logger.info.assert_called_with("Hasura is up and remote schema is healthy.")

    @staticmethod
    def test_schema_desync(app, fake_hasura_desync, fake_threading, monkeypatch):
        monkeypatch.setattr(rsc, "sleep", do_nothing)
        logger = Mock()
        monkeypatch.setattr(rsc, "logger", logger)
        reload = Mock()
        monkeypatch.setattr(rsc, "request_remote_schema_reload", reload)
        with app.app_context():
            rsc.verify_remote_schema_state(app)
        reload.assert_called_once()

    @staticmethod
    def test_schema_dead(app, fake_hasura_dead, fake_threading, monkeypatch):
        monkeypatch.setattr(rsc, "sleep", do_nothing)
        logger = Mock()
        monkeypatch.setattr(rsc, "logger", logger)
        with app.app_context():
            rsc.verify_remote_schema_state(app)
        logger.warn.assert_called_with("Remote Schema load failed.\nThis is a high risk of severe functionality loss.")

    @staticmethod
    def test_schema_dead_resurrect(app, fake_hasura_desync_repairable, fake_threading, monkeypatch):
        monkeypatch.setattr(rsc, "sleep", do_nothing)
        logger = Mock()
        monkeypatch.setattr(rsc, "logger", logger)
        with app.app_context():
            rsc.verify_remote_schema_state(app)
        logger.warn.assert_called_with("Hasura is not up. Starting Remote Schema reload watcher.")
        logger.info.assert_any_call("Remote Schema successfully reloaded.")
        logger.info.assert_called_with("Attempt 6: {'message': 'success'}")
