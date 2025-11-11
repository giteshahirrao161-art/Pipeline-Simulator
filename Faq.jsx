import React from "react";

/**
 * GitHub-style compact FAQ using <details>/<summary>.
 * Uses your existing theme classes (card, border, etc.) — no extra CSS needed.
 */
export default function Faq() {
  return (
    <section id="faq" className="card" style={{ padding: 16 }}>
      <header className="card-head" style={{ marginBottom: 8 }}>
        <h3 className="card-title" style={{ fontSize: 16 }}>FAQ</h3>
        <span className="pill">help</span>
      </header>

      <div className="grid" style={{ gap: 8 }}>
        <details className="rounded-xl border" style={box}>
          <summary style={summary}>What is a stage vs a job?</summary>
          <p style={answer}>
            A <b>stage</b> groups jobs that run in sequence (e.g., <i>Build → Test → Deploy</i>).
            A <b>job</b> is a single step with its own script and logs (like “Build” or “Unit tests”).
          </p>
        </details>

        <details className="rounded-xl border" style={box}>
          <summary style={summary}>How do logs stream in real time?</summary>
          <p style={answer}>
            The client connects to the server over WebSockets (Socket.IO). As each job runs,
            log lines are emitted and appended to the UI instantly.
          </p>
        </details>

        <details className="rounded-xl border" style={box}>
          <summary style={summary}>Can I import my existing YAML?</summary>
          <p style={answer}>
            Yes. Use <b>Import YAML</b> in the Pipelines section. The simulator maps stages/jobs from the YAML fields.
          </p>
        </details>

        <details className="rounded-xl border" style={box}>
          <summary style={summary}>How do I deploy this?</summary>
          <p style={answer}>
            Host the React client on Vercel/Netlify and the Node server on Render/Fly/EC2. Configure CORS
            and set <code>VITE_API_BASE</code>/<code>VITE_WS_BASE</code> in your client env for API/WS endpoints.
          </p>
        </details>

        <details className="rounded-xl border" style={box}>
          <summary style={summary}>How do I reset the demo data?</summary>
          <p style={answer}>
            You can remove pipelines/runs from your DB (Mongo collection) or add a small admin endpoint to purge them.
            For dev, dropping the collections is fine.
          </p>
        </details>
      </div>
    </section>
  );
}

/* tiny inline styles to match your GitHub-like theme */
const box = { padding: 12, background: "#f6f8fa" };
const summary = {
  listStyle: "none",
  cursor: "pointer",
  fontWeight: 600,
  color: "var(--ink)",
};
const answer = { marginTop: 8, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.45 };
