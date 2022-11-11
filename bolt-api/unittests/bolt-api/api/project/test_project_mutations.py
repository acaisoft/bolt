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

from services.testing.testing_util import BoltCase


class TestProjectMutations(BoltCase):
    # recorded created project
    o = {
        'id': BoltCase.recorded_project_id,
        'name': 'test project 1',
        'description': 'test project description',
    }
    u = {
        'id': BoltCase.recorded_project_id,
        'name': 'new name',
        'description': 'new description',
    }

    def test_create_project(self):
        resp = self.gql_client('''mutation ($name:String!, $description:String!) {
            testrun_project_create (
                name:$name
                description:$description
            ) { returning {id name description} }
        }''', {'name': self.o['name'], 'description': self.o['description']})
        self.assertIsNone(resp.errors(), 'expected no errors')
        self.assertCountEqual(self.o, resp.one('testrun_project_create'), 'expected returned data to match')

    def test_update_project(self):
        resp = self.gql_client('''mutation ($id:UUID!, $name:String!, $description:String!) {
            testrun_project_update (
                id: $id
                name: $name
                description: $description
            ) { returning { id name description } }
        }''', self.u)
        self.assertIsNone(resp.errors(), 'expected no errors')
        self.assertCountEqual(self.u, resp.one('testrun_project_update'), 'expected data to have been updated')

    def test_soft_delete_project(self):
        resp = self.gql_client('''mutation ($id:UUID!) {
            testrun_project_delete (
                pk: $id
            ) { returning { id name description } }
        }''', {'id': self.o['id']})
        self.assertIsNone(resp.errors(), 'expected no errors')
        self.assertCountEqual(self.u, resp.one('testrun_project_delete'), 'expected data to have been returned')

    def test_project_summary(self):
        resp = self.gql_client('''query {
            testrun_project_summary { projects { name description } }
        }''', {})
        self.assertIsNone(resp.errors(), 'expected no errors')
