from apps.bolt_api.app.workflow import WorkflowsResource, KubernetesService
from services import const
from services.hasura.hasura import generate_hasura_token
from services.logger import setup_custom_logger

logger = setup_custom_logger(__name__)


def generate_report(app_config, execution_id: str):
    logger.info("Report Generation")
    try:
        hasura_token, _ = generate_hasura_token(app_config, const.ROLE_READER)
        workflow_data = {
            'tenant_id': '1',
            'project_id': "",
            'repository_url': "",
            'branch': "",
            'execution_id': str(execution_id),
            'auth_token': hasura_token,
            'duration_seconds': 123,
            'job_pre_start': None,
            'job_load_tests': None,
            'job_monitoring': None,
            'job_post_stop': None,
            'job_report': {
                "env_vars": {
                    "GCP_BUCKET_NAME": app_config.get(const.GCP_BUCKET_NAME)
                }
            },
            'no_cache': True,
        }
    except Exception as ex:
        return f'Failure during Argo workflow data preparation: {ex}'

    try:
        workflow = WorkflowsResource(KubernetesService(app_config))
        workflow_state = workflow.create(workflow_data)
    except Exception as ex:
        return f'Failure during Argo workflow triggering: {ex}'
    return "Report generation triggered"
