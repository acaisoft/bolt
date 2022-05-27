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

import json

from keycloak import KeycloakAdmin

from services.keycloak.clients import k_admin


def create_user_with_role(config, email, role):
    client = k_admin(config)

    needs_registration = True
    users = client.get_users({})

    for u in users:
        if u.get('email', '') == email:
            needs_registration = False

    if needs_registration:
        client.create_user({
            "email": email,
            "username": email,
            "enabled": True,
        })

        user_id = client.get_user_id(email)

        # force user to register and setup password
        client.send_update_account(user_id=user_id, payload=json.dumps(['UPDATE_PASSWORD']))
        client.send_verify_email(user_id=user_id)

    else:
        user_id = client.get_user_id(email)

    # assign bolt client role to user
    bolt_client_id = client.get_client_id('bolt-portal')
    role_id = client.get_client_role(client_id=bolt_client_id, role_name=role)
    client.assign_client_role(client_id=bolt_client_id, user_id=user_id, roles=[role_id])

    return user_id


def user_assign_roles(config, user_id, new_roles):
    client = k_admin(config)
    bolt_client_id = client.get_client_id('bolt-portal')
    role_ids = []
    for role_name in new_roles:
        role_ids.append(client.get_client_role(client_id=bolt_client_id, role_name=role_name))
    client.assign_client_role(client_id=bolt_client_id, user_id=user_id, roles=role_ids)
    user = client.get_user(user_id)
    return user_detail(config, user, client)


def list_users(config, filters=None):
    if not filters:
        filters = {}

    client = k_admin(config)
    bolt_client_id = client.get_client_id('bolt-portal')
    k_users = client.get_users(filters)
    out_users = []

    for x in k_users:
        k_roles = client.get_client_roles_of_user(user_id=x.get('id'), client_id=bolt_client_id)
        out_users.append({
            'id': x['id'],
            'username': x.get('username'),
            'email': x.get('email'),
            'email_verified': x.get('emailVerified'),
            'bolt_roles': [r['name'] for r in k_roles],
        })

    return out_users


def user_detail(config, keycloak_user_description: dict, client: KeycloakAdmin = None):
    x = keycloak_user_description
    if not client:
        client = k_admin(config)
    bolt_client_id = client.get_client_id('bolt-portal')
    k_roles = client.get_client_roles_of_user(user_id=x.get('id'), client_id=bolt_client_id)
    return {
        'id': x['id'],
        'username': x.get('username'),
        'email': x.get('email'),
        'email_verified': x.get('emailVerified'),
        'bolt_roles': [r['name'] for r in k_roles],
    }
