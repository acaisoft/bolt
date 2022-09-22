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

import uuid

import graphene
from flask import current_app

from apps.bolt_api.app.appgraph.project import types
from services import const, gql_util, uploads
from services import validators
from services.hasura import hce


class CreateValidate(graphene.Mutation):
    """Validates configuration for a testrun. Ensures repository is accessible and test parameters are sane."""

    class Arguments:
        name = graphene.String(
            required=True,
            description='Name, unique for user.')
        description = graphene.String(
            required=False,
            description='Project description.')
        image_url = graphene.String(
            required=False,
            description='Project logo.')

    Output = gql_util.ValidationInterface

    @staticmethod
    def validate(info, name, description=None, image_url=None):
        role, user_id = gql_util.get_request_role_userid(info, (const.ROLE_ADMIN, const.ROLE_TENANT_ADMIN,))

        validators.validate_text(name)

        projects = hce(current_app.config, '''query ($userId:String!, $name:String!) {
            project (where:{
                name:{_eq:$name},
                is_deleted: {_eq:false}, 
                userProjects:{user_id:{_eq:$userId}}
            }) {
                name
            }
        }''', {
            'userId': user_id,
            'name': name,
        })
        assert len(projects.get('project', None)) == 0, f'project with this name already exists'

        if description:
            description = validators.validate_text(description, key='description', required=False)

        if image_url:
            image_url = validators.validate_url(image_url, key='image_url', required=False)

        return {
            'name': name,
            'description': description,
            'image_url': image_url,
            'created_by_id': user_id,
        }

    def mutate(self, info, name, description=False, image_url=None):
        CreateValidate.validate(info, name, description, image_url)
        return gql_util.ValidationResponse(ok=True)


class Create(CreateValidate):
    """Validates and saves configuration for a project."""

    Output = gql_util.OutputInterfaceFactory(types.ProjectInterface, 'Create')

    @staticmethod
    def process_upload(image_url) -> str:
        # example download_url passed in image_url
        # https://storage.googleapis.com/uploads-bolt-acaisoft/67111fcf-f35d-418f-96e3-524db4b9e679?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=bolt-api-service%40acai-bolt.iam.gserviceaccount.com%2F20190527%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20190527T094545Z&X-Goog-Expires=93599&X-Goog-SignedHeaders=host&X-Goog-Signature=648da53b05efb279ca4ac8c4473bcf6c1b85a479b401cf644993f46bc1ed6b3b48357f2e7be1ce0d0c7aad62c6150cfd6f060f6d48b238b6a43c147b0b24c553c1198ca2fae17419f5f29046157069ddf8c31da2b49ca387a5983756b574a8c582c90f1651337309013c0c881f5da46358b0f83394d747cffd7c043338cf389ccf607bd5da431697fe66ac1ef11f94cb19225ad4265c854e92203b00b4f72214d595b430244ba0f9acbebc844049cd52ce3ac1d31aa205cc95390126a9e855b2f6b3b95d43bdefaca39f750e70b1be5bd0bc7b4574ccb53731641733d8b0671f8b22ad32295e0b3710f3dee1d12062d7afb7b6a52431e5fe129d4cc16d50acb6
        file_id = str(uuid.uuid4())
        upload_id = image_url.split('?')[0].rsplit('/')[-1]
        uploads.process_image(upload_id, file_id)
        return uploads.get_object_public_url(file_id)

    def mutate(self, info, name, description=None, image_url=None):
        _, user_id = gql_util.get_request_role_userid(info, (const.ROLE_ADMIN, const.ROLE_TENANT_ADMIN))

        query_params = CreateValidate.validate(info, name, description, image_url)

        if query_params['image_url']:
            query_params['image_url'] = Create.process_upload(query_params['image_url'])

        query_params['userProjects'] = {'data': {
            'user_id': str(user_id),
        }}

        query = '''mutation ($data:[project_insert_input!]!) {
            insert_project(
                objects: $data
            ) {
                returning { id name description } 
            }
        }'''

        conf_response = hce(current_app.config, query, variable_values={'data': query_params})
        assert conf_response['insert_project'], f'cannot save project ({str(conf_response)})'

        return gql_util.OutputValueFromFactory(Create, conf_response['insert_project'])
