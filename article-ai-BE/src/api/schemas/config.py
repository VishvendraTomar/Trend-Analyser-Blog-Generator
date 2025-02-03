from pydantic import BaseModel
from datetime import datetime

class ConfigBase(BaseModel):
    company_name: str
    target_audience: str
    business_objectives: str
    audience_description: str
    industry: str
    audience_needs: str
    organization_overview: str

class ConfigCreate(ConfigBase):
    pass

class ConfigResponse(ConfigBase):
    id: int
    created_at: datetime
    updated_at: datetime
    is_active: bool

    class Config:
        from_attributes = True 