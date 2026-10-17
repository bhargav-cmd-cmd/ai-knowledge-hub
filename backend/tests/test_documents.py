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
(Hello world test document) Tj
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


def auth_header(token):
    return {"Authorization": f"Bearer {token}"}


def test_upload_and_list(client):
    r = client.post("/api/auth/register", json={"email": "d@test.com", "password": "secret123"})
    token = r.json()["access_token"]
    files = {"file": ("test.pdf", io.BytesIO(MINIMAL_PDF), "application/pdf")}
    r = client.post("/api/documents/upload", files=files, headers=auth_header(token))
    assert r.status_code == 201, r.text
    doc = r.json()
    assert doc["page_count"] == 1
    assert doc["status"] == "processed"

    r = client.get("/api/documents", headers=auth_header(token))
    assert r.status_code == 200
    assert len(r.json()) == 1


def test_delete_document(client):
    r = client.post("/api/auth/register", json={"email": "e@test.com", "password": "secret123"})
    token = r.json()["access_token"]
    files = {"file": ("test.pdf", io.BytesIO(MINIMAL_PDF), "application/pdf")}
    r = client.post("/api/documents/upload", files=files, headers=auth_header(token))
    doc_id = r.json()["id"]
    r = client.delete(f"/api/documents/{doc_id}", headers=auth_header(token))
    assert r.status_code == 204
    r = client.get(f"/api/documents/{doc_id}", headers=auth_header(token))
    assert r.status_code == 404
