import os
import requests
import logging


class PrometheusClient:
    def __init__(self, prometheus_url):
        self.prometheus_url = prometheus_url

    def get_metrics(self, concatenated_queries):
        try:
            response = requests.get(
                self.prometheus_url + "/api/v1/query",
                params={"query": '{__name__=~"%s", group=""}' % concatenated_queries}
            )
            response.raise_for_status()
        except Exception as err:
            logging.exception(err)
            return {}
        return response.json()
