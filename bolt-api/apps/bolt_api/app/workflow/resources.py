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
from typing import Dict, Any

from .argo import Argo
from .schemas import WorkflowSchema

from services.logger import setup_custom_logger
from .kubernetes_service import KubernetesServiceABC


logger = setup_custom_logger(__file__)


class MalformedWorkflowData(Exception):
    ...


class WorkflowsResource:
    def __init__(self, kubernetes_service: KubernetesServiceABC):
        self.kubernetes_service = kubernetes_service
        self.argo = Argo(
            app_config=kubernetes_service.app_config,
        )

    def _prepare_workflow(self, workflow_data: Dict[str, Any]):
        schema = WorkflowSchema()
        try:
            return schema.load(workflow_data)
        except Exception as ex:
            logger.error(f"Invalid workflows response: {ex}")
            raise MalformedWorkflowData(ex)

    def run_tests(self, workflow_data: Dict[str, Any]):
        workflow = self._prepare_workflow(workflow_data)
        argo_workflow = self.argo.create_argo_tests_workflow(workflow)
        return self._create(argo_workflow)

    def generate_report(self, workflow_data: Dict[str, Any]):
        workflow = self._prepare_workflow(workflow_data)
        argo_workflow = self.argo.create_argo_report_workflow(workflow)
        return self._create(argo_workflow)

    def _create(self, argo_workflow: Dict[str, Any]):
        logger.info(f"Creating argo workflow in the kubernetes service.")
        output = self.kubernetes_service.create_argo_workflow(argo_workflow)
        logger.info(f"The argo workflow has been created successfully.")

        return output["metadata"]

    def terminate(self, workflow_name: str):
        self.kubernetes_service.terminate_workflow_pods(workflow_name)
