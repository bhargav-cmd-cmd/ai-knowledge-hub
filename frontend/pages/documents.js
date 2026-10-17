import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { api, getToken } from "../lib/api";

export default function Documents() {
  const router = useRouter();
  const [docs, setDocs] = useState([]);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  async function load() {
    try { setDocs(await api.listDocuments()); } catch (e) { setError(e.message); }
  }

  useEffect(() => {
    if (!getToken()) { router.replace("/login"); return; }
    load();
  }, [router]);

  async function onUpload(e) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      await api.uploadDocument(file);
      fileRef.current.value = "";
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function onDelete(id) {
    if (!confirm("Delete this document?")) return;
    try {
      await api.deleteDocument(id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Layout>
      <h1>Documents</h1>
      <div className="card" style={{ marginBottom: 20 }}>
        <h3>Upload PDF</h3>
        <form onSubmit={onUpload} style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <input type="file" accept="application/pdf" ref={fileRef} />
          <button className="btn" type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>
        {error && <div className="error">{error}</div>}
      </div>

      <div className="card">
        <h3>Your documents</h3>
        {docs.length === 0 ? (
          <p style={{ color: "var(--muted)" }}>No documents uploaded.</p>
        ) : (
          <table className="table">
            <thead>
              <tr><th>Name</th><th>Pages</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {docs.map((d) => (
                <tr key={d.id}>
                  <td>{d.original_filename}</td>
                  <td>{d.page_count}</td>
                  <td><span className="badge">{d.status}</span></td>
                  <td>
                    <button className="btn btn-danger" onClick={() => onDelete(d.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}
