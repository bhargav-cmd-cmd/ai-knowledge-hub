import { useState } from "react";
import { useRouter } from "next/router";
import AuthLayout from "../components/AuthLayout";
import { IconAlert, IconArrowRight, IconLock, IconMail, IconUser } from "../components/Icons";
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
    <AuthLayout
      title="Create your account"
      subtitle="Start turning your PDFs into answers in under a minute."
      footer={
        <>
          Already registered? <a href="/login">Sign in</a>
        </>
      }
    >
      <form onSubmit={submit}>
        <div className="field">
          <label className="label" htmlFor="reg-name">
            Full name <span className="muted">(optional)</span>
          </label>
          <div className="input-wrap">
            <span className="input-icon">
              <IconUser size={17} />
            </span>
            <input
              id="reg-name"
              className="input"
              autoComplete="name"
              placeholder="Ada Lovelace"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="reg-email">
            Email address
          </label>
          <div className="input-wrap">
            <span className="input-icon">
              <IconMail size={17} />
            </span>
            <input
              id="reg-email"
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
          <label className="label" htmlFor="reg-password">
            Password
          </label>
          <div className="input-wrap">
            <span className="input-icon">
              <IconLock size={17} />
            </span>
            <input
              id="reg-password"
              className="input"
              type="password"
              autoComplete="new-password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div className="hint">Use 6+ characters. Your account is scoped to your own documents.</div>
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
              Creating account…
            </>
          ) : (
            <>
              Create account
              <IconArrowRight size={17} />
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
