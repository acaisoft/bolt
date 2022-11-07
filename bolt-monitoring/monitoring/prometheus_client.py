import os
import requests
import logging


class PrometheusClient:

    def get_metrics(self, concatenated_queries):
        try:
            response = requests.get(
                os.environ.get("PROMETHEUS_URL") + "/api/v1/query",
                params={"query": '{__name__=~"%s", group=""}' % concatenated_queries}
            )
            response.raise_for_status()
        except Exception as err:
            logging.exception(err)
            return {}
        return response.json()
