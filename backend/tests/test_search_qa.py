import io

MINIMAL_PDF = b"""%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 55 >>
stream
BT
/F1 12 Tf
100 700 Td
(Hello world test document about machine learning) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f
0000000009 65535 f
0000000058 65535 f
0000000115 65535 f
0000000244 65535 f
0000000349 65535 f
trailer
<< /Size 6 /Root 1 0 R >>
startxref
430
%%EOF
"""


def H(token):
    return {"Authorization": f"Bearer {token}"}


def upload(client, token):
    files = {"file": ("test.pdf", io.BytesIO(MINIMAL_PDF), "application/pdf")}
    r = client.post("/api/documents/upload", files=files, headers=H(token))
    assert r.status_code == 201
    return r.json()["id"]


def test_search(client):
    r = client.post("/api/auth/register", json={"email": "s@test.com", "password": "secret123"})
    token = r.json()["access_token"]
    upload(client, token)
    r = client.post("/api/search", json={"query": "machine learning", "top_k": 3}, headers=H(token))
    assert r.status_code == 200
    assert len(r.json()) >= 1


def test_qa(client):
    r = client.post("/api/auth/register", json={"email": "q@test.com", "password": "secret123"})
    token = r.json()["access_token"]
    doc_id = upload(client, token)
    r = client.post("/api/qa/ask", json={"question": "What is this about?", "document_id": doc_id}, headers=H(token))
    assert r.status_code == 200
    data = r.json()
    assert "answer" in data
    assert isinstance(data["citations"], list)


def test_chat_history(client):
    r = client.post("/api/auth/register", json={"email": "h@test.com", "password": "secret123"})
    token = r.json()["access_token"]
    doc_id = upload(client, token)
    client.post("/api/qa/ask", json={"question": "Hello?", "document_id": doc_id}, headers=H(token))
    r = client.get(f"/api/chat/history?document_id={doc_id}", headers=H(token))
    assert r.status_code == 200
    assert len(r.json()) >= 2
    r = client.delete(f"/api/chat/history?document_id={doc_id}", headers=H(token))
    assert r.status_code == 204
    r = client.get(f"/api/chat/history?document_id={doc_id}", headers=H(token))
    assert r.json() == []
