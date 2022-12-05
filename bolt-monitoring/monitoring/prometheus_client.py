import requests
import logging
from base64 import b64encode


class PrometheusClient:
    def __init__(self, prometheus_url, username, password):
        self.prometheus_url = prometheus_url
        self.username = username
        self.password = password

    def get_headers(self):
        if self.username and self.password:
            return {"Authorization": self.get_basic_auth_token(self.username, self.password)}
        return {}

    def get_basic_auth_token(self, username, password):
        token = b64encode(f"{username}:{password}".encode('utf-8')).decode("ascii")
        return f'Basic {token}'

    def get_metrics(self, concatenated_queries):
        try:
            response = requests.get(
                self.prometheus_url + "/api/v1/query",
                params={"query": '{__name__=~"%s", group=""}' % concatenated_queries},
                headers=self.get_headers()
            )
            print(response)
            response.raise_for_status()
        except Exception as err:
            logging.exception(err)
            return {}
        return response.json()
