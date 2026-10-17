import Link from "next/link";
import { useRouter } from "next/router";
import {
  IconBot,
  IconChat,
  IconFile,
  IconGrid,
  IconLogout,
  IconSearch,
  IconSparkles,
  IconX,
  LogoMark,
} from "./Icons";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: IconGrid },
  { href: "/documents", label: "Documents", icon: IconFile },
  { href: "/search", label: "Search", icon: IconSearch },
  { href: "/ask", label: "Ask AI", icon: IconSparkles, pill: "AI" },
  { href: "/chat", label: "Chat", icon: IconChat },
];

export function userInitial(user) {
  const source = user?.full_name || user?.email || "";
  return source.trim().charAt(0).toUpperCase() || "?";
}

export default function Sidebar({ open, onClose, authed, user, onLogout }) {
  const router = useRouter();
  const initial = userInitial(user);

  return (
    <>
      <aside className={`sidebar${open ? " open" : ""}`}>
        <div className="brand">
          <span className="brand-mark">
            <LogoMark size={24} />
          </span>
          <span className="brand-text">
            <span className="brand-name">AI Knowledge Hub</span>
            <span className="brand-sub">Knowledge Engine</span>
          </span>
          <button
            className="btn btn-ghost btn-icon menu-btn"
            style={{ marginLeft: "auto" }}
            onClick={onClose}
            aria-label="Close menu"
            type="button"
          >
            <IconX size={18} />
          </button>
        </div>

        <nav className="nav-list">
          <div className="nav-section">Workspace</div>
          {NAV_ITEMS.map(({ href, label, icon: NavIcon, pill }) => (
            <Link
              key={href}
              href={href}
              className={`nav-item${router.pathname === href ? " active" : ""}`}
              onClick={onClose}
            >
              <span className="nav-icon">
                <NavIcon size={19} />
              </span>
              {label}
              {pill && <span className="nav-pill">{pill}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          {authed ? (
            <>
              <div className="nav-section" style={{ paddingBottom: 0 }}>
                Account
              </div>
              <div className="sidebar-user">
                <span className="avatar">{initial}</span>
                <span className="meta">
                  <span className="name">{user?.full_name || user?.email || "Signed in"}</span>
                  <span className="role">{user?.full_name && user?.email ? user.email : "Member"}</span>
                </span>
              </div>
              <button className="btn btn-secondary btn-block" type="button" onClick={onLogout}>
                <IconLogout size={17} />
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-block" onClick={onClose}>
                Sign in
              </Link>
              <Link href="/register" className="btn btn-secondary btn-block" onClick={onClose}>
                Create account
              </Link>
            </>
          )}
          <div
            className="row text-sm muted"
            style={{ justifyContent: "center", gap: 8, fontSize: 12, opacity: 0.75 }}
          >
            <IconBot size={15} />
            RAG · Vectors · Citations
          </div>
        </div>
      </aside>
      <div className={`sidebar-overlay${open ? " show" : ""}`} onClick={onClose} />
    </>
  );
}
