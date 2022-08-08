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

import json
import os
import subprocess
from binascii import hexlify
from typing import Optional


class GoogleCloudBuildError(Exception):
    ...


class GoogleCloudBuild:
    _account_activated = False

    @classmethod
    def activate_service_account(cls):
        if cls._account_activated:
            return

        credentials_path = os.environ['GOOGLE_APPLICATION_CREDENTIALS']
        with open(credentials_path) as fd:
            client_email = json.load(fd)['client_email']

        command = [
            'gcloud',
            'auth',
            'activate-service-account',
            client_email,
            '--key-file',
            credentials_path,
        ]
        result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        if result.returncode != 0:
            raise GoogleCloudBuildError('Failed to activate service account.')

        cls._account_activated = True

    def build(self, dir_path: str, new_docker_image: str, prev_docker_image: Optional[str] = None):
        config_file_path = self._prepare_config(dir_path, new_docker_image, prev_docker_image)
        command = [
            'gcloud',
            'builds',
            'submit',
            '--config',
            config_file_path,
        ]
        result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, cwd=dir_path)

        if result.returncode != 0:
            raise GoogleCloudBuildError(result.stderr.decode())

    def _prepare_config(self, dir_path, new_docker_image, prev_docker_image) -> str:
        config = json.dumps(self._create_config(new_docker_image, prev_docker_image))
        config_file_name = f'.cloud_build_config_{hexlify(os.urandom(20)).decode()}.json'
        config_file_path = os.path.join(dir_path, config_file_name)
        with open(config_file_path, 'w') as fd:
            fd.write(config)
        return config_file_path

    def _create_config(self, new_docker_image: str, prev_docker_image: Optional[str] = None):
        builder_docker_image = f'{new_docker_image.rsplit(":", 1)[0]}:builder'
        steps = []
        images = [new_docker_image, builder_docker_image]

        # pull previous build
        if prev_docker_image:
            steps.append({
                'name': 'gcr.io/cloud-builders/docker',
                'entrypoint': 'bash',
                'args': [
                    '-c',
                    f'docker pull {prev_docker_image}; true'
                ],
            })

        # pull builder intermediate image
        steps.append({
            'name': 'gcr.io/cloud-builders/docker',
            'entrypoint': 'bash',
            'args': [
                '-c',
                f'docker pull {builder_docker_image}; true'
            ],
        })

        # build builder
        steps.append({
            'name': 'gcr.io/cloud-builders/docker',
            'args': [
                'build',
                '--target', 'builder',
                '--cache-from', builder_docker_image,
                '-t', builder_docker_image,
                '.',
            ],
        })

        # build image
        if prev_docker_image:
            steps.append({
                'name': 'gcr.io/cloud-builders/docker',
                'args': [
                    'build',
                    '--cache-from', prev_docker_image,
                    '--cache-from', builder_docker_image,
                    '-t', new_docker_image,
                    '.'
                ],
            })
        else:
            steps.append({
                'name': 'gcr.io/cloud-builders/docker',
                'args': [
                    'build',
                    '--cache-from', builder_docker_image,
                    '-t', new_docker_image,
                    '.'
                ],
            })

        config = {
            'steps': steps,
            'images': images,
            'logsBucket': os.environ['GOOGLE_LOGS_BUCKET']
        }

        return config

    def check_if_image_exist(self, registry_address: str, image_tag: str):
        command = [
            'gcloud',
            'container',
            'images',
            'list-tags',
            '--filter',
            f'tags:{image_tag}',
            registry_address,
        ]
        result = subprocess.run(command, stdout=subprocess.PIPE)

        if result.returncode != 0:
            raise GoogleCloudBuildError(result.stderr.decode())

        response_length = len(result.stdout)
        return bool(response_length)


if __name__ == '__main__':
    gcb = GoogleCloudBuild()
    print(json.dumps(gcb._create_config("eu.gcr.io/acai-bolt/bolt-deployer-builds:tenants1-new",
                                        "eu.gcr.io/acai-bolt/bolt-deployer-builds:tenants1-old"), indent=4))
