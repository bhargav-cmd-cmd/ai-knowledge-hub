from pydantic import BaseModel, Field


class SearchRequest(BaseModel):
    query: str = Field(min_length=1, max_length=500)
    document_id: int | None = None
    top_k: int = Field(default=5, ge=1, le=20)


class SearchResult(BaseModel):
    document_id: int
    filename: str
    chunk_id: int
    chunk_index: int
    page_number: int
    score: float
    snippet: str


class QARequest(BaseModel):
    question: str = Field(min_length=1, max_length=1000)
    document_id: int | None = None
    top_k: int = Field(default=5, ge=1, le=20)


class Citation(BaseModel):
    document_id: int
    filename: str
    chunk_id: int
    chunk_index: int
    page_number: int
    score: float
    snippet: str


class QAResponse(BaseModel):
    answer: str
    citations: list[Citation]
