import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.chunk import Chunk
from app.models.document import Document
from app.models.user import User
from app.models.chat import ChatMessage
from app.schemas.search import Citation, QARequest, QAResponse
from app.services.embeddings import cosine_similarity, embed_text, loads_embedding
from app.services.llm import generate_answer

router = APIRouter(prefix="/api/qa", tags=["qa"])


@router.post("/ask", response_model=QAResponse)
def ask(payload: QARequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    docs_query = db.query(Document).filter(Document.user_id == current_user.id)
    if payload.document_id is not None:
        docs_query = docs_query.filter(Document.id == payload.document_id)
    docs = docs_query.all()
    if not docs:
        raise HTTPException(status_code=404, detail="No documents found")
    doc_ids = [d.id for d in docs]
    doc_map = {d.id: d for d in docs}

    chunks = db.query(Chunk).filter(Chunk.document_id.in_(doc_ids)).all()
    if not chunks:
        raise HTTPException(status_code=404, detail="No indexed content found")

    query_vec = embed_text(payload.question)
    scored = []
    for chunk in chunks:
        vec = loads_embedding(chunk.embedding)
        if vec is None:
            continue
        score = cosine_similarity(query_vec, vec)
        scored.append((score, chunk))
    scored.sort(key=lambda x: x[0], reverse=True)
    top = scored[: payload.top_k]

    contexts = []
    citations = []
    for score, chunk in top:
        doc = doc_map[chunk.document_id]
        contexts.append(
            {"filename": doc.original_filename, "page_number": chunk.page_number, "content": chunk.content}
        )
        citations.append(
            Citation(
                document_id=chunk.document_id,
                filename=doc.original_filename,
                chunk_id=chunk.id,
                chunk_index=chunk.chunk_index,
                page_number=chunk.page_number,
                score=round(score, 4),
                snippet=chunk.content[:300],
            )
        )

    answer = generate_answer(payload.question, contexts)

    user_msg = ChatMessage(
        user_id=current_user.id,
        document_id=payload.document_id,
        role="user",
        content=payload.question,
    )
    db.add(user_msg)
    assistant_msg = ChatMessage(
        user_id=current_user.id,
        document_id=payload.document_id,
        role="assistant",
        content=answer,
        citations=json.dumps([c.model_dump() for c in citations]),
    )
    db.add(assistant_msg)
    db.commit()

    return QAResponse(answer=answer, citations=citations)
