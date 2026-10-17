import os
from typing import List, Tuple

import pdfplumber


def extract_pages(file_path: str) -> Tuple[List[Tuple[int, str]], int]:
    pages: List[Tuple[int, str]] = []
    with pdfplumber.open(file_path) as pdf:
        for i, page in enumerate(pdf.pages, start=1):
            text = page.extract_text() or ""
            pages.append((i, text))
        page_count = len(pdf.pages)
    return pages, page_count


def extract_text(file_path: str) -> str:
    pages, _ = extract_pages(file_path)
    return "\n".join(text for _, text in pages)
