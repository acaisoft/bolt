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

from services.const import MOCK_REPOSITORY
from services.testing.testing_util import BoltCase


class TestRepositoryMutations(BoltCase):

    def test_create_repo(self):
        name = 'test repository 1'
        repo = f'{MOCK_REPOSITORY}/one.git'
        resp = self.gql_client('''mutation ($name:String!, $repo:String!, $id:UUID!) {
            testrun_repository_create (
                name:$name
                project_id:$id
                repository_url:$repo
                type_slug:"load_tests"
            ) { returning { name repository_url type_slug } }
        }''', {
            'id': BoltCase.recorded_project_id,
            'name': name,
            'repo': repo,
        })
        self.assertIsNone(resp.errors(), 'expected no errors')
        self.assertCountEqual({
            'name': name,
            'repository_url': repo,
            'type_slug': 'load_tests',
        }, resp.one('testrun_repository_create'), 'expected repository details')

    def test_update_repo(self):
        name = 'updated repository'
        repo = f'{MOCK_REPOSITORY}/two.git'
        resp = self.gql_client('''mutation ($name:String!, $repo:String!, $id:UUID!) {
            testrun_repository_update (
                id:$id
                name:$name
                repository_url:$repo
            ) { returning { name repository_url } }
        }''', {
            'id': self.recorded_repo_id,
            'name': name,
            'repo': repo,
        })
        self.assertIsNone(resp.errors(), 'expected no errors')
        self.assertCountEqual({
            'name': name,
            'repository_url': repo,
        }, resp.one('testrun_repository_update'), 'expected repository was updated')

    def test_delete_repo(self):
        name = 'updated repository'
        repo = f'{MOCK_REPOSITORY}/two.git'
        resp = self.gql_client('''mutation ($id:UUID!) {
            testrun_repository_delete (
                pk:$id
            ) { returning { name repository_url } }
        }''', {
            'id': self.recorded_repo_id,
        })
        self.assertIsNone(resp.errors(), 'expected no errors')
        self.assertCountEqual({
            'name': name,
            'repository_url': repo,
        }, resp.one('testrun_repository_delete'), 'expected repository data was returned')
