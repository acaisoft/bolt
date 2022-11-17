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

from random import choice
from string import ascii_lowercase
from string import digits
from typing import Any
from typing import Dict
from typing import List
from typing import Optional

from services import const
from .dao import Workflow

from services.logger import setup_custom_logger

logger = setup_custom_logger(__file__)


class Argo:
    """
    wrapper class for Argo methods
    """
    def __init__(self, app_config):
        self.HASURA_GQL = app_config.get(const.HASURA_GQL)
        self.CONTAINER_RESOURCES = app_config.get(const.ARGO_CONTAINER_RESOURCES)
        self.NAMESPACE = app_config.get(const.ARGO_KUBE_NAMESPACE)
        self.HELM_RELEASE_NAME = app_config.get(const.ARGO_HELM_RELEASE_NAME)
        self.CLOUDSDK_CORE_PROJECT = app_config.get(const.CLOUDSDK_CORE_PROJECT)
        self.IMAGE_REGISTRY_ADDRESS = app_config.get(const.IMAGE_REGISTRY_ADDRESS)
        self.GOOGLE_LOGS_BUCKET = app_config.get(const.GOOGLE_LOGS_BUCKET)
        self.IMAGE_BOLT_BUILDER = app_config.get(const.IMAGE_BOLT_BUILDER, const.DEFAULT_IMAGE_BOLT_BUILDER)
        self.IMAGE_REPORT_BUILDER = app_config.get(const.IMAGE_REPORT_BUILDER, const.DEFAULT_IMAGE_REPORT_BUILDER)
        self.STAT_GATHER_INTERVAL = const.STAT_GATHER_INTERVAL
        self.PROMETHEUS_URL = const.PROMETHEUS_URL
        self.MONITORING_INTERVAL = const.MONITORING_INTERVAL

    def create_argo_tests_workflow(self, workflow: Workflow) -> Dict[str, Any]:
        """
        Returns argoproj workflow for load tests
        """
        resource_definition = self._create_argo_workflow_base(workflow)
        resource_definition["spec"]["affinity"] = \
            {
                "nodeAffinity": {
                    "requiredDuringSchedulingIgnoredDuringExecution": {
                        "nodeSelectorTerms": [
                            {
                                "matchExpressions": [
                                    {
                                        "key": "group",
                                        "operator": "In",
                                        "values": [
                                            "load-tests-workers-slave",
                                            "load-tests-workers-master",
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                }
            }
        resource_definition["spec"]["entrypoint"] = "main"
        resource_definition["spec"]["templates"] = self._generate_test_templates(workflow)
        return resource_definition

    def create_argo_report_workflow(self, workflow: Workflow) -> Dict[str, Any]:
        """
        Returns argoproj workflow for generating report
        """
        resource_definition = self._create_argo_workflow_base(workflow)
        resource_definition["spec"]["entrypoint"] = "generate-report"
        resource_definition["spec"]["templates"] = [self._generate_report_template(workflow)]
        return resource_definition

    def _create_argo_workflow_base(self, workflow: Workflow) -> Dict[str, Any]:
        """
        Returns argoproj.io/v1alpha1 Workflow as dict (in json format)
        """
        pod_name = f"bolt-wf-{self._postfix_generator()}"
        logger.info(f"Pod name: {pod_name}")

        resource_definition = {
            "apiVersion": "argoproj.io/v1alpha1",
            "kind": "Workflow",
            "metadata": {
                "name": pod_name,
                "namespace": self.NAMESPACE,
            },
            "spec": {
                "entrypoint": None,
                "templates": None,
                "volumes": self._generate_volumes(workflow),
                "serviceAccountName": f"{self.HELM_RELEASE_NAME}-argo-workflows-workflow-controller"
            },
        }
        if workflow.job_post_stop:
            resource_definition["spec"]["onExit"] = "post-stop"
        return resource_definition

    def _generate_test_templates(self, workflow: Workflow):
        main_template = self._generate_main_template(workflow)
        logger.info(f"The main template has been created.")
        build_template = self._generate_build_template(workflow)
        logger.info(f"The bolt-builder template has been created.")
        execution_template = self._generate_execution_template(workflow)
        logger.info(f"The execution template has been created.")
        steps_templates = self._generate_steps_templates(workflow)
        logger.info(f"The execution steps templates have been created.")
        return [main_template, execution_template, build_template, *steps_templates]

    def _generate_build_template(self, workflow: Workflow):
        no_cache_value = "1" if workflow.no_cache else "0"
        return {
            "name": "build",
            "container": {
                # TODO we should used tagged image, but for now pull always...
                "imagePullPolicy": "Always",
                "image": self.IMAGE_BOLT_BUILDER,
                "command": ["python", "build.py"],
                "volumeMounts": [
                    {"mountPath": "/root/.ssh", "name": "ssh"},
                    {"mountPath": "/etc/google", "name": "google-secret"},
                ],
                "env": [
                    {"name": "REPOSITORY_URL", "value": workflow.repository_url},
                    {"name": "BRANCH", "value": workflow.branch},
                    {
                        "name": "GOOGLE_APPLICATION_CREDENTIALS",
                        "value": "/etc/google/google-secret.json",
                    },
                    {"name": "CLOUDSDK_CORE_PROJECT", "value": self.CLOUDSDK_CORE_PROJECT},
                    {"name": "NO_CACHE", "value": no_cache_value},
                    {"name": "BOLT_EXECUTION_ID", "value": workflow.execution_id},
                    {"name": "BOLT_GRAPHQL_URL", "value": self.HASURA_GQL},
                    {"name": "BOLT_HASURA_TOKEN", "value": workflow.auth_token},
                    {"name": "IMAGE_REGISTRY_ADDRESS", "value": self.IMAGE_REGISTRY_ADDRESS},
                    {"name": "GOOGLE_LOGS_BUCKET", "value": self.GOOGLE_LOGS_BUCKET},
                    {"name": "BOLT_STAT_GATHER_INTERVAL", "value": str(self.STAT_GATHER_INTERVAL)},
                ],
            },
            "outputs": {
                "parameters": [
                    {
                        "globalName": "image",
                        "name": "image",
                        "valueFrom": {"path": "/tmp/image.txt"},
                    }
                ]
            },
        }

    @staticmethod
    def _generate_main_template(workflow: Workflow) -> Dict[str, Any]:
        return {
            "name": "main",
            "steps": [
                [{"name": "build", "template": "build"}],
                [{"name": "execution", "template": "execution"}],
            ],
        }

    @staticmethod
    def _generate_execution_template(workflow: Workflow):
        tasks = []

        if workflow.job_pre_start:
            tasks.append({"name": "pre-start", "template": "pre-start"})

        if workflow.job_load_tests is not None:
            master_dependencies = []
            if workflow.job_pre_start is not None:
                master_dependencies.append("pre-start")

            tasks.append(
                {
                    "name": "load-tests-master",
                    "template": "load-tests-master",
                    "dependencies": master_dependencies,
                }
            )

            for i in range(workflow.job_load_tests.workers):
                tasks.append(
                    {
                        "name": f"load-tests-slave-{i + 1:03}",
                        "template": "load-tests-slave",
                        "dependencies": ["load-tests-master"],
                        "arguments": {
                            "parameters": [
                                {
                                    "name": "master-ip",
                                    "value": "{{tasks.load-tests-master.ip}}",
                                }
                            ]
                        },
                    }
                )

        if workflow.job_monitoring is not None:
            monitor_dependencies = []
            if workflow.job_pre_start is not None:
                monitor_dependencies.append("pre-start")

            tasks.append(
                {
                    "name": "monitoring",
                    "template": "monitoring",
                    "dependencies": monitor_dependencies,
                }
            )

        return {"name": "execution", "dag": {"tasks": tasks}}

    def _generate_steps_templates(self, workflow) -> List[Dict[str, Any]]:
        templates = []

        if workflow.job_pre_start is not None:
            template_pre_start = {
                "name": "pre-start",
                "nodeSelector": {"group": "load-tests-workers-slave"},
                "activeDeadlineSeconds": 600,
                "container": {
                    "image": "{{workflow.outputs.parameters.image}}",
                    "command": ["python", "-m", "bolt_run", "pre_start"],
                    "env": [
                        *self._map_envs(workflow.job_pre_start.env_vars),
                        {"name": "BOLT_EXECUTION_ID", "value": workflow.execution_id},
                        {"name": "BOLT_GRAPHQL_URL", "value": self.HASURA_GQL},
                        {"name": "BOLT_HASURA_TOKEN", "value": workflow.auth_token},
                        {"name": "BOLT_USERS", "value": str(workflow.job_load_tests.users)},
                        {"name": "BOLT_STAT_GATHER_INTERVAL", "value": str(self.STAT_GATHER_INTERVAL)},
                    ],
                    "resources": self.CONTAINER_RESOURCES["default"],
                },
            }
            templates.append(template_pre_start)

        if workflow.job_post_stop is not None:
            template_post_stop = {
                "name": "post-stop",
                "nodeSelector": {"group": "load-tests-workers-slave"},
                "metadata": {"labels": {"prevent-bolt-termination": "true"}},
                "activeDeadlineSeconds": 600,
                "container": {
                    "image": "{{workflow.outputs.parameters.image}}",
                    "command": ["python", "-m", "bolt_run", "post_stop"],
                    "env": [
                        *self._map_envs(workflow.job_post_stop.env_vars),
                        {"name": "BOLT_EXECUTION_ID", "value": workflow.execution_id},
                        {"name": "BOLT_GRAPHQL_URL", "value": self.HASURA_GQL},
                        {"name": "BOLT_HASURA_TOKEN", "value": workflow.auth_token},
                        {"name": "BOLT_STAT_GATHER_INTERVAL", "value": str(self.STAT_GATHER_INTERVAL)},
                    ],
                    "resources": self.CONTAINER_RESOURCES["default"],
                },
            }
            templates.append(template_post_stop)

        if workflow.job_monitoring is not None:
            template_monitoring = {
                "name": "monitoring",
                "nodeSelector": {"group": "load-tests-workers-slave"},
                "retryStrategy": {"limit": 10},
                "container": {
                    "image": "{{workflow.outputs.parameters.image}}",
                    "command": ["python", "-m", "bolt_run", "monitoring"],
                    "env": [
                        *self._map_envs(workflow.job_monitoring.env_vars),
                        {"name": "BOLT_EXECUTION_ID", "value": workflow.execution_id},
                        {"name": "BOLT_GRAPHQL_URL", "value": self.HASURA_GQL},
                        {"name": "BOLT_HASURA_TOKEN", "value": workflow.auth_token},
                        {"name": "BOLT_STAT_GATHER_INTERVAL", "value": str(self.STAT_GATHER_INTERVAL)},
                    ],
                    "resources": self.CONTAINER_RESOURCES["default"],
                },
            }
            templates.append(template_monitoring)

        if workflow.job_load_tests is not None:
            template_load_tests_master = {
                "name": "load-tests-master",
                "daemon": True,
                "nodeSelector": {"group": "load-tests-workers-master"},
                "activeDeadlineSeconds": 30000,
                "container": {
                    "image": "{{workflow.outputs.parameters.image}}",
                    "command": ["python", "-m", "bolt_run", "load_tests"],
                    "env": [
                        *self._map_envs(workflow.job_load_tests.env_vars),
                        {"name": "BOLT_EXECUTION_ID", "value": workflow.execution_id},
                        {"name": "BOLT_GRAPHQL_URL", "value": self.HASURA_GQL},
                        {"name": "BOLT_HASURA_TOKEN", "value": workflow.auth_token},
                        {"name": "BOLT_WORKER_TYPE", "value": "master"},
                        {"name": "BOLT_STAT_GATHER_INTERVAL", "value": str(self.STAT_GATHER_INTERVAL)},
                    ],
                    "resources": self.CONTAINER_RESOURCES["master"],
                },
            }
            templates.append(template_load_tests_master)

            template_load_tests_slave = {
                "name": "load-tests-slave",
                "inputs": {"parameters": [{"name": "master-ip"}]},
                "nodeSelector": {"group": "load-tests-workers-slave"},
                "retryStrategy": {"limit": 10},
                "container": {
                    "image": "{{workflow.outputs.parameters.image}}",
                    "command": ["python", "-m", "bolt_run", "load_tests"],
                    "env": [
                        *self._map_envs(workflow.job_load_tests.env_vars),
                        {"name": "BOLT_EXECUTION_ID", "value": workflow.execution_id},
                        {"name": "BOLT_GRAPHQL_URL", "value": self.HASURA_GQL},
                        {"name": "BOLT_HASURA_TOKEN", "value": workflow.auth_token},
                        {"name": "BOLT_WORKER_TYPE", "value": "slave"},
                        {
                            "name": "BOLT_MASTER_HOST",
                            "value": "{{inputs.parameters.master-ip}}",
                        },
                        {"name": "BOLT_USERS", "value": str(workflow.job_load_tests.users)},
                        {"name": "BOLT_STAT_GATHER_INTERVAL", "value": str(self.STAT_GATHER_INTERVAL)},
                    ],
                    "resources": self.CONTAINER_RESOURCES["worker"],
                },
            }
            if workflow.job_metric_watcher is not None:
                template_load_tests_metric_watcher = {
                    "name": "load-tests-metric-watcher",
                    "nodeSelector": {"group": "load-tests-metric-watcher"},
                    "container": {
                        "image": "{{workflow.outputs.parameters.image}}",
                        "command": ["python", "-m", "monitoring"],
                        "env": [
                            *self._map_envs(workflow.job_metric_watcher.env_vars),
                            {"name": "EXECUTION_ID", "value": workflow.execution_id},
                            {"name": "BOLT_GRAPHQL_URL", "value": self.HASURA_GQL},
                            {"name": "BOLT_HASURA_TOKEN", "value": workflow.auth_token},
                            {"name": "PROMETHEUS_URL", "value": self.PROMETHEUS_URL},
                            {"name": "MONITORING_INTERVAL", "value": str(self.MONITORING_INTERVAL)},
                        ],
                        "resources": self.CONTAINER_RESOURCES["master"],
                    },
                }
                templates.append(template_load_tests_metric_watcher)

            if workflow.job_load_tests.host is not None:
                template_load_tests_slave["container"]["env"].append(
                    {"name": "BOLT_HOST", "value": workflow.job_load_tests.host}
                )
            if workflow.job_load_tests.port is not None:
                template_load_tests_slave["container"]["env"].append(
                    {"name": "BOLT_PORT", "value": str(workflow.job_load_tests.port)}
                )
            templates.append(template_load_tests_slave)

        return templates

    def _generate_report_template(self, workflow: Workflow):
        return {
            "name": "generate-report",
            "container": {
                # TODO we should used tagged image, but for now pull always...
                "imagePullPolicy": "Always",
                "image": self.IMAGE_REPORT_BUILDER,
                "command": ["python", "reporter.py"],
                "env": [
                    *self._map_envs(workflow.job_report.env_vars),
                    {"name": "EXECUTION_ID", "value": workflow.execution_id},
                    {"name": "HASURA_URL", "value": self.HASURA_GQL},
                    {"name": "HASURA_TOKEN", "value": workflow.auth_token},
                ]
            }
        }

    @staticmethod
    def _generate_volumes(workflow: Workflow):
        return [
            {"name": "ssh", "secret": {"defaultMode": 384, "secretName": "ssh-files"}},
            {"name": "google-secret", "secret": {"secretName": "google-secret"}},
        ]

    @staticmethod
    def _postfix_generator(num=6):
        return "".join(choice(ascii_lowercase + digits) for _ in range(num))

    @staticmethod
    def _map_envs(env_vars: Optional[Dict[str, str]]) -> List[Dict]:
        if env_vars is None:
            return []

        output = []
        for key, value in env_vars.items():
            output.append({"name": key, "value": value})

        return output
