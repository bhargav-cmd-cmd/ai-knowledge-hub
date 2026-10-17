import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../components/Layout";
import {
  IconAlert,
  IconArrowRight,
  IconChat,
  IconChevronRight,
  IconFile,
  IconLayers,
  IconSearch,
  IconSparkles,
  IconUpload,
} from "../components/Icons";
import { api, getToken } from "../lib/api";

const QUICK_ACTIONS = [
  {
    href: "/documents",
    title: "Upload document",
    desc: "Add a PDF and index it for retrieval.",
    icon: IconUpload,
    tone: "tile-blue",
  },
  {
    href: "/search",
    title: "Semantic search",
    desc: "Surface the most relevant passages.",
    icon: IconSearch,
    tone: "tile-purple",
  },
  {
    href: "/ask",
    title: "Ask AI",
    desc: "Get cited answers from your library.",
    icon: IconSparkles,
    tone: "tile-cyan",
  },
  {
    href: "/chat",
    title: "Open chat",
    desc: "Continue a conversation with your docs.",
    icon: IconChat,
    tone: "tile-green",
  },
];

function statusBadge(status) {
  const s = (status || "").toLowerCase();
  if (s.includes("error") || s.includes("fail")) return <span className="badge badge-error">{status}</span>;
  if (s.includes("process") && !s.includes("un")) return <span className="badge badge-success">{status}</span>;
  if (s.includes("pending") || s.includes("process"))
    return <span className="badge badge-progress">{status}</span>;
  return <span className="badge">{status}</span>;
}

export default function Dashboard() {
  const router = useRouter();
  const [docs, setDocs] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
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

  const totalPages = docs.reduce((a, d) => a + (d.page_count || 0), 0);
  const processed = docs.filter((d) => (d.status || "").toLowerCase() === "processed").length;
  const firstName = user?.full_name || user?.email || "";

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Welcome back{firstName ? "," : ""} <span className="text-gradient">{firstName || "friend"}</span>
          </h1>
          <p className="page-subtitle">
            Here is what is happening in your knowledge hub — {docs.length} document
            {docs.length === 1 ? "" : "s"} indexed and ready for questions.
          </p>
        </div>
        <div className="page-actions">
          <Link href="/documents" className="btn btn-secondary">
            <IconUpload size={16} />
            Upload
          </Link>
          <Link href="/ask" className="btn">
            <IconSparkles size={16} />
            Ask AI
          </Link>
        </div>
      </div>

      {error && (
        <div className="error" style={{ marginBottom: 18 }}>
          <IconAlert size={16} style={{ flexShrink: 0, marginTop: 2 }} />
          <span>{error}</span>
        </div>
      )}

      <div className="stats-grid">
        <div className="card stat-card card-hover">
          <span className="tile tile-blue">
            <IconFile size={22} />
          </span>
          <div className="stat-body">
            <div className="stat-value">{docs.length}</div>
            <div className="stat-label">Documents</div>
            <div className="stat-hint">{processed} fully processed</div>
          </div>
        </div>
        <div className="card stat-card card-hover">
          <span className="tile tile-purple">
            <IconLayers size={22} />
          </span>
          <div className="stat-body">
            <div className="stat-value">{totalPages}</div>
            <div className="stat-label">Total pages</div>
            <div className="stat-hint">Embedded and searchable</div>
          </div>
        </div>
        <div className="card stat-card card-hover">
          <span className="tile tile-cyan">
            <IconSparkles size={22} />
          </span>
          <div className="stat-body">
            <div className="stat-value text-gradient">AI</div>
            <div className="stat-label">Ready to answer</div>
            <div className="stat-hint">Grounded with citations</div>
          </div>
        </div>
      </div>

      <div className="quick-grid">
        {QUICK_ACTIONS.map(({ href, title, desc, icon: ActionIcon, tone }) => (
          <Link href={href} className="quick-card" key={href}>
            <div className="quick-top">
              <span className={`tile ${tone}`}>
                <ActionIcon size={20} />
              </span>
              <span className="q-arrow">
                <IconArrowRight size={17} />
              </span>
            </div>
            <div>
              <div className="q-title">{title}</div>
              <div className="q-desc">{desc}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="card">
        <div className="card-head">
          <div className="card-icon-title">
            <span className="tile tile-soft" style={{ width: 36, height: 36, borderRadius: 11 }}>
              <IconFile size={18} />
            </span>
            <h3>Recent documents</h3>
          </div>
          <Link href="/documents" className="btn btn-ghost btn-sm">
            View all
            <IconChevronRight size={15} />
          </Link>
        </div>

        {docs.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">
              <IconUpload size={26} />
            </div>
            <div className="empty-title">No documents yet</div>
            <p className="empty-text">
              Upload your first PDF to build your knowledge base, then search it or ask questions.
            </p>
            <Link href="/documents" className="btn" style={{ marginTop: 18 }}>
              <IconUpload size={16} />
              Upload a PDF
            </Link>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Pages</th>
                  <th>Status</th>
                  <th>Uploaded</th>
                </tr>
              </thead>
              <tbody>
                {docs.slice(0, 5).map((d) => (
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
                    <td className="muted">{new Date(d.created_at).toLocaleDateString()}</td>
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
