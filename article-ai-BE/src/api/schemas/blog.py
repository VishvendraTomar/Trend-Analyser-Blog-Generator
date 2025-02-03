from pydantic import BaseModel
from datetime import datetime
    
class BlogPostResponse(BaseModel):
    id: int
    content: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class BlogPostRequest(BaseModel):
    content: str

    class Config:
        from_attributes = True