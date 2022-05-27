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

from services.hasura import hce
from services.logger import setup_custom_logger

logger = setup_custom_logger(__name__)


def teardown(config, project_name, project_id):
    """
    Perform complete project data teardown.
    TODO: clean up any referenced jobs through bolt-deployer.
    Provide with either project_name (accepts sql wildcards) or a project_id.
    """
    assert not all((project_id, project_name)), f'use either project_name or project_id, not both'
    assert any((project_id, project_name)), f'either project_name or project_id must be provided'

    if project_name:
        projects = hce(config,
            '''query ($name:String!) { project(where:{name:{_ilike:$name}}) { id } }''',
            variable_values={'name': project_name}
        )
        project_ids_list = [str(x['id']) for x in projects['project']]
    elif project_id:
        project_ids_list = [str(project_id)]
    else:
        raise RuntimeError('either project_name or project_id must be provided')

    logger.info(f'deleting {len(project_ids_list)} projects')

    hce(config, '''mutation ($projIds:[uuid!]!) {
        delete_configuration_envvars (where:{configuration:{project_id:{_in:$projIds}}}) {affected_rows}
        delete_configuration_parameter (where:{configuration:{project_id:{_in:$projIds}}}) {affected_rows}
        delete_result_error (where:{execution:{configuration:{project_id:{_in:$projIds}}}}) {affected_rows}
        delete_result_aggregate (where:{execution:{configuration:{project_id:{_in:$projIds}}}}) {affected_rows}
        delete_execution_instance (where:{execution:{configuration:{project_id:{_in:$projIds}}}}) {affected_rows}
        delete_execution (where:{configuration:{project_id:{_in:$projIds}}}) {affected_rows}
        delete_configuration (where:{project_id:{_in:$projIds}}) {affected_rows}
        delete_test_source(where:{project_id:{_in:$projIds}}) { affected_rows }
        delete_test_creator (where:{project_id:{_in:$projIds}}) {affected_rows}
        delete_repository (where:{project_id:{_in:$projIds}}) {affected_rows}
        delete_user_project (where:{project_id:{_in:$projIds}}) {affected_rows}
        delete_project(where:{id:{_in:$projIds}}) {affected_rows}
    }''', variable_values={'projIds': project_ids_list})

    logger.info(f'success: {project_ids_list}')

    return project_ids_list
