import { useState } from "react";
import { useRouter } from "next/router";
import AuthLayout from "../components/AuthLayout";
import { IconAlert, IconLock, IconMail, IconArrowRight } from "../components/Icons";
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
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue to your knowledge hub."
      footer={
        <>
          New here? <a href="/register">Create an account</a>
        </>
      }
    >
      <form onSubmit={submit}>
        <div className="field">
          <label className="label" htmlFor="login-email">
            Email address
          </label>
          <div className="input-wrap">
            <span className="input-icon">
              <IconMail size={17} />
            </span>
            <input
              id="login-email"
              className="input"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="login-password">
            Password
          </label>
          <div className="input-wrap">
            <span className="input-icon">
              <IconLock size={17} />
            </span>
            <input
              id="login-password"
              className="input"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {error && (
          <div className="error">
            <IconAlert size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>{error}</span>
          </div>
        )}

        <button className="btn btn-lg btn-block" type="submit" disabled={loading} style={{ marginTop: 18 }}>
          {loading ? (
            <>
              <span className="spinner" />
              Signing in…
            </>
          ) : (
            <>
              Sign in
              <IconArrowRight size={17} />
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
