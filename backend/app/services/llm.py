from openai import OpenAI

from app.core.config import settings


def generate_answer(question: str, contexts: list[dict]) -> str:
    if not contexts:
        return "I could not find relevant information in the uploaded documents."

    if not settings.OPENAI_API_KEY:
        # Extractive fallback when no API key is configured.
        top = contexts[0]
        snippet = top["content"][:600].strip()
        return (
            "No OPENAI_API_KEY configured, so here is the most relevant passage:\n\n"
            f"{snippet}\n\n"
            "(Configure OPENAI_API_KEY for a full AI-generated answer.)"
        )

    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    context_block = "\n\n".join(
        f"[Source {i+1} - {c['filename']} p.{c['page_number']}]: {c['content']}"
        for i, c in enumerate(contexts)
    )
    system = (
        "You are an AI knowledge assistant. Answer the user's question using only the provided document context. "
        "If the answer is not in the context, say you don't know. Cite sources by their [Source N] labels."
    )
    user_msg = f"Context:\n{context_block}\n\nQuestion: {question}"
    try:
        response = client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user_msg},
            ],
            temperature=0.2,
        )
        return response.choices[0].message.content.strip()
    except Exception as exc:  # noqa: BLE001
        return f"LLM request failed: {exc}"
