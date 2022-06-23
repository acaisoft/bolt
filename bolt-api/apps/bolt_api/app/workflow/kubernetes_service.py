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

import abc
from typing import Any
from typing import Dict

from kubernetes import client
from kubernetes import config
from kubernetes.config import ConfigException

from services import const
from services.logger import setup_custom_logger

logger = setup_custom_logger(__file__)


class KubernetesServiceABC(abc.ABC):
    def __init__(self):
        self.app_config = {}
        self.argo_namespace = ''

    @abc.abstractmethod
    def create_argo_workflow(self, body=Dict[str, Any]):
        ...

    @abc.abstractmethod
    def terminate_workflow_pods(self, workflow_name=str):
        ...


class KubernetesService(KubernetesServiceABC):

    def __init__(self, app_config):
        self.app_config = app_config
        self.argo_namespace = app_config.get(const.ARGO_KUBE_NAMESPACE)
        self._load_config()
        self._cr_cli = client.CustomObjectsApi()
        self._core_cli = client.CoreV1Api()

    def _load_config(self):
        try:
            config.load_incluster_config()
        except ConfigException as e:
            logger.error("Failed to load Kubernetes config in-cluster mode.")
            logger.info("Kubernetes config loaded in-cluster mode.")
        else:
            logger.info("Kubernetes config loaded in-cluster.")
            return

        try:
            config.load_kube_config()
        except ConfigException as e:
            logger.error("Failed to load Kubernetes config kube-config mode.")
            raise e
        else:
            logger.info("Kubernetes config loaded from kube-config file.")
            return

    def create_argo_workflow(self, body=Dict[str, Any]):
        return self._cr_cli.create_namespaced_custom_object(
            group="argoproj.io",
            version="v1alpha1",
            namespace=self.argo_namespace,
            plural="workflows",
            body=body,
        )

    def terminate_workflow_pods(self, workflow_name=str):
        pods = self._core_cli.list_namespaced_pod(
            self.argo_namespace,
            label_selector=f"workflows.argoproj.io/workflow={workflow_name}",
        )
        for pod in pods.items:
            if pod.metadata.labels.get('prevent-bolt-termination') == 'true':
                continue
            if pod.status.phase.lower() not in ('pending', 'running'):
                continue
            self._core_cli.delete_namespaced_pod(pod.metadata.name, self.argo_namespace)
