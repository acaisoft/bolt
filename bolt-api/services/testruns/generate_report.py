import datetime

from apps.bolt_api.app.utils.storage_client import StorageClient
from apps.bolt_api.app.workflow import WorkflowsResource, KubernetesService
from services import const
from services.hasura import hce
from services.hasura.hasura import generate_hasura_token
from services.logger import setup_custom_logger

logger = setup_custom_logger(__name__)


def generate_report(app_config, execution_id: str):
    logger.info("Report Generation")
    try:
        client = StorageClient(app_config)
        file_name = f'reports/{execution_id}.pdf'

        url = client.generate_upload_url(blob_name=file_name)

        # TODO: this part ideally should be triggered dynamically <if> report is ready, not every time.
        # requires refactoring of frontend and then generator piece. This url is exactly what we should be returning,
        # not updating a report status.
        download_url = client.generate_download_url(blob_name=file_name)
        hce(app_config, '''mutation ($id:uuid!, $status:String!) {
            update_execution_by_pk(pk_columns: {id: $id}, _set: {report: $status}) 
	        {
                id
            }
        }''', {
            'id': execution_id,
            'status': download_url,
        })

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
        workflow_state = workflow.generate_report(workflow_data)
    except Exception as ex:
        logger.error(f'Failure during Argo workflow triggering: {ex}')
        raise ex
    return "Report generation triggered"
