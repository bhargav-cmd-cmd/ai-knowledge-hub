import os
import sys

os.environ.setdefault("DATABASE_URL", "sqlite:///./test_knowledge_hub.db")
os.environ.setdefault("SECRET_KEY", "test-secret-key")
os.environ.setdefault("OPENAI_API_KEY", "")

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.db import session as db_session

DB_FILE = "./test_knowledge_hub.db"


@pytest.fixture(autouse=True)
def reset_db():
    db_session.engine.dispose()
    if os.path.exists(DB_FILE):
        try:
            os.remove(DB_FILE)
        except PermissionError:
            pass
    # recreate tables
    from app.db.base import Base
    from app.models import chat, chunk, document, user  # noqa: F401
    Base.metadata.create_all(bind=db_session.engine)
    yield
    db_session.engine.dispose()
    if os.path.exists(DB_FILE):
        try:
            os.remove(DB_FILE)
        except PermissionError:
            pass


@pytest.fixture
def client():
    return TestClient(app)
