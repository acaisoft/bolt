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

import logging
import re
import os
import sys
import tempfile

import git

from execution_stage_log import send_stage_log
from google_cloud_build import GoogleCloudBuild
from locust_wrapper_packer import LocustWrapper

logging.basicConfig(stream=sys.stdout, level=logging.DEBUG)

logger = logging.getLogger(__name__)

IMAGE_REGISTRY_ADDRESS = os.environ['IMAGE_REGISTRY_ADDRESS']
SPECIAL_CHARACTERS_REGEX = re.compile(r"[^A-Za-z0-9]")
NO_CACHE = int(os.environ.get('NO_CACHE')) == 1


def get_image_tag(repo_url: str, commit_hash: str):
    formatted_repo_url = SPECIAL_CHARACTERS_REGEX.sub("-", repo_url)
    return '{url}-{commit_hash}'.format(
        url=formatted_repo_url,
        commit_hash=commit_hash,
    )


def get_docker_image_destination(image_tag: str):
    return '{base_registry}:{image_tag}'.format(
        base_registry=IMAGE_REGISTRY_ADDRESS,
        image_tag=image_tag,
    )


def write_output(docker_image):
    with open('/tmp/image.txt', 'w+') as file:
        file.write(docker_image)


send_stage_log('SUCCEEDED', 'start')

repo_url = os.environ.get('REPOSITORY_URL')
branch = os.environ.get('BRANCH')
repo_path = tempfile.mkdtemp()
tenant_id = os.environ.get('TENANT_ID')
project_id = os.environ.get('PROJECT_ID')

send_stage_log('PENDING', stage='downloading_source')
logger.info(f'Cloning repository {repo_url}, branch {branch}...')
repo = git.Repo.clone_from(repo_url, repo_path, branch=branch, depth=1)
send_stage_log('SUCCEEDED', 'downloading_source')
logger.info(f'Repository cloned to {repo_path}')
tests_head_sha = repo.head.object.hexsha

wrapper = LocustWrapper()
wrapper_head_sha = wrapper.commit_hash

send_stage_log('PENDING', 'image_preparation')
google_cloud_build = GoogleCloudBuild()
google_cloud_build.activate_service_account()
image_tag = get_image_tag(repo_url, f'{tests_head_sha}-{wrapper_head_sha}')
image_address = get_docker_image_destination(image_tag)

if not NO_CACHE:
    is_image_exists = google_cloud_build.check_if_image_exist(IMAGE_REGISTRY_ADDRESS, image_tag)
    if is_image_exists:
        logger.info(f'Found image the registry: {image_address}')
        write_output(image_address)
        send_stage_log('SUCCEEDED', 'image_preparation')
        exit(0)

logger.info('Wrapping repository')
wrapper.wrap(repo_path)
logger.info('Repository wrapped')

logger.info(f'Starting to build image {image_address}')

google_cloud_build.build(repo_path, image_address)
logger.info('Image built')

write_output(image_address)
send_stage_log('SUCCEEDED', 'image_preparation')
