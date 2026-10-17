from datetime import datetime

from pydantic import BaseModel


class ChatMessageResponse(BaseModel):
    id: int
    role: str
    content: str
    citations: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True
