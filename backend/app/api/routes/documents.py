import os
import shutil
import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.config import settings
from app.db.session import get_db
from app.models.chunk import Chunk
from app.models.document import Document
from app.models.user import User
from app.schemas.document import DocumentResponse
from app.services.chunking import chunk_pages
from app.services.embeddings import dumps_embedding, embed_texts
from app.services.pdf import extract_pages

router = APIRouter(prefix="/api/documents", tags=["documents"])

ALLOWED_EXT = {".pdf"}


@router.post("/upload", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    contents = file.file.read()
    size_mb = len(contents) / (1024 * 1024)
    if size_mb > settings.MAX_FILE_SIZE_MB:
        raise HTTPException(status_code=413, detail=f"File too large (max {settings.MAX_FILE_SIZE_MB}MB)")

    user_dir = os.path.join(settings.UPLOAD_DIR, str(current_user.id))
    os.makedirs(user_dir, exist_ok=True)
    stored_name = f"{uuid.uuid4().hex}.pdf"
    file_path = os.path.join(user_dir, stored_name)
    with open(file_path, "wb") as f:
        f.write(contents)

    try:
        pages, page_count = extract_pages(file_path)
    except Exception as exc:  # noqa: BLE001
        os.remove(file_path)
        raise HTTPException(status_code=400, detail=f"Failed to extract PDF text: {exc}")

    text = "\n".join(t for _, t in pages)
    doc = Document(
        user_id=current_user.id,
        filename=stored_name,
        original_filename=file.filename,
        file_path=file_path,
        text=text,
        page_count=page_count,
        status="processed",
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    chunked = chunk_pages(pages, settings.CHUNK_SIZE, settings.CHUNK_OVERLAP)
    if chunked:
        texts = [c[1] for c in chunked]
        vectors = embed_texts(texts)
        for idx, ((page_number, content), vec) in enumerate(zip(chunked, vectors)):
            chunk = Chunk(
                document_id=doc.id,
                chunk_index=idx,
                page_number=page_number,
                content=content,
                embedding=dumps_embedding(vec),
            )
            db.add(chunk)
        db.commit()

    return doc


@router.get("", response_model=list[DocumentResponse])
def list_documents(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return (
        db.query(Document)
        .filter(Document.user_id == current_user.id)
        .order_by(Document.created_at.desc())
        .all()
    )


@router.get("/{document_id}", response_model=DocumentResponse)
def get_document(document_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    doc = db.query(Document).filter(Document.id == document_id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(document_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    doc = db.query(Document).filter(Document.id == document_id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    if doc.file_path and os.path.exists(doc.file_path):
        try:
            os.remove(doc.file_path)
        except OSError:
            pass
    db.delete(doc)
    db.commit()
    return None
