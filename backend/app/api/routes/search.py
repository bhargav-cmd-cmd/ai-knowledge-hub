from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.chunk import Chunk
from app.models.document import Document
from app.models.user import User
from app.schemas.search import SearchRequest, SearchResult
from app.services.embeddings import cosine_similarity, embed_text, loads_embedding

router = APIRouter(prefix="/api/search", tags=["search"])


@router.post("", response_model=list[SearchResult])
def search(payload: SearchRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query_vec = embed_text(payload.query)

    docs_query = db.query(Document).filter(Document.user_id == current_user.id)
    if payload.document_id is not None:
        docs_query = docs_query.filter(Document.id == payload.document_id)
    doc_ids = [d.id for d in docs_query.all()]
    if not doc_ids:
        return []

    chunks = db.query(Chunk).filter(Chunk.document_id.in_(doc_ids)).all()
    doc_map = {d.id: d for d in db.query(Document).filter(Document.id.in_(doc_ids)).all()}

    results = []
    for chunk in chunks:
        vec = loads_embedding(chunk.embedding)
        if vec is None:
            continue
        score = cosine_similarity(query_vec, vec)
        results.append(
            SearchResult(
                document_id=chunk.document_id,
                filename=doc_map[chunk.document_id].original_filename,
                chunk_id=chunk.id,
                chunk_index=chunk.chunk_index,
                page_number=chunk.page_number,
                score=round(score, 4),
                snippet=chunk.content[:300],
            )
        )

    results.sort(key=lambda r: r.score, reverse=True)
    return results[: payload.top_k]
