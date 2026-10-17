from app.services.chunking import chunk_pages, chunk_text


def test_chunk_text():
    text = "a" * 1200
    chunks = chunk_text(text, chunk_size=500, overlap=100)
    assert len(chunks) >= 3
    assert all(len(c) <= 500 for c in chunks)


def test_chunk_pages():
    pages = [(1, "hello world " * 50), (2, "second page " * 50)]
    out = chunk_pages(pages, chunk_size=100, overlap=20)
    assert len(out) > 0
    assert all(isinstance(p, int) and isinstance(c, str) for p, c in out)
