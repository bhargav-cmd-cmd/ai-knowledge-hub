import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { api, getToken } from "../lib/api";

export default function Search() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [docs, setDocs] = useState([]);
  const [documentId, setDocumentId] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!getToken()) { router.replace("/login"); return; }
    api.listDocuments().then(setDocs).catch((e) => setError(e.message));
  }, [router]);

  async function submit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.search({ query, document_id: documentId ? Number(documentId) : null, top_k: 8 });
      setResults(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <h1>Semantic Search</h1>
      <div className="card" style={{ marginBottom: 20 }}>
        <form onSubmit={submit}>
          <div style={{ marginBottom: 12 }}>
            <label className="label">Query</label>
            <input className="input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search your documents..." />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label className="label">Document (optional)</label>
            <select className="select" value={documentId} onChange={(e) => setDocumentId(e.target.value)}>
              <option value="">All documents</option>
              {docs.map((d) => <option key={d.id} value={d.id}>{d.original_filename}</option>)}
            </select>
          </div>
          <button className="btn" type="submit" disabled={loading}>{loading ? "Searching..." : "Search"}</button>
        </form>
        {error && <div className="error">{error}</div>}
      </div>

      <div className="card">
        <h3>Results</h3>
        {results.length === 0 ? (
          <p style={{ color: "var(--muted)" }}>No results yet.</p>
        ) : (
          results.map((r) => (
            <div key={r.chunk_id} className="citation">
              <div><strong>{r.filename}</strong> · page {r.page_number} · score {r.score}</div>
              <div style={{ marginTop: 6 }}>{r.snippet}</div>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}
