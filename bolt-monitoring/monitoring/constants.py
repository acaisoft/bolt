import enum


REQUIRED_ENV_VARS = {"EXECUTION_ID", "BOLT_GRAPHQL_URL", "BOLT_HASURA_TOKEN", "BOLT_WS_URL", "FERNET_KEY"}


class ExecutionStatuses(enum.Enum):
    FINISHED = "FINISHED"
    TERMINATED = "TERMINATED"
    PENDING = "PENDING"
