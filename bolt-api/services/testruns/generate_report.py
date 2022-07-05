import datetime

from apps.bolt_api.app.workflow import WorkflowsResource, KubernetesService
from services import const
from services.hasura.hasura import generate_hasura_token
from services.logger import setup_custom_logger

from google.cloud import storage

logger = setup_custom_logger(__name__)


def generate_report(app_config, execution_id: str):
    logger.info("Report Generation")
    try:
        bucket_name = app_config.get('GCP_BUCKET_NAME')
        file_name = f'reports/{execution_id}.pdf'

        storage_client = storage.Client()

        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(file_name)
        url = blob.generate_signed_url(
            version="v4",
            expiration=datetime.timedelta(minutes=30),
            method="PUT",
            content_type="application/pdf",
        )

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
                    "GCP_BUCKET_NAME": bucket_name,
                    "UPLOAD_URL": url
                }
            },
            'no_cache': True,
        }
    except Exception as ex:
        logger.error(f'Failure during Argo workflow data preparation: {ex}')
        raise ex
    try:
        workflow = WorkflowsResource(KubernetesService(app_config))
        workflow_state = workflow.create(workflow_data)
    except Exception as ex:
        logger.error(f'Failure during Argo workflow triggering: {ex}')
        raise ex
    return "Report generation triggered"
