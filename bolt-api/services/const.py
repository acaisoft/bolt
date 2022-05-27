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

SELFTEST_FLAG = 'BOLT_API_SELFTEST_FLAG'
SECRET_KEY = 'TEST_SECRET_KEY'
JWT_ALGORITHM = 'JWT_ALGORITHM'
JWT_VALID_PERIOD = 'JWT_VALID_PERIOD'
AUTH_KC = 'AUTH_KC'
AUTH_LOGIN = 'AUTH_LOGIN'
AUTH_PASSWORD = 'AUTH_PASSWORD'
JWT_AUTH_PRIV_KEY = 'JWT_AUTH_PRIV_KEY'
JWT_AUTH_PUB_KEY = 'JWT_AUTH_PUB_KEY'
AUTH_LOCAL_DEV = 'AUTH_LOCAL_DEV'
REDIRECT_FRONT_URL = 'REDIRECT_FRONT_URL'
HASURA_CLIENT_USER_ID = '7f1aab7a-e941-46a2-b63a-5b28b80ad384'
HASURA_DEVELOPMENT_ACCESS_KEY = 'devaccess'

ROLE_ADMIN = 'admin'
ROLE_TENANT_ADMIN = 'tenantadmin'
ROLE_MANAGER = 'manager'
ROLE_TESTER = 'tester'
ROLE_READER = 'reader'
ROLE_TESTRUNNER = 'testrunner'  # internal use
ROLE_CHOICE = (ROLE_ADMIN, ROLE_TENANT_ADMIN, ROLE_MANAGER, ROLE_TESTER, ROLE_READER)

TENANT_ID = '1'

TESTRUN_INIT = 'INIT'
TESTRUN_PREPARING = 'PENDING'
TESTRUN_PREPARING_FAILED = 'PREPARING FAILED'
TESTRUN_STARTED = 'STARTED'
TESTRUN_RUNNING = 'RUNNING'
TESTRUN_CRASHED = 'CRASHED'
TESTRUN_FAILED = 'FAILED'
TESTRUN_ERROR = 'ERROR'
TESTRUN_TERMINATED = 'TERMINATED'
TESTRUN_FINISHED = 'FINISHED'
TESTRUN_SUCCEEDED = 'SUCCEEDED'

TESTTYPE_LOAD = 'load_tests'
TESTTYPE_CHOICE = (TESTTYPE_LOAD,)

TESTPARAM_USERS = 'load_tests_users'
TESTRUN_MAX_USERS_PER_INSTANCE = 1000
TESTRUN_MAX_USERS = 50000
TESTRUN_MAX_DURATION = 28800

MONITORING_MIN_INTERVAL = 2

CONF_SOURCE_JSON = 'test_creator'
CONF_SOURCE_REPO = 'repository'
CONF_SOURCE_CHOICE = (CONF_SOURCE_JSON, CONF_SOURCE_REPO)

IMAGE_CONTENT_TYPES = ('image/png', 'image/jpg', 'image/jpeg', 'image/gif')
UPLOADS_MAX_SIZE_BYTES = 5000000
UPLOADS_PUBSUB_SUBSCRIPTION = 'uploads-bolt-acaisoft'

REQUIRED_BOLT_API_CONFIG_VARS = (
    'HASURA_GQL',
    'HASURA_GRAPHQL_ACCESS_KEY',
    'TEST_SECRET_KEY',
)

# default testrunner image for use by `test_creator` tests, override with BOLT_TEST_RUNNER_IMAGE
DEFAULT_TEST_RUNNER_IMAGE = 'eu.gcr.io/acai-bolt/bolt-test-runner:0.1.31'

# allows load tests setup/teardown to work without getting ratelimited by repository hosting
MOCK_REPOSITORY = 'git@mockbitbucket.org:repo'

# configuration extensions
EXTENSION_NFS = 'nfs'
EXTENSION_NFS_MAX_MOUNTS_PER_WORKER = 100
EXTENSION_CHOICE = (EXTENSION_NFS,)

# executions graphs
MAX_GRAPH_POINTS = 1400

# images upload
BUCKET_PRIVATE_STORAGE = "uploads-bolt-acaisoft"
BUCKET_PUBLIC_UPLOADS = "media.bolt.acaisoft.io"
