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

from api.api_actions import APIClient
from os import environ as env
from models.model_builder import prepare_single_execution_model
from reporting.reporting_utils import generate_pdf_report
from storage import upload
from const import *


if __name__ == '__main__':
    api = None
    try:
        hasura_url = env.get('HASURA_URL')
        hasura_token = env.get('HASURA_TOKEN')
        execution_id = env.get('EXECUTION_ID')
        upload_url = env.get('UPLOAD_URL')

        api = APIClient(
            url=hasura_url,
            token=hasura_token
        )

        api.update_report_status(execution_id, STATUS_GENERATING)

        model = prepare_single_execution_model(execution_id=execution_id, api=api)
        report_path = generate_pdf_report(model)
        upload(report_path, upload_url)
        api.update_report_status(execution_id, STATUS_READY)
    except Exception as ex:
        if api is not None:
            api.update_report_status(execution_id, STATUS_NOT_GENERATED)
        raise ex
