import math
from services import const


def get_instances_count(patched_params: dict, param_value: int) -> int:
    return math.ceil(int(param_value) / int(patched_params.get(
        const.TESTPARAM_USERS_PER_WORKER,
        const.TESTRUN_MAX_USERS_PER_INSTANCE
    )))
