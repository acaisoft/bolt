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

HASURA_TOKEN = os.getenv("BOLT_HASURA_TOKEN")
MONITORING_INTERVAL = int(os.environ.get("MONITORING_INTERVAL", 2))
WATCHER = None

if __name__ == "__main__":

    diff = REQUIRED_ENV_VARS.difference(os.environ)
    if len(diff) > 0:
        raise EnvironmentError(f"{diff} variables are not provided")

    hasura_client = HasuraClient()
    prometheus_url, queries_resp = hasura_client.get_prometheus_url_and_queries()
    status_generator = hasura_client.subscribe_execution_status()
    if not prometheus_url:
        raise PrometheusUrlException()
    if not queries_resp:
        raise QueriesException()
    queries = list(map(lambda x: x["query"], queries_resp))
    concatenated_queries = "|".join(queries)
    prometheus_client = PrometheusClient(prometheus_url)
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
            if status in [ExecutionStatuses.TERMINATED.value, ExecutionStatuses.FINNISHED.value]:
                WATCHER.stop()
                break

        except ValueError:
            # Generator throws error if already executing
            # Returns value if status in db has changed
            pass
