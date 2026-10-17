import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { api, getToken } from "../lib/api";

export default function Chat() {
  const router = useRouter();
  const [docs, setDocs] = useState([]);
  const [documentId, setDocumentId] = useState("");
  const [history, setHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadHistory(docId) {
    try {
      const h = await api.chatHistory(docId ? Number(docId) : undefined);
      setHistory(h);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    if (!getToken()) { router.replace("/login"); return; }
    api.listDocuments().then(setDocs).catch((e) => setError(e.message));
  }, [router]);

  useEffect(() => {
    loadHistory(documentId);
  }, [documentId]);

  async function submit(e) {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    setError("");
    try {
      await api.ask({ question, document_id: documentId ? Number(documentId) : null, top_k: 5 });
      setQuestion("");
      await loadHistory(documentId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function clear() {
    try {
      await api.clearChat(documentId ? Number(documentId) : undefined);
      await loadHistory(documentId);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Layout>
      <h1>Chat History</h1>
      <div className="card" style={{ marginBottom: 20 }}>
        <form onSubmit={submit} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <select className="select" style={{ flex: 1, minWidth: 200 }} value={documentId} onChange={(e) => setDocumentId(e.target.value)}>
            <option value="">All documents</option>
            {docs.map((d) => <option key={d.id} value={d.id}>{d.original_filename}</option>)}
          </select>
          <input className="input" style={{ flex: 2, minWidth: 200 }} value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask something..." />
          <button className="btn" type="submit" disabled={loading}>{loading ? "..." : "Send"}</button>
          <button className="btn btn-secondary" type="button" onClick={clear}>Clear</button>
        </form>
        {error && <div className="error">{error}</div>}
      </div>

      <div className="card">
        {history.length === 0 ? (
          <p style={{ color: "var(--muted)" }}>No chat history yet.</p>
        ) : (
          history.map((m) => (
            <div key={m.id} style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, color: m.role === "user" ? "var(--accent)" : "var(--success)" }}>
                {m.role === "user" ? "You" : "Assistant"}
              </div>
              <div style={{ whiteSpace: "pre-wrap", marginTop: 4 }}>{m.content}</div>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}
