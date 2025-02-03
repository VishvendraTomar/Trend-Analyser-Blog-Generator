from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from .config import ConfigResponse
class ExecutionLogResponse(BaseModel):
    id: int
    config_id: int
    execution_date: datetime
    status: str
    message: str
    config: Optional[ConfigResponse] = None

    class Config:
        from_attributes = True 