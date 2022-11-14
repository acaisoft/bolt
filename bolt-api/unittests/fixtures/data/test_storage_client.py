
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
