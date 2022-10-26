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
import shutil
import tempfile
from distutils.dir_util import copy_tree

import git

from dataclasses import dataclass


class ValidationError(Exception):
    ...


@dataclass
class RepoTar:
    basename: str
    path: str

    def clear(self):
        if os.path.exists(self.path):
            os.remove(self.path)


class LocustWrapper:
    tar_basename = '.'
    commit_hash = ''

    _template_path: str
    _wrapper_template_url = 'https://github.com/acaisoft/bolt-wrapper.git'
    _wrapper_template_branch = 'revival'
    _wrapper_repo = git.Repo

    def __init__(self):
        self._load_wrapper_template()

    def wrap(self, directory: str, no_cache=False):
        self._validate_repo(directory)
        if no_cache:
            self._reload_wrapper_template()
        copy_tree(self._template_path, directory)

        requirements_txt_path = os.path.join(directory, 'requirements.txt')
        if not os.path.exists(requirements_txt_path):
            open(requirements_txt_path, 'w').close()

    def _validate_repo(self, direcotry):
        module_path = os.path.join(direcotry, 'tests')

        if not os.path.exists(os.path.join(module_path, '__init__.py')):
            raise ValidationError('"tests" directory in repository is not a python module. Missing "__init__.py" file.')

    def _load_wrapper_template(self):
        template_path = tempfile.mkdtemp()
        self._wrapper_repo = git.Repo.clone_from(
            self._wrapper_template_url,
            template_path,
            branch=self._wrapper_template_branch,
            depth=1,
        )

        self.commit_hash = self._wrapper_repo.head.object.hexsha

        shutil.rmtree(os.path.join(template_path, '.git'))

        self._template_path = template_path

    def _reload_wrapper_template(self):
        old_template_path = self._template_path
        self._load_wrapper_template()
        shutil.rmtree(old_template_path)
