from cryptography.fernet import Fernet


def encrypt_prometheus_password(password: str, key: str):
    if not key:
        raise Exception("Fernet key not provided")
    return Fernet(key.encode()).encrypt(password.encode()).decode()
