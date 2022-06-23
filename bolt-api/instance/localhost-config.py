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


KEYCLOAK_URL = 'https://keycloak.dev.bolt.acaisoft.io/auth/'
KEYCLOAK_CLIENT_ID = 'test-runner'
KEYCLOAK_REALM_NAME = 'Bolt'

OAUTH_REDIRECT = 'http://localhost:5000'

JWT_ALGORITHM = 'HS256'

HASURA_GQL = "http://localhost:8080/v1alpha1/graphql"

HCE_DEBUG = True

GOOGLE_APPLICATION_CREDENTIALS = 'instance/acai-bolt-356aea83d223.json'

CONFIG_VERSION = '01beta'

ARGO_CONTAINER_RESOURCES = {
    "default": {
        "limits": {"cpu": "110m", "memory": "220Mi"},
        "requests": {"cpu": "100m", "memory": "200Mi"},
    },
    "master": {
        "limits": {"cpu": "410m", "memory": "520Mi"},
        "requests": {"cpu": "400m", "memory": "500Mi"},
    },
    "worker": {
        "limits": {"cpu": "840m", "memory": "950Mi"},
        "requests": {"cpu": "800m", "memory": "900Mi"},
    }
}
