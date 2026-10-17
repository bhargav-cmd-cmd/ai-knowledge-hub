import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { api, setToken } from "../lib/api";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.register({ email, password, full_name: fullName || null });
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
        <h2>Create account</h2>
        <form onSubmit={submit}>
          <div style={{ marginBottom: 12 }}>
            <label className="label">Full name</label>
            <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label className="label">Email</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label className="label">Password</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          {error && <div className="error">{error}</div>}
          <button className="btn" type="submit" disabled={loading} style={{ marginTop: 12, width: "100%" }}>
            {loading ? "Creating..." : "Register"}
          </button>
        </form>
      </div>
    </Layout>
  );
}
