from datetime import datetime

from pydantic import BaseModel


class DocumentResponse(BaseModel):
    id: int
    filename: str
    original_filename: str
    page_count: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class ChunkResponse(BaseModel):
    id: int
    chunk_index: int
    page_number: int
    content: str

    class Config:
        from_attributes = True
