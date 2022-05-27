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

from schematics.exceptions import ValidationError

from services import const
from schematics import types


def validate_extensions(confs: list):
    """
    Validate and convert extension configuration from hasura to deployer format.
    :param confs: extension configuration list in hasura format
    :return: extension arguments map suitable for bolt-deployer
    """
    out = []
    for conf in confs:
        out.append(validate_single_extension(conf))

    return out


def validate_single_extension(conf: dict):
    assert conf.get('type', None) in const.EXTENSION_CHOICE, f'invalid extension type'

    if conf['type'] == const.EXTENSION_NFS:
        return validate_nfs(conf.get('extension_params', {}))
    else:
        raise NotImplemented(f'extension type "{conf["type"]}" validation is not implemented')


def validate_nfs(conf: list):
    single_nfs_params = ('server', 'path', 'mounts_per_worker')
    multi_nfs_params = ('mount_options',)
    all_nfs_params = single_nfs_params + multi_nfs_params
    out = {
        'name': const.EXTENSION_NFS,
    }
    m_opts = []
    for i in conf:
        if i['name'] in single_nfs_params:
            out[i['name']] = i['value']
        elif i['name'] in multi_nfs_params:
            m_opts.append(i['value'])
        else:
            raise AssertionError(f'invalid option for "{const.EXTENSION_NFS}": "{i["name"]}", valid choices are: {all_nfs_params}')

    types.IPAddressType().validate(out.get('server', ''))
    assert out.get('path', '').startswith('/'), f'missing or invalid NFS resource path'
    out['mount_options'] = m_opts
    out['mounts_per_worker'] = int(out.get('mounts_per_worker', '1'))
    assert out.get('mounts_per_worker') < const.EXTENSION_NFS_MAX_MOUNTS_PER_WORKER, \
        f'mounts_per_worker must not exceed {const.EXTENSION_NFS_MAX_MOUNTS_PER_WORKER}'
    return out
