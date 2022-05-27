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

from typing import Type

import graphene
from graphql.language.ast import FragmentSpread

from services import const


def OutputTypeFactory(cls:Type[graphene.ObjectType], postfix=""):
    return type(cls.__name__ + postfix + 'ReturnType', (graphene.ObjectType,), {
        'affected_rows': graphene.Int(),
        'returning': graphene.List(cls),
    })


def OutputInterfaceFactory(cls:Type[graphene.Interface], postfix=""):
    metaclass = type(cls.__name__ + postfix + 'Metaclass', (object,), {'interfaces': (cls, )})
    return_type = type(cls.__name__ + postfix + 'WrappedReturnType', (graphene.ObjectType,), {
        'Meta': metaclass,
    })
    return type(cls.__name__ + postfix + 'WrappingReturnType', (graphene.ObjectType,), {
        'affected_rows': graphene.Int(),
        'returning': graphene.List(return_type),
    })


def OutputValueFromFactory(cls, returning_response):
    output = []
    out_klass = cls.Output.returning._of_type
    for item in returning_response['returning']:
        for k, v in item.items():
            if type(v) is list and k in out_klass._meta.fields:
                sub_field = out_klass._meta.fields[k]
                sub_klass = sub_field._type._of_type
                if sub_klass:
                    ska = []
                    for i in v:
                        ska.append(sub_klass(**i))
                    item[k] = ska
        ck = cls.Output.returning._of_type(**item)
        output.append(ck)
    affected_rows = returning_response.get('affected_rows', 0) or len(output)
    return cls.Output(
        affected_rows=affected_rows,
        returning=output
    )


class ValidationInterface(graphene.Interface):
    ok = graphene.Boolean()


class ValidationResponse(graphene.ObjectType):
    class Meta:
        interfaces = (ValidationInterface,)


def get_selections(info):
    fragments = info.fragments

    for field_ast in info.field_asts[0].selection_set.selections:
        field_name = field_ast.name.value
        if isinstance(field_ast, FragmentSpread):
            for field in fragments[field_name].selection_set.selections:
                yield field.name.value
            continue

        yield field_name


def get_selected_fields(info):
    return ' '.join([n for n in get_selections(info)])


def get_request_role_userid(info, roles=None) -> (str, str):
    """
    Extract authorization headers from hasura/graphene info object.
    :param info: hasura's request info
    :param roles: iterable of const.ROLE_XXX
    :return: tuple of (role, user_id)
    """
    headers = info.context.headers.environ
    role = headers.get('HTTP_X_HASURA_ROLE', '').split(',')[0]
    user_id = headers.get('HTTP_X_HASURA_USER_ID', '').split(',')[0]

    if roles:
        for required_role in roles:
            assert required_role in const.ROLE_CHOICE, f'invalid required role: {required_role}'
        assert user_id, f'unauthenticated request'
        assert role in roles, f'unauthorized role, (need one of {roles})'

    return role, user_id
