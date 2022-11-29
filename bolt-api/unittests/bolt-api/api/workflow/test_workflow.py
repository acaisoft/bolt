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
from apps.bolt_api.app.workflow import KubernetesService, WorkflowsResource


def test_create_kube_service(app):
    with app.app_context():
        service = KubernetesService(app.config)
    assert service.argo_namespace == app.config.get(const.ARGO_KUBE_NAMESPACE)


def test_create_workflows_resource(app):
    with app.app_context():
        service = KubernetesService(app.config)
        workflow_res = WorkflowsResource(service)
    assert workflow_res.kubernetes_service == service
    assert workflow_res.argo.CONTAINER_RESOURCES == app.config.get(const.ARGO_CONTAINER_RESOURCES)

