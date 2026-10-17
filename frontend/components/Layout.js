import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { api, clearToken, getToken } from "../lib/api";

function readCachedUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch (e) {
    return null;
  }
}

export default function Layout({ children }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setOpen(false);
    const hasToken = !!getToken();
    setAuthed(hasToken);
    setUser(readCachedUser());
    if (!hasToken) return;
    api
      .me()
      .then((u) => {
        setUser(u);
        try {
          localStorage.setItem("user", JSON.stringify(u));
        } catch (e) {}
      })
      .catch(() => {});
  }, [router.asPath]);

  function logout() {
    clearToken();
    try {
      localStorage.removeItem("user");
    } catch (e) {}
    setUser(null);
    setAuthed(false);
    router.push("/login");
  }

  return (
    <div className="app-shell">
      <Sidebar open={open} onClose={() => setOpen(false)} authed={authed} user={user} onLogout={logout} />
      <div className="app-body">
        <Navbar onMenu={() => setOpen(true)} user={user} authed={authed} />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
