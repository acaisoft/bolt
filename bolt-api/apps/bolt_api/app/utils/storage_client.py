import abc
import datetime
from enum import Enum

from services import const


class Providers(Enum):
    GCP = "GCP"
    AZURE = "AZURE"
    S3 = "S3"


class StorageClientABC(abc.ABC):
    @abc.abstractmethod
    def generate_upload_url(self, blob_name: str, content_type: str = "") -> str:
        ...

    @abc.abstractmethod
    def generate_download_url(self, blob_name: str, expires: int = 0) -> str:
        ...


class StorageClient(StorageClientABC):
    """
    Automatically creates a driver instance for storage provider passed in config.
    """
    def __init__(self, app_config):
        self._provider = app_config.get(const.STORAGE_SERVICE)
        self._driver = None
        self._container = None
        container_name = app_config.get(const.STORAGE_CONTAINER_NAME)
        match self._provider:
            case Providers.GCP.value:
                from cloudstorage.drivers.google import GoogleStorageDriver
                self._driver = GoogleStorageDriver()
            case Providers.S3.value:
                from cloudstorage.drivers.amazon import S3Driver
                self._driver = S3Driver(
                    key=app_config.get(const.S3_KEY_ID),
                    secret=app_config.get(const.S3_ACCESS_KEY),
                    region=app_config.get(const.S3_REGION)
                )
            case Providers.AZURE.value:
                from cloudstorage.drivers.microsoft import AzureStorageDriver
                self._driver = AzureStorageDriver(
                    account_name=app_config.get(const.AZURE_ACCOUNT_NAME),
                    key=app_config.get(const.AZURE_ACCOUNT_KEY)
                )
            case _:
                raise EnvironmentError(f"Storage service provider '{self._provider}' is not supported.")

        self._container = self._driver.get_container(container_name)

    def generate_upload_url(self, blob_name: str, content_type: str = "application/pdf") -> str:
        return self._container.generate_upload_url(
            blob_name=blob_name,
            content_type=content_type,
            expires=1800
        )

    def generate_download_url(self, blob_name: str, expires: int = 300) -> str:
        blob = self._container.get_blob(blob_name=blob_name)
        return blob.generate_download_url(
            expires=expires
        )

    def file_exists(self, blob_name: str) -> bool:
        blob = self._container.get_blob(blob_name=blob_name)
        return blob in self._container
