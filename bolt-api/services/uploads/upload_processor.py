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
import uuid

from google.cloud import storage
from google.cloud import pubsub_v1
from google.cloud.pubsub_v1.subscriber.message import Message

from services import const
from services.uploads.image_processor import process_image_bucket

from services.logger import setup_custom_logger
from services.uploads.update_project_logo import update_project_logo

logger = setup_custom_logger(__name__)

SELF_TEST_MSG = 'self-test'


def upload_processor_controller_factory(app_config, dst_bucket, test_payload):
    # necessary to pass app context to pubsub thread
    def f(pub_msg: Message):

        # handle self-test message
        if pub_msg.data.startswith(bytes(SELF_TEST_MSG.encode('utf-8'))):
            if pub_msg.data == test_payload:
                logger.debug('received test message')
            else:
                logger.debug(f'rejecting other workers test message: {pub_msg.data}, expected: {test_payload}')
                pub_msg.nack()
                return

        # ack early, processing might take a while, errors are safe to ignore (currently)
        pub_msg.ack()

        ev = pub_msg.attributes.get('eventType', None)
        if ev is None:
            # weird ass message, only gcs notifications and self-test expected, debugging leftover
            pub_msg.ack()
            return

        if ev == 'OBJECT_FINALIZE':
            # file has completed upload, pass to processor
            data = json.loads(pub_msg.data)
            bucket_id = pub_msg.attributes.get('bucketId', None)
            object_id = pub_msg.attributes.get('objectId', None)
            mime = data.get('contentType', None)

            if mime is None:
                logger.info(f'received file upload with unknown content-type: {object_id}')

            elif mime in ('image/jpeg', 'image/jpg', 'image/png'):
                if not all((bucket_id, object_id)):
                    logger.error(f'Incomplete object attributes, ignoring upload. Data: {pub_msg.data}')
                    return
                logger.info(f'processing image upload for {object_id}')
                process_image_bucket(bucket_id, object_id, dst_bucket, object_id)
                logger.info(f'processing image done for {object_id}')
                update_project_logo(app_config, object_id)
                logger.info(f'processing project logos done for {object_id}')
        else:
            logger.error(f'unrecognized ')
    return f


def done_callback(message_future):
    # When timeout is unspecified, the exception method waits indefinitely.
    if message_future.exception(timeout=60):
        logger.warn('publishing test message threw an Exception {}.'.format(message_future.exception()))
    else:
        logger.debug('publishing test message success: {}'.format(message_future.result()))


def register_upload_processor(config, test_delivery=False):
    """
    Listen to pubsub subscription for bucket file upload notifications and process uploads accordingly.
    This has the advantage (over processing inside reques handler) that any heavy lifting is done asynchronously in
    a separate thread.
    Call this at start of flask app, pass app.config
    """

    pubsub_name = const.UPLOADS_PUBSUB_SUBSCRIPTION
    dst_bucket = const.BUCKET_PUBLIC_UPLOADS
    worker_id = str(uuid.uuid4())
    test_payload = bytes(f'{SELF_TEST_MSG} {worker_id}'.encode('utf-8'))

    # get credentials from json file
    credentials = storage.Client()._credentials
    # call at startup to connect to the pubsub subscription in
    sub_client = pubsub_v1.SubscriberClient()
    sub = sub_client.subscription_path(credentials._project_id, pubsub_name)
    sub_future = sub_client.subscribe(sub, callback=upload_processor_controller_factory(config, dst_bucket, test_payload))
    logger.debug(sub_future)

    # simple self-test
    if test_delivery:
        publisher = pubsub_v1.PublisherClient()
        topic_path = publisher.topic_path(credentials._project_id, pubsub_name)
        logger.debug(f'publishing test message: {test_payload}')
        push_future = publisher.publish(topic=topic_path, data=test_payload)
        push_future.add_done_callback(done_callback)
