import json

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.chat import ChatMessage
from app.models.user import User
from app.schemas.chat import ChatMessageResponse

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.get("/history", response_model=list[ChatMessageResponse])
def history(
    document_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = db.query(ChatMessage).filter(ChatMessage.user_id == current_user.id)
    if document_id is not None:
        q = q.filter(ChatMessage.document_id == document_id)
    return q.order_by(ChatMessage.created_at.asc()).all()


@router.delete("/history", status_code=204)
def clear_history(
    document_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = db.query(ChatMessage).filter(ChatMessage.user_id == current_user.id)
    if document_id is not None:
        q = q.filter(ChatMessage.document_id == document_id)
    q.delete(synchronize_session=False)
    db.commit()
    return None
