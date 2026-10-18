import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import {
  IconAlert,
  IconBot,
  IconFile,
  IconSend,
  IconSparkles,
} from "../components/Icons";
import { api, getToken } from "../lib/api";

export default function Ask() {
  const router = useRouter();
  const [docs, setDocs] = useState([]);
  const [documentId, setDocumentId] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [citations, setCitations] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    api.listDocuments().then(setDocs).catch((e) => setError(e.message));
  }, [router]);

  async function submit(e) {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    setError("");
    setAnswer("");
    setCitations([]);
    try {
      const res = await api.ask({
        question,
        document_id: documentId ? Number(documentId) : null,
        top_k: 5,
      });
      setAnswer(res.answer);
      setCitations(res.citations);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const suggestions = [
    "Summarize the key points",
    "What are the main obligations?",
    "Which section covers pricing?",
  ];

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Ask <span className="text-gradient">AI</span>
          </h1>
          <p className="page-subtitle">
            Ask anything about your documents. Answers are generated only from your indexed content
            and always come back with citations.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 22 }}>
        <form onSubmit={submit}>
          <div className="field">
            <label className="label" htmlFor="ask-doc">
              Document <span className="muted">(optional)</span>
            </label>
            <select
              id="ask-doc"
              className="select"
              value={documentId}
              onChange={(e) => setDocumentId(e.target.value)}
            >
              <option value="">All documents</option>
              {docs.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.original_filename}
                </option>
              ))}
            </select>
          </div>

          <div className="field" style={{ marginBottom: 8 }}>
            <label className="label" htmlFor="ask-question">
              Question
            </label>
            <textarea
              id="ask-question"
              className="textarea"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about your documents…"
            />
          </div>

          <div className="row" style={{ gap: 8, marginBottom: 6 }}>
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setQuestion(s)}
                style={{ border: "1px solid var(--border)" }}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="form-actions" style={{ marginTop: 14 }}>
            <button className="btn btn-lg" type="submit" disabled={loading || !question.trim()}>
              {loading ? (
                <>
                  <span className="spinner" />
                  Thinking…
                </>
              ) : (
                <>
                  <IconSparkles size={17} />
                  Ask
                </>
              )}
            </button>
            <span className="muted text-sm">Grounded answers · top 5 passages used</span>
          </div>
        </form>

        {error && (
          <div className="error">
            <IconAlert size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {loading && (
        <div className="card answer-card">
          <div className="thinking">
            <span className="dots">
              <span />
              <span />
              <span />
            </span>
            Retrieving relevant passages and composing an answer…
          </div>
        </div>
      )}

      {!loading && answer && (
        <div className="card answer-card">
          <div className="answer-head">
            <span className="tile tile-purple" style={{ width: 40, height: 40, borderRadius: 13 }}>
              <IconBot size={20} />
            </span>
            <div>
              <h3 style={{ margin: 0 }}>Answer</h3>
              <div className="muted" style={{ fontSize: 12.5 }}>
                Generated from {citations.length || "no"} citation{citations.length === 1 ? "" : "s"}
              </div>
            </div>
          </div>
          <div className="answer-body">{answer}</div>

          {citations.length > 0 && (
            <>
              <h4 style={{ marginTop: 22 }}>Citations</h4>
              {citations.map((c) => (
                <div key={c.chunk_id} className="citation">
                  <div className="citation-meta">
                    <span className="file-ico" style={{ width: 26, height: 26, borderRadius: 8 }}>
                      <IconFile size={13} />
                    </span>
                    <strong>{c.filename}</strong>
                    <span className="badge badge-progress badge-plain">page {c.page_number}</span>
                    <span className="badge badge-purple badge-plain badge-score">
                      score {typeof c.score === "number" ? c.score.toFixed(3) : c.score}
                    </span>
                  </div>
                  <div className="citation-text">{c.snippet}</div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {!loading && !answer && !error && (
        <div className="card">
          <div className="empty">
            <div className="empty-icon">
              <IconSparkles size={26} />
            </div>
            <div className="empty-title">Ask your first question</div>
            <p className="empty-text">
              Pick a document (or search them all), type a question and the answer will appear here
              with the exact pages it came from.
            </p>
          </div>
        </div>
      )}
    </Layout>
  );
}
