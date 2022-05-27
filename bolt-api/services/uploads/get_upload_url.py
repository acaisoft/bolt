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

import uuid
from datetime import timedelta, datetime
from google.cloud import storage
from google.cloud.storage._signing import generate_signed_url_v4

from services import const
from services.logger import setup_custom_logger

logger = setup_custom_logger(__name__)


def get_upload_url(config, content_md5, content_type):
    """
    Return an upload and a (temporary) download signed url.
    :param config:
    :param content_md5:
    :param content_type:
    :return:
    """
    object_id = str(uuid.uuid4())
    project_logos_bucket = const.BUCKET_PRIVATE_STORAGE
    rsrc = f'/{project_logos_bucket}/{str(object_id)}'
    logger.info(f'generated upload link points to to https://storage.googleapis.com{rsrc}')

    upload_url = generate_signed_url_v4(
        credentials=storage.Client()._credentials,
        resource=rsrc,
        expiration=datetime.now() + timedelta(minutes=15),
        method='PUT',
        content_md5=content_md5,
        content_type=content_type,
    )

    download_url = generate_signed_url_v4(
        credentials=storage.Client()._credentials,
        resource=rsrc,
        expiration=datetime.now() + timedelta(minutes=60*24),
        method='GET'
    )

    logger.debug(f'links:\n    upload {upload_url}\n    download {download_url}')
    return upload_url, download_url
