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

import logging
import os
import re
import requests
import uuid

from services import const
from services.configure import ConfigurationError
from services.hasura import hce
from flask import current_app

logger = logging.getLogger(__name__)

ALLOWED_EMAILS_DOMAINS = ["acaisoft.com"]
CONNECTION_TYPE = "google-oauth2"
ROLE_TO_ASSIGN = const.ROLE_TENANT_ADMIN

PROCESSED_BY_SCRIPT = False


class Auth0Client:
    def __init__(self, management_token: bool = True):
        url = os.getenv("AUTH0_MANAGE_DOMAIN", "https://acaisoft.eu.auth0.com")
        self.url = current_app.config.get(const.AUTH0_BASE_URL, url)
        if management_token:
            self.token = self.get_auth0_management_token()

    def get_auth0_management_token(self):
        try:
            response = requests.post(
                f"{self.url}/oauth/token",
                json={
                    "client_id": current_app.config.get(const.AUTH0_CLIENT_ID),
                    "client_secret": current_app.config.get(const.AUTH0_CLIENT_SECRET),
                    "audience": current_app.config.get(const.AUTH0_AUDIENCE),
                    "grant_type": "client_credentials"
                },
                headers={'content-type': "application/json"}
            )
            response.raise_for_status()
        except requests.exceptions.HTTPError as err:
            logger.error(err)
            if PROCESSED_BY_SCRIPT:
                return
            raise err
        return response.json()['access_token']

    def get_auth0_access_token(self, role: str, execution_id: str) -> str:
        try:
            response = requests.post(
                f"{self.url}/oauth/token",
                json={
                    "client_id": current_app.config.get(const.AUTH0_CLIENT_ID),
                    "client_secret": current_app.config.get(const.AUTH0_CLIENT_SECRET),
                    "audience": current_app.config.get(const.AUTH0_AUDIENCE),
                    "grant_type": "client_credentials",
                    "role": role,
                    "execution_id": execution_id
                },
                headers={'content-type': "application/json"}
            )
            response.raise_for_status()
        except requests.exceptions.HTTPError as err:
            logger.error(err)
            raise err
        return response.json()['access_token']

    def get_users_list(self, email):
        try:
            response = requests.get(
                f"{self.url}/api/v2/users-by-email?email={email}",
                headers={
                    "Authorization": f"Bearer {self.token}",
                }
            )
            response.raise_for_status()
        except requests.exceptions.HTTPError as err:
            logger.error(err)
            if PROCESSED_BY_SCRIPT:
                return []
            raise err
        return response.json()

    def get_role(self):
        try:
            response = requests.get(
                f"{self.url}/api/v2/roles?name_filter={ROLE_TO_ASSIGN}",
                headers={
                    "Authorization": f"Bearer {self.token}",
                }
            )
            response.raise_for_status()
        except requests.exceptions.HTTPError as err:
            logger.error(err)
            if PROCESSED_BY_SCRIPT:
                return []
            raise err
        if roles := response.json():
            return roles[0]
        else:
            raise Exception(f"Role {ROLE_TO_ASSIGN} does not exists in auth0")

    def assign_role_to_user(self, user_id):
        role_id = self.get_role()["id"]
        try:
            response = requests.post(
                f"{self.url}/api/v2/roles/{role_id}/users",
                json={"users": [user_id]},
                headers={
                    "Authorization": f"Bearer {self.token}",
                }
            )
            response.raise_for_status()
        except requests.exceptions.HTTPError as err:
            logger.error(err)
            if PROCESSED_BY_SCRIPT:
                return
            raise err
        return response.json()


class ProcessBoltUser:
    def __init__(self, email, project_id, app_config, processed_by_script=False):
        self.auth0_client = Auth0Client()
        self.email = self.validated_email(email)
        self.project_id = self.validated_project_id(project_id)
        self.processed_by_script = processed_by_script
        self.hasura_config = {
            'HASURA_GRAPHQL_ACCESS_KEY': app_config.get('HASURA_GRAPHQL_ACCESS_KEY'),
            'HASURA_GQL': app_config.get('HASURA_GQL'),
            'HASURA_CLIENT_USER_ID': app_config.get('HASURA_CLIENT_USER_ID'),
        }

    def validated_project_id(self, project_id):
        try:
            uuid.UUID(str(project_id))
            return project_id
        except ValueError as err:
            logger.error(err)
            raise err

    def validated_email(self, email):
        regex = re.compile(r"([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+")
        if not re.fullmatch(regex, email):
            raise ValueError("Incorrect email pattern")
        if email.split("@")[1] not in ALLOWED_EMAILS_DOMAINS:
            raise ValueError("Not trusted email domain")
        return email

    def assign_user_to_project(self, user_id):
        query = """
            mutation ($data:user_project_insert_input!) {
                insert_user_project(objects: [$data]) { affected_rows }
        }"""
        try:
            hce(self.hasura_config, query, {"data": {"user_id": user_id, "project_id": self.project_id}})
        except Exception as err:
            logger.error(err)
            raise ConfigurationError("Error while assigning user to project")

    def process_user(self):
        if not all(self.hasura_config.values()):
            logger.error("Hasura config not provided")
            raise ConfigurationError("Hasura is not properly configured")
        if not (users_list := self.auth0_client.get_users_list(self.email)):
            return
        user_google_list = list(filter(lambda u: u["identities"][0]["connection"] == CONNECTION_TYPE, users_list))
        if len(user_google_list) > 1:
            raise ValueError(f"More then one google user for email {self.email}")
        user_id = user_google_list[0]["user_id"]
        # Current approach assumed that so far user can be assigned to one role
        self.auth0_client.assign_role_to_user(user_id)
        print(f"Role {ROLE_TO_ASSIGN} assigned to {self.email}")
        self.assign_user_to_project(user_id)
        print(f"User: {self.email} assigned to project {self.project_id} succesfully")


if __name__ == "__main__":
    email = input("Enter email address: ")
    project_id = input("Enter project id: ")
    PROCESSED_BY_SCRIPT = True
    ProcessBoltUser(email, project_id, current_app.config, processed_by_script=True).process_user()
