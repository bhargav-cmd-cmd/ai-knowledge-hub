import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import {
  IconAlert,
  IconFile,
  IconSearch,
  IconSparkles,
} from "../components/Icons";
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
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    api.listDocuments().then(setDocs).catch((e) => setError(e.message));
  }, [router]);

  async function submit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.search({
        query,
        document_id: documentId ? Number(documentId) : null,
        top_k: 8,
      });
      setResults(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Semantic <span className="text-gradient">Search</span>
          </h1>
          <p className="page-subtitle">
            Search by meaning, not keywords. Results rank the passages closest to your query across
            every indexed document.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 22 }}>
        <form onSubmit={submit}>
          <div className="field">
            <label className="label" htmlFor="search-query">
              Query
            </label>
            <div className="input-wrap has-trail">
              <span className="input-icon">
                <IconSearch size={17} />
              </span>
              <input
                id="search-query"
                className="input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search your documents… e.g. refund policy for enterprise plans"
                style={{ paddingRight: 134 }}
              />
              <span className="input-trail">
                <button className="btn btn-sm" type="submit" disabled={loading || !query.trim()}>
                  {loading ? (
                    <>
                      <span className="spinner" />
                      Searching
                    </>
                  ) : (
                    <>
                      <IconSearch size={15} />
                      Search
                    </>
                  )}
                </button>
              </span>
            </div>
          </div>

          <div className="field" style={{ marginBottom: 4 }}>
            <label className="label" htmlFor="search-doc">
              Document <span className="muted">(optional)</span>
            </label>
            <select
              id="search-doc"
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
        </form>

        {error && (
          <div className="error">
            <IconAlert size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-head">
          <div className="card-icon-title">
            <span className="tile tile-purple" style={{ width: 36, height: 36, borderRadius: 11 }}>
              <IconSparkles size={17} />
            </span>
            <h3 style={{ margin: 0 }}>
              Results {results.length > 0 && <span className="muted">· {results.length}</span>}
            </h3>
          </div>
        </div>

        {loading && (
          <div className="thinking">
            <span className="dots">
              <span />
              <span />
              <span />
            </span>
            Scanning your documents for the closest passages…
          </div>
        )}

        {!loading && results.length === 0 && (
          <div className="empty">
            <div className="empty-icon">
              <IconSearch size={26} />
            </div>
            <div className="empty-title">No results yet</div>
            <p className="empty-text">
              Type a question above and hit Search — the most relevant chunks will appear here with
              their source file and page.
            </p>
          </div>
        )}

        {!loading &&
          results.map((r, i) => (
            <div className="result-card" key={r.chunk_id} style={{ animationDelay: `${i * 40}ms` }}>
              <div className="result-head">
                <div className="result-file">
                  <span className="file-ico" style={{ width: 30, height: 30, borderRadius: 9 }}>
                    <IconFile size={15} />
                  </span>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {r.filename}
                  </span>
                </div>
                <div className="result-badges">
                  <span className="badge badge-progress badge-plain">page {r.page_number}</span>
                  <span className="badge badge-purple badge-plain badge-score">
                    score {typeof r.score === "number" ? r.score.toFixed(3) : r.score}
                  </span>
                </div>
              </div>
              <div className="result-snippet">{r.snippet}</div>
            </div>
          ))}
      </div>
    </Layout>
  );
}
