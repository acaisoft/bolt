import datetime

import math
from services import const


def get_instances_count(patched_params: dict, param_value: int) -> int:
    return math.ceil(int(param_value) / int(patched_params.get(
        const.TESTPARAM_USERS_PER_WORKER,
        const.TESTRUN_MAX_USERS_PER_INSTANCE
    )))


def get_current_datetime():
    """
    Wrapped in order to be safely patchable for tests. We're patching this method instead of datetime itself.
    """
    return datetime.datetime.now().strftime('%d/%m/%Y - %H:%M:%S')
