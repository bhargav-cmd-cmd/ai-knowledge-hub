import {
  IconChat,
  IconSearch,
  IconShield,
  IconSparkles,
  IconUpload,
  LogoMark,
} from "./Icons";

const FEATURES = [
  {
    icon: IconUpload,
    tone: "tile-blue",
    title: "Upload any PDF",
    desc: "Documents are parsed, chunked and embedded automatically.",
  },
  {
    icon: IconSearch,
    tone: "tile-purple",
    title: "Semantic search",
    desc: "Find the exact passage you need across your whole library.",
  },
  {
    icon: IconSparkles,
    tone: "tile-cyan",
    title: "Answers with citations",
    desc: "Ask questions and get grounded answers referencing source pages.",
  },
  {
    icon: IconChat,
    tone: "tile-green",
    title: "Conversational memory",
    desc: "Keep a running chat with your knowledge base anytime.",
  },
];

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth-shell">
      <section className="auth-hero">
        <span className="auth-badge">
          <IconSparkles size={15} />
          AI-powered knowledge base
        </span>
        <h1 className="auth-headline">
          Your documents,
          <br />
          <span className="text-gradient">instantly intelligent.</span>
        </h1>
        <p className="auth-tagline">
          Upload PDFs, search them semantically and ask questions that come back with cited,
          trustworthy answers — all in one secure workspace.
        </p>
        <div className="auth-features">
          {FEATURES.map(({ icon: FeatureIcon, tone, title: t, desc }) => (
            <div className="auth-feature" key={t}>
              <span className={`tile ${tone}`}>
                <FeatureIcon size={19} />
              </span>
              <span>
                <span className="f-title">{t}</span>
                <span className="f-desc" style={{ display: "block" }}>
                  {desc}
                </span>
              </span>
            </div>
          ))}
        </div>
        <div className="row muted" style={{ gap: 9, fontSize: 13, marginTop: 8 }}>
          <IconShield size={16} />
          Your data stays private to your account.
        </div>
      </section>

      <section className="auth-form-side">
        <div className="card auth-card">
          <div className="auth-card-head">
            <div className="auth-logo">
              <LogoMark size={28} />
            </div>
            <h2>{title}</h2>
            <div className="sub">{subtitle}</div>
          </div>
          {children}
          {footer && <div className="auth-foot">{footer}</div>}
        </div>
      </section>
    </div>
  );
}
