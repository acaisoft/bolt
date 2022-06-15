from services.logger import setup_custom_logger

logger = setup_custom_logger(__name__)


def get_report(execution_id: str):
    """
    Placeholder
    """
    logger.info("Report Generation")
    report = f'report data for execution_id {execution_id}'
    return bytes(report)
