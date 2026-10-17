import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { api, getToken } from "../lib/api";

export default function Dashboard() {
  const router = useRouter();
  const [docs, setDocs] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getToken()) { router.replace("/login"); return; }
    (async () => {
      try {
        const [u, d] = await Promise.all([api.me(), api.listDocuments()]);
        setUser(u);
        setDocs(d);
      } catch (e) {
        setError(e.message);
      }
    })();
  }, [router]);

  return (
    <Layout>
      <h1>Dashboard</h1>
      <p style={{ color: "var(--muted)" }}>Welcome{user ? `, ${user.full_name || user.email}` : ""}.</p>
      {error && <div className="error">{error}</div>}
      <div className="grid grid-3" style={{ marginTop: 20 }}>
        <div className="card stat">
          <div className="num">{docs.length}</div>
          <div>Documents</div>
        </div>
        <div className="card stat">
          <div className="num">{docs.reduce((a, d) => a + (d.page_count || 0), 0)}</div>
          <div>Total pages</div>
        </div>
        <div className="card stat">
          <div className="num">AI</div>
          <div>Ready to answer</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h3>Recent documents</h3>
        {docs.length === 0 ? (
          <p style={{ color: "var(--muted)" }}>No documents yet. Upload one to get started.</p>
        ) : (
          <table className="table">
            <thead>
              <tr><th>Name</th><th>Pages</th><th>Status</th><th>Uploaded</th></tr>
            </thead>
            <tbody>
              {docs.slice(0, 5).map((d) => (
                <tr key={d.id}>
                  <td>{d.original_filename}</td>
                  <td>{d.page_count}</td>
                  <td><span className="badge">{d.status}</span></td>
                  <td>{new Date(d.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}
