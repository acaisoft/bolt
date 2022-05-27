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

from PIL import Image
from google.cloud import storage

from services import const
from services.logger import setup_custom_logger
from services.uploads.thumbnails import SIZES, DEFAULT_SIZE, MAX_ORIGINAL_BYTES

logger = setup_custom_logger(__name__)


def process_image(src_object_id, dst_object_id):
    src_bucket = const.BUCKET_PRIVATE_STORAGE
    dst_bucket = const.BUCKET_PUBLIC_UPLOADS
    process_image_bucket(src_bucket, src_object_id, dst_bucket, dst_object_id)


def process_image_bucket(src_bucket_name, src_object_id, dst_bucket_name, dst_object_id):
    logger.info(f'processing image at {src_bucket_name}/{src_object_id}')
    src_file = f'/tmp/{src_object_id.replace("/", "_")}_original'

    try:
        gsc = storage.Client()
    except Exception as e:
        logger.error(f'cannot connect to gcs: {str(e)}')
        raise

    dst_bucket = gsc.get_bucket(dst_bucket_name)
    src_bucket = gsc.get_bucket(src_bucket_name)
    src_blob = src_bucket.get_blob(src_object_id)
    assert src_blob is not None, f'uploaded image does not exist'

    try:
        src_blob.download_to_filename(src_file)
    except Exception as e:
        logger.error(f'cannot download file locally {dst_object_id}: {str(e)}')

    for size in SIZES:
        out_file = f'/tmp/{dst_object_id.replace("/", "_")}_{size[0]}x{size[1]}'
        dst_blob_name = f'{dst_object_id}/{size[0]}x{size[1]}'

        try:
            img = Image.open(src_file)
        except Exception as e:
            logger.error(f'cannot open file {src_file}: {str(e)}')
            continue

        try:
            img.thumbnail(size)
            img.save(out_file, 'JPEG')
        except Exception as e:
            logger.error(f'cannot write thumbnail file {src_file}: {str(e)}')
            continue

        try:
            dst_blob = dst_bucket.blob(dst_blob_name)
            dst_blob.upload_from_filename(out_file, content_type='image/jpeg')
        except Exception as e:
            logger.error(f'cannot upload file {out_file}: {str(e)}')
            continue

        if size == DEFAULT_SIZE:
            # also copy this size to "root" object
            try:
                dst_blob = dst_bucket.blob(dst_object_id)
                dst_blob.upload_from_filename(out_file, content_type='image/jpeg')
                logger.info(f'uploaded {size} thumbnail to {src_bucket_name}/{dst_object_id}')
            except Exception as e:
                logger.error(f'cannot upload file {out_file} as default: {str(e)}')
                continue

        os.unlink(out_file)
        logger.info(f'uploaded {size} thumbnail to {dst_bucket_name}/{dst_blob_name}')

    if src_blob.size < MAX_ORIGINAL_BYTES:
        dst_blob_name = f'{dst_object_id}/original'
        dst_blob = dst_bucket.blob(dst_blob_name)
        logger.info(f'copying original to {dst_bucket_name}/{dst_blob_name}')
        dst_blob.upload_from_filename(src_file, content_type='image/jpeg')
    else:
        logger.warn(f'not copying original image at {src_bucket_name}/{src_object_id}: file size too large: {src_blob.size}')
    os.unlink(src_file)
