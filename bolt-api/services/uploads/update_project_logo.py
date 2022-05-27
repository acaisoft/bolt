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

from services import const
from services.hasura import hce


def get_object_public_url(object_id):
    public_bucket_name = const.BUCKET_PUBLIC_UPLOADS
    path = f'https://storage.googleapis.com/{public_bucket_name}/{object_id}'
    return path


def update_project_logo(config, object_id):
    """
    Update project's image_url column value for row id == object_id with a path to public bucket resource.
    Example image_url: https://storage.googleapis.com/media.bolt.acaisoft.io/75ad7d47-edad-4997-896f-aeb4d42701bf
    :param config: flask app.config
    :param public_bucket_name:
    :param object_id:
    :return: None
    """
    # update matching project, ignore errors or invalid objects
    path = get_object_public_url(object_id)
    resp = hce(config, '''mutation ($id:uuid!, $path:String!) {
        update_project(
            where:{ id:{ _eq:$id } }
            _set:{ image_url:$path }
        ) { affected_rows }
    }''', variable_values={
        'id': object_id,
        'path': path,
    })
