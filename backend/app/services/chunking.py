from typing import List, Tuple


def chunk_text(text: str, chunk_size: int = 500, overlap: int = 100) -> List[str]:
    text = (text or "").strip()
    if not text:
        return []
    chunks: List[str] = []
    start = 0
    n = len(text)
    while start < n:
        end = min(start + chunk_size, n)
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        if end >= n:
            break
        start = max(0, end - overlap)
        if start >= end:
            start = end
    return chunks


def chunk_pages(pages: List[Tuple[int, str]], chunk_size: int = 500, overlap: int = 100):
    result = []
    for page_number, text in pages:
        for chunk in chunk_text(text, chunk_size, overlap):
            result.append((page_number, chunk))
    return result
