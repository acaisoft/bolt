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

def get_storage_client_prototype(existing_file: str):
    class TSCWrapper(TestStorageClient):
        EXISTING_FILE = existing_file
    return TSCWrapper


class TestStorageClient:
    EXISTING_FILE = None

    def __init__(self, *args, **kwargs):
        ...

    class Container(list):
        def __init__(self, existing_file):
            super().__init__()
            self.existing_file = existing_file

        def __contains__(self, item):
            if item.name == self.existing_file:
                return True
            else:
                return False

        class Blob:
            name = None

            def __init__(self, name):
                self.name = name

            @staticmethod
            def generate_download_url(*args, **kwargs):
                return 'This is download URL'

        @staticmethod
        def generate_upload_url(*args, **kwargs):
            return 'This is upload URL'

        def get_blob(self, blob_name):
            return self.Blob(blob_name)

    def get_container(self, *args, **kwargs):
        return self.Container(self.EXISTING_FILE)
