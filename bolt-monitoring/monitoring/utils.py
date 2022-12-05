from cryptography.fernet import Fernet, InvalidToken


def decrypt_prometheus_password(password: str, key: str):
    if password:
        return Fernet(key).decrypt(password.encode()).decode()
    return
