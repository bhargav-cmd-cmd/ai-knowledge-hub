import Link from "next/link";
import { useRouter } from "next/router";
import { IconMenu, IconPlus } from "./Icons";
import { userInitial } from "./Sidebar";

const TITLES = {
  "/dashboard": "Dashboard",
  "/documents": "Documents",
  "/search": "Semantic search",
  "/ask": "Ask AI",
  "/chat": "Chat history",
};

export default function Navbar({ onMenu, user, authed }) {
  const router = useRouter();
  const title = TITLES[router.pathname] || "AI Knowledge Hub";
  const initial = userInitial(user);

  return (
    <header className="topbar">
      <button className="btn btn-ghost btn-icon menu-btn" onClick={onMenu} aria-label="Open menu" type="button">
        <IconMenu size={20} />
      </button>

      <span className="topbar-brand">
        <span
          className="brand-mark"
          style={{ width: 30, height: 30, borderRadius: 10, boxShadow: "none" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2.6 3.6 7.1v9.8L12 21.4l8.4-4.5V7.1L12 2.6z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
              opacity="0.55"
            />
            <path d="M12 7.2 7.8 9.5v4.6L12 16.4l4.2-2.3V9.5L12 7.2z" fill="currentColor" opacity="0.95" />
          </svg>
        </span>
        AI Knowledge Hub
      </span>

      <span className="topbar-title">{title}</span>

      <div className="topbar-right">
        {authed && (
          <Link href="/documents" className="btn btn-sm hidden-mobile" style={{ marginRight: 4 }}>
            <IconPlus size={15} />
            New upload
          </Link>
        )}
        {authed && (
          <span className="topbar-chip">
            <span className="avatar">{initial}</span>
            <span className="label">{user?.full_name || user?.email || "Account"}</span>
          </span>
        )}
      </div>
    </header>
  );
}
