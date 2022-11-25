# Copyright (c) 2022 Acaisoft
#
# Permission is hereby granted, free of charge, to any person obtaining a copy of
# this software and associated documentation files (the "Software"), to deal in
# the Software without restriction, including without limitation the rights to
# use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
# the Software, and to permit persons to whom the Software is furnished to do so,
# subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
# FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
# COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
# IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
# CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import csv
import logging
import os

from datetime import datetime
from gql import gql, Client
from bolt_transport import WrappedTransport

import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
logger = logging.getLogger(__name__)

# envs
GRAPHQL_URL = os.getenv("BOLT_GRAPHQL_URL")
HASURA_TOKEN = os.getenv("BOLT_HASURA_TOKEN")
EXECUTION_ID = os.environ.get("EXECUTION_ID")


class HasuraClient(object):
    """
    GraphQL client for communication with Hasura
    """

    def __init__(self, no_keep_alive=False):
        self.gql_client = Client(
            transport=WrappedTransport(
                no_keep_alive=no_keep_alive,
                url=GRAPHQL_URL,
                use_json=True,
                headers={"Authorization": f"Bearer {HASURA_TOKEN}"},
            )
        )

    def log_error(self, result, message):
        if hasattr(result, "errors") and result.errors:
            logger.error(f"{message}: {result.errors[0]['message']}")

    def get_prometheus_url_and_queries(self):
        query = gql("""
            query ($execution_id: uuid!) {
                execution_by_pk(id: $execution_id) {
                    configuration {
                        prometheus_url
                        configuration_monitorings {
                            query
                            id   
                        }
                    }
                }
            }
        """)
        result = self.gql_client.transport.execute(query, variable_values={"execution_id": EXECUTION_ID}) or {}
        self.log_error(result, message="Fetch queries failed")
        if result.data:
            configuration = result.formatted['data']["execution_by_pk"]["configuration"]
            return configuration['prometheus_url'], configuration["configuration_monitorings"]
        return None, None

    def insert_metrics(self, data):
        query = gql("""
            mutation ($data: [monitoring_metric_insert_input]!) {
                insert_monitoring_metric (objects: $data){
                    affected_rows
                }
            }
        """)
        result = self.gql_client.transport.execute(query, variable_values={"data": data})
        self.log_error(result, message="Insert metrics failed")





