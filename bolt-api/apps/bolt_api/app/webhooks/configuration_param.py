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

import math
from flask import Blueprint, request, jsonify, current_app

from services import const
from services.hasura import hce

bp = Blueprint('webhooks_configuration_param', __name__)


@bp.route('/update', methods=['POST'])
def configuration_param_update():
    event = request.get_json().get('event')
    assert event and event.get('op') == 'UPDATE', f'invalid event input: {str(event)}'

    old = event.get('data', {}).get('old')
    new = event.get('data', {}).get('new')

    if new.get('parameter_slug') == const.TESTPARAM_USERS and new.get('value') != old.get('value'):
        new_instances = math.ceil(int(new.get('value')) / const.TESTRUN_MAX_USERS_PER_INSTANCE)
        current_app.logger.info(f'updating configuration({new.get("configuration_id")}).instances to {new_instances}')
        # update instances in related configuration if number of users has changed
        resp = hce(current_app.config, '''mutation ($confId:uuid!, $numInstances:Int!) {
            update_configuration(_set:{instances:$numInstances}, where:{id:{_eq:$confId}}) { affected_rows }
        }''', {
            'confId': new.get('configuration_id'),
            'numInstances': new_instances,
        })
        assert resp['update_configuration'].get('affected_rows') is not None, f'unexpected error: {str(resp)}'

    return jsonify({})
