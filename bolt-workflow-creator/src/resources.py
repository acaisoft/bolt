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

import falcon

from src import custom_logger
from src.argo import create_argo_workflow
from src.schemas import WorkflowSchema
from src.services import KubernetesServiceABC


logger = custom_logger.setup_custom_logger(__file__)


class HealthCheckResource:
    def on_get(self, request, response):
        response.media = {"status": "ok"}


class WorkflowsResource:
    def __init__(self, kubernetes_service: KubernetesServiceABC):
        self.kubernetes_service = kubernetes_service

    def on_post(self, request: falcon.Request, response: falcon.Response):
        schema = WorkflowSchema()
        request_payload = request.media
        logger.info(f"Request to proceed: {request_payload}")
        result = schema.load(request_payload)

        if result.errors:
            logger.error(f"Invalid workflows response: {result.errors}")
            raise falcon.HTTPBadRequest(result.errors)

        workflow = result.data
        argo_workflow = create_argo_workflow(workflow)

        logger.info(f"Creating argo workflow in the kubernetes service.")
        output = self.kubernetes_service.create_argo_workflow(argo_workflow)
        logger.info(f"The argo workflow has been created successfully.")

        response.media = output["metadata"]
        response.status = falcon.HTTP_OK
