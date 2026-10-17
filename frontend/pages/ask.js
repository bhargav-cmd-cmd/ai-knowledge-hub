import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
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
    if (!getToken()) { router.replace("/login"); return; }
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
      const res = await api.ask({ question, document_id: documentId ? Number(documentId) : null, top_k: 5 });
      setAnswer(res.answer);
      setCitations(res.citations);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <h1>Ask AI</h1>
      <div className="card" style={{ marginBottom: 20 }}>
        <form onSubmit={submit}>
          <div style={{ marginBottom: 12 }}>
            <label className="label">Document (optional)</label>
            <select className="select" value={documentId} onChange={(e) => setDocumentId(e.target.value)}>
              <option value="">All documents</option>
              {docs.map((d) => <option key={d.id} value={d.id}>{d.original_filename}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label className="label">Question</label>
            <textarea className="textarea" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask a question about your documents..." />
          </div>
          <button className="btn" type="submit" disabled={loading}>{loading ? "Thinking..." : "Ask"}</button>
        </form>
        {error && <div className="error">{error}</div>}
      </div>

      {answer && (
        <div className="card">
          <h3>Answer</h3>
          <p style={{ whiteSpace: "pre-wrap" }}>{answer}</p>
          {citations.length > 0 && (
            <>
              <h4 style={{ marginTop: 16 }}>Citations</h4>
              {citations.map((c) => (
                <div key={c.chunk_id} className="citation">
                  <div><strong>{c.filename}</strong> · page {c.page_number} · score {c.score}</div>
                  <div style={{ marginTop: 6 }}>{c.snippet}</div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </Layout>
  );
}
