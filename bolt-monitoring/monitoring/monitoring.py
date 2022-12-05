import os

from datetime import datetime
from constants import REQUIRED_ENV_VARS, ExecutionStatuses
from exceptions import (
    PrometheusUrlException,
    QueriesException
)
from hasura_client import HasuraClient
from monitoring_watcher import MonitoringWatcher
from prometheus_client import PrometheusClient
from utils import decrypt_prometheus_password

HASURA_TOKEN = os.getenv("BOLT_HASURA_TOKEN")
FERNET_KEY = os.getenv("FERNET_KEY")
MONITORING_INTERVAL = int(os.environ.get("MONITORING_INTERVAL", 2))
WATCHER = None

if __name__ == "__main__":

    diff = REQUIRED_ENV_VARS.difference(os.environ)
    if len(diff) > 0:
        raise EnvironmentError(f"{diff} variables are not provided")

    hasura_client = HasuraClient()
    configuration = hasura_client.get_configuration()
    if not (prometheus_url := configuration.get('prometheus_url')):
        raise PrometheusUrlException()
    if not (queries_resp := configuration.get('configuration_monitorings')):
        raise QueriesException()
    status_generator = hasura_client.subscribe_execution_status()
    queries = list(map(lambda x: x["query"], queries_resp))
    concatenated_queries = "|".join(queries)
    prometheus_client = PrometheusClient(
        prometheus_url,
        configuration.get('prometheus_user'),
        decrypt_prometheus_password(configuration.get('prometheus_password'), FERNET_KEY),
    )
    metrics_object_list = []

    def job():
        objects = []
        if prometheus_response := prometheus_client.get_metrics(concatenated_queries).get("data", {}).get("result"):
            for obj in queries_resp:
                query = obj.get("query")
                metric_obj = {
                    # TODO find better way to get metrics grouped by query
                    "metric_value": [i for i in prometheus_response if i["metric"].get("__name__") == query],
                    "timestamp": datetime.fromtimestamp(prometheus_response[0]["value"][0]).isoformat(),
                    "execution_id": os.environ.get("EXECUTION_ID"),
                    "monitoring_id": obj.get("id"),
                }
                objects.append(metric_obj)
            hasura_client.insert_metrics(objects)

    WATCHER = MonitoringWatcher(MONITORING_INTERVAL, job)
    while True:
        try:
            status = next(status_generator)['execution'][0]['status']
            if status in [ExecutionStatuses.TERMINATED.value, ExecutionStatuses.FINISHED.value]:
                WATCHER.stop()
                break

        except ValueError:
            # Generator throws error if already executing
            # Returns value if status in db has changed
            pass
