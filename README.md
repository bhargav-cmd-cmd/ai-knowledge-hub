# AI Knowledge Hub

Intermediate-level AI-powered document intelligence web application.

## Tech Stack
- Frontend: Next.js (JavaScript, HTML, CSS)
- Backend: Python FastAPI
- Database: SQLite with SQLAlchemy
- AI: PDF extraction (pdfplumber), embeddings (sentence-transformers), semantic search, OpenAI LLM (optional)

## Project Structure
```
ai-knowledge-hub/
  backend/     # FastAPI app
  frontend/    # Next.js app
  README.md
```

## Backend Setup
```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
# edit .env (set SECRET_KEY, optional OPENAI_API_KEY)
python init_db.py
uvicorn app.main:app --reload --port 8000
```

## Frontend Setup
```bash
cd frontend
npm install
copy .env.local.example .env.local
npm run dev
```
Open http://localhost:3000

## Database Tables
- `users`: id, email, hashed_password, full_name, created_at
- `documents`: id, user_id, filename, original_filename, file_path, text, page_count, status, created_at
- `chunks`: id, document_id, chunk_index, page_number, content, embedding (JSON vector)
- `chat_messages`: id, user_id, document_id, role, content, citations (JSON), created_at

## API Endpoints
### Auth
- `POST /api/auth/register` - register user, returns JWT
- `POST /api/auth/login` - login, returns JWT
- `GET /api/auth/me` - current user (auth required)

### Documents
- `POST /api/documents/upload` - upload PDF (multipart, auth)
- `GET /api/documents` - list user documents
- `GET /api/documents/{id}` - get document
- `DELETE /api/documents/{id}` - delete document

### Search
- `POST /api/search` - semantic search `{ query, document_id?, top_k }`

### Q&A
- `POST /api/qa/ask` - ask question `{ question, document_id?, top_k }`, returns answer + citations

### Chat
- `GET /api/chat/history?document_id=` - chat history
- `DELETE /api/chat/history?document_id=` - clear history

### Health
- `GET /api/health`

## Tests
Backend:
```bash
cd backend
python -m pytest -q
```
Frontend build:
```bash
cd frontend
npm run build
```

## Environment
Never commit `.env` or secrets. Use `.env.example` templates.
Optional `OPENAI_API_KEY` enables full AI answers; otherwise extractive fallback is used.
