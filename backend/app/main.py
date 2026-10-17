from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import auth, chat, documents, health, qa, search
from app.core.config import settings
from app.db.base import Base
from app.db.session import engine

# Import models so SQLAlchemy registers them.
from app.models import chat as _chat  # noqa: F401
from app.models import chunk as _chunk  # noqa: F401
from app.models import document as _document  # noqa: F401
from app.models import user as _user  # noqa: F401


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title=settings.APP_NAME, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(auth.router)
app.include_router(documents.router)
app.include_router(search.router)
app.include_router(qa.router)
app.include_router(chat.router)
