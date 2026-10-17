import Link from "next/link";
import { clearToken, getToken } from "../lib/api";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  useEffect(() => { setAuthed(!!getToken()); }, [router.asPath]);

  function logout() {
    clearToken();
    router.push("/login");
  }

  return (
    <nav className="navbar">
      <div className="brand">AI Knowledge Hub</div>
      <div className="nav-links">
        {authed ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/documents">Documents</Link>
            <Link href="/search">Search</Link>
            <Link href="/ask">Ask AI</Link>
            <Link href="/chat">Chat</Link>
            <button className="btn btn-secondary" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
