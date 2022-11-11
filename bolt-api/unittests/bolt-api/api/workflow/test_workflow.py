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

