import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import {
  IconAlert,
  IconBot,
  IconChat,
  IconSend,
  IconTrash,
  IconUser,
} from "../components/Icons";
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
    if (!getToken()) {
      router.replace("/login");
      return;
    }
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
      await api.ask({
        question,
        document_id: documentId ? Number(documentId) : null,
        top_k: 5,
      });
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

  const selectedDoc = docs.find((d) => String(d.id) === String(documentId));

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Chat with your <span className="text-gradient">knowledge</span>
          </h1>
          <p className="page-subtitle">
            A running conversation over your documents. Ask follow-ups, switch scope, or clear the
            thread whenever you like.
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary" type="button" onClick={clear}>
            <IconTrash size={16} />
            Clear chat
          </button>
        </div>
      </div>

      {error && (
        <div className="error" style={{ marginBottom: 16 }}>
          <IconAlert size={16} style={{ flexShrink: 0, marginTop: 2 }} />
          <span>{error}</span>
        </div>
      )}

      <div className="card chat-shell">
        <div className="chat-toolbar">
          <div className="row" style={{ gap: 10 }}>
            <span className="tile tile-purple" style={{ width: 36, height: 36, borderRadius: 11 }}>
              <IconChat size={18} />
            </span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>
                {selectedDoc ? selectedDoc.original_filename : "All documents"}
              </div>
              <div className="muted" style={{ fontSize: 12.5 }}>
                {history.length} message{history.length === 1 ? "" : "s"} in this thread
              </div>
            </div>
          </div>
          <span className="badge badge-purple badge-plain">RAG · cited answers</span>
        </div>

        <div className="chat-scroll">
          {history.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">
                <IconChat size={26} />
              </div>
              <div className="empty-title">No chat history yet</div>
              <p className="empty-text">
                Ask something below — the assistant answers from your documents and every reply is
                saved to this thread.
              </p>
            </div>
          ) : (
            history.map((m, i) => (
              <div
                key={m.id ?? i}
                className={`msg ${m.role === "user" ? "msg-user" : "msg-assistant"}`}
              >
                <span className="msg-avatar">
                  {m.role === "user" ? <IconUser size={16} /> : <IconBot size={16} />}
                </span>
                <div className="msg-col">
                  <span className="msg-name">{m.role === "user" ? "You" : "Assistant"}</span>
                  <div className="msg-bubble">{m.content}</div>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="msg msg-assistant">
              <span className="msg-avatar">
                <IconBot size={16} />
              </span>
              <div className="msg-col">
                <span className="msg-name">Assistant</span>
                <div className="msg-bubble">
                  <span className="dots">
                    <span />
                    <span />
                    <span />
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <form className="chat-composer" onSubmit={submit}>
          <select
            className="select"
            value={documentId}
            onChange={(e) => setDocumentId(e.target.value)}
            aria-label="Select document"
          >
            <option value="">All documents</option>
            {docs.map((d) => (
              <option key={d.id} value={d.id}>
                {d.original_filename}
              </option>
            ))}
          </select>
          <div className="input-wrap">
            <input
              className="input"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask something…"
              aria-label="Message"
            />
          </div>
          <button className="btn" type="submit" disabled={loading || !question.trim()}>
            {loading ? (
              <>
                <span className="spinner" />
                Sending
              </>
            ) : (
              <>
                <IconSend size={16} />
                Send
              </>
            )}
          </button>
        </form>
      </div>
    </Layout>
  );
}
