from enum import Enum
from http.client import PROCESSING

class TransactionState(Enum):
    PROCESSING = 0
    COMPLETE = 1
    DENIED = 2
