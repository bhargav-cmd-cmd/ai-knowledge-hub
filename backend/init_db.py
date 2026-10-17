from app.db.base import Base
from app.db.session import engine
from app.models import chat, chunk, document, user  # noqa: F401

Base.metadata.create_all(bind=engine)
print("Database initialized.")
