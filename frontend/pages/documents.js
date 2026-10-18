import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import {
  IconAlert,
  IconFile,
  IconInbox,
  IconTrash,
  IconUpload,
} from "../components/Icons";
import { api, getToken } from "../lib/api";

function statusBadge(status) {
  const s = (status || "").toLowerCase();
  if (s.includes("error") || s.includes("fail")) return <span className="badge badge-error">{status}</span>;
  if (s.includes("pending") || s === "processing") return <span className="badge badge-progress">{status}</span>;
  if (s.includes("process")) return <span className="badge badge-success">{status}</span>;
  return <span className="badge">{status}</span>;
}

export default function Documents() {
  const router = useRouter();
  const [docs, setDocs] = useState([]);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileRef = useRef(null);

  async function load() {
    try {
      setDocs(await api.listDocuments());
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
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
      setFileName("");
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

  const totalPages = docs.reduce((a, d) => a + (d.page_count || 0), 0);

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Documents<span className="text-gradient">.</span>
          </h1>
          <p className="page-subtitle">
            Upload PDFs to build your knowledge base. Each file is parsed, chunked and embedded so
            search and AI answers stay grounded in your content.
          </p>
        </div>
        <div className="page-actions">
          <span className="badge badge-purple badge-plain" style={{ padding: "8px 14px", fontSize: 13 }}>
            {docs.length} files · {totalPages} pages
          </span>
        </div>
      </div>

      <div className="card card-hover" style={{ marginBottom: 22 }}>
        <div className="card-icon-title" style={{ marginBottom: 16 }}>
          <span className="tile tile-blue" style={{ width: 38, height: 38, borderRadius: 12 }}>
            <IconUpload size={19} />
          </span>
          <h3 style={{ margin: 0 }}>Upload PDF</h3>
        </div>
        <form onSubmit={onUpload}>
          <input
            type="file"
            accept="application/pdf"
            ref={fileRef}
            className="file-input"
            onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
          />
          <div className="form-actions" style={{ marginTop: 16 }}>
            <button className="btn btn-lg" type="submit" disabled={uploading || !fileName}>
              {uploading ? (
                <>
                  <span className="spinner" />
                  Uploading…
                </>
              ) : (
                <>
                  <IconUpload size={17} />
                  Upload document
                </>
              )}
            </button>
            {fileName ? (
              <span className="badge badge-purple">
                {fileName.length > 42 ? `${fileName.slice(0, 42)}…` : fileName}
              </span>
            ) : (
              <span className="muted text-sm">PDF only · processed automatically after upload</span>
            )}
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
            <span className="tile tile-soft" style={{ width: 36, height: 36, borderRadius: 11 }}>
              <IconFile size={18} />
            </span>
            <h3 style={{ margin: 0 }}>Your documents</h3>
          </div>
        </div>

        {docs.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">
              <IconInbox size={26} />
            </div>
            <div className="empty-title">No documents uploaded</div>
            <p className="empty-text">
              Drop in your first PDF above — it will be indexed and ready for search, Ask AI and Chat.
            </p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Pages</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <span className="cell-main">
                        <span className="file-ico">
                          <IconFile size={16} />
                        </span>
                        <span className="fname">{d.original_filename}</span>
                      </span>
                    </td>
                    <td>{d.page_count}</td>
                    <td>{statusBadge(d.status)}</td>
                    <td>
                      <span className="cell-actions">
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => onDelete(d.id)}
                          title="Delete document"
                        >
                          <IconTrash size={15} />
                          Delete
                        </button>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
