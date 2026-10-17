import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { api, setToken } from "../lib/api";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      setToken(res.access_token);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="card" style={{ maxWidth: 420, margin: "40px auto" }}>
        <h2>Login</h2>
        <form onSubmit={submit}>
          <div style={{ marginBottom: 12 }}>
            <label className="label">Email</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label className="label">Password</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <div className="error">{error}</div>}
          <button className="btn" type="submit" disabled={loading} style={{ marginTop: 12, width: "100%" }}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p style={{ marginTop: 12, color: "var(--muted)" }}>
          No account? <a href="/register">Register</a>
        </p>
      </div>
    </Layout>
  );
}
