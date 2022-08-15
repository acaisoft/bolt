import datetime
from enum import Enum

from apps.bolt_api.app.utils.storage_client import StorageClient
from apps.bolt_api.app.workflow import WorkflowsResource, KubernetesService
from services import const
from services.hasura import hce
from services.hasura.hasura import generate_hasura_token
from services.logger import setup_custom_logger

logger = setup_custom_logger(__name__)


class ReportGenerationException(Exception):
    ...


class Status(Enum):
    STATUS_ERROR = 'error'
    STATUS_NOT_GENERATED = 'not_generated'
    STATUS_GENERATING = 'generating'
    STATUS_READY = 'ready'


def generate_report(app_config, execution_id: str) -> str:
    """
    If report for given execution exists, will return signed download url.
    Otherwise, will trigger report generation.
    """
    logger.info("Report Generation")

    client = StorageClient(app_config)
    file_name = f"reports/{execution_id}.pdf"

    response = hce(app_config, '''query ($executionId:uuid!) {
        execution(
            where: { id: { _eq: $executionId } }
        ) {
            report
            }
    }''', {
        "executionId": str(execution_id)
    })
    try:
        report_status = response["execution"][0]["report"]
    except (KeyError, IndexError) as ex:
        logger.error(f"Execution identified by {execution_id} does not exist, "
                     f"or read permissions on table 'execution' are missing.")
        raise ReportGenerationException(f"Execution {execution_id} not found.")
    if report_status == Status.STATUS_READY.value:
        if client.file_exists(file_name):
            return client.generate_download_url(blob_name=file_name)
        else:
            trigger_report_generator(client, file_name, execution_id, app_config)
    elif report_status in [Status.STATUS_NOT_GENERATED.value, Status.STATUS_ERROR.value]:
        trigger_report_generator(client, file_name, execution_id, app_config)


def trigger_report_generator(client: StorageClient, file_name: str, execution_id: str, app_config):
    try:
        url = client.generate_upload_url(blob_name=file_name)
    except Exception as ex:
        logger.error(f"Failure during upload url generation: {ex}")
        raise ReportGenerationException(ex)

    hce(app_config, '''
        mutation update($id:uuid!, $status:String) {
          update_execution_by_pk(pk_columns: {id: $id}, _set: {report: $status}) {
            id
          }
        }''', {
        "id": str(execution_id),
        "status": "generating"
    })

    try:
        hasura_token, _ = generate_hasura_token(app_config, const.ROLE_READER)
        workflow_data = {
            "tenant_id": "1",
            "project_id": "",
            "repository_url": "",
            "branch": "",
            "execution_id": str(execution_id),
            "auth_token": hasura_token,
            "duration_seconds": 123,
            "job_pre_start": None,
            "job_load_tests": None,
            "job_monitoring": None,
            "job_post_stop": None,
            "job_report": {
                "env_vars": {
                    "UPLOAD_URL": url
                }
            },
            "no_cache": True,
        }
    except Exception as ex:
        logger.error(f"Failure during Argo workflow data preparation: {ex}")
        raise ReportGenerationException(ex)

    try:
        workflow = WorkflowsResource(KubernetesService(app_config))
        workflow_state = workflow.generate_report(workflow_data)
    except Exception as ex:
        logger.error(f"Failure during Argo workflow triggering: {ex}")
        raise ReportGenerationException(ex)
