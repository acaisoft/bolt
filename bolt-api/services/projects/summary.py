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

from services import const
from services.hasura import hce


def get_project_summary(config, user_id, role):
    project_filter = 'is_deleted: {_eq: false}'
    if role != const.ROLE_ADMIN:
        project_filter += ', userProjects: {user_id: {_eq: $uid}}'

    query = '''query ($uid: uuid!) {
      project(where: {%s}) {
        id
        name
        description
        image_url
        
        invitation_tokens: user_registration_tokens { invitation_token }
        
        scenarios: configurations_aggregate(where: {
            is_deleted: {_eq: false}, 
            project: {is_deleted: {_eq: false}, userProjects: {user_id: {_eq: $uid}}}
        }) {
          aggregate {
            count
          }
        }
        
        sources: test_sources_aggregate(where: {
            is_deleted: {_eq: false}, 
            project: {is_deleted: {_eq: false}, userProjects: {user_id: {_eq: $uid}}}
        }) {
          aggregate {
            count
          }
        }
      }
      
      tests: execution_aggregate(
        distinct_on: configuration_id, 
        where: {
            configuration: {is_deleted: {_eq: false}, 
            project: {is_deleted: {_eq: false}, userProjects: {user_id: {_eq: $uid}}}}
        }
      ) {
        nodes {
          configuration {
            project_id
            executions_aggregate {
              aggregate {
                sum {
                  passed_requests
                  failed_requests
                }
              }
            }
          }
        }
      }
    }
    ''' % (project_filter, )

    query_params = {
        'uid': str(user_id)
    }

    resp = hce(config,  query, query_params)

    out = {}

    for p in resp['project']:
        out[p['id']] = {
            'project_id': p['id'],
            'name': p['name'],
            'description': p['description'],
            'image_url': p['image_url'],
            'num_scenarios': p['scenarios']['aggregate']['count'],
            'num_sources': p['sources']['aggregate']['count'],
            'num_tests_passed': 0,
            'num_tests_failed': 0,
            'invitation_open': len(p['invitation_tokens']) > 0,
        }

    for i in resp['tests']['nodes']:
        pid = i['configuration']['project_id']
        item = i['configuration']['executions_aggregate']['aggregate']['sum']
        out[pid]['num_tests_passed'] += item['passed_requests']
        out[pid]['num_tests_failed'] += item['failed_requests']

    return sorted(out.values(), key=lambda x: x['name'])
