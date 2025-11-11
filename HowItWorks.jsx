import React from "react";
import { Boxes, PlayCircle, RefreshCw, FileCode2, ArrowRight } from "lucide-react";

/**
 * Minimal, GitHub-like info box explaining the product in 3 steps.
 * - Uses your existing .card, .pill, .btn styles (no new CSS required).
 * - Includes a tiny YAML sample to make it feel practical.
 * - Anchor id="how" so your navbar links scroll here.
 */
export default function HowItWorks(){
  return (
    <section id="how" className="card" style={{ padding: 16 }}>
      <header className="card-head" style={{ marginBottom: 8 }}>
        <h3 className="card-title" style={{ fontSize: 16 }}>How it works</h3>
        <span className="pill">overview</span>
      </header>

      {/* 3 steps */}
      <ol style={{ display: "grid", gap: 10, listStyle: "none", padding: 0 }}>
        <li style={row}>
          <div style={left}>
            <span style={iconWrap}><Boxes className="icon" /></span>
            <strong>Design your pipeline</strong>
          </div>
          <div style={right}>
            Create stages and jobs in the builder or import from YAML. Each job has its own script and logs.
          </div>
        </li>

        <li style={row}>
          <div style={left}>
            <span style={iconWrap}><PlayCircle className="icon" /></span>
            <strong>Run & stream logs</strong>
          </div>
          <div style={right}>
            Trigger a run. Watch job status update live (queued → running → success/failed) with a progress bar.
          </div>
        </li>

        <li style={row}>
          <div style={left}>
            <span style={iconWrap}><RefreshCw className="icon" /></span>
            <strong>Iterate quickly</strong>
          </div>
          <div style={right}>
            Tweak steps, re-run, and compare runs. Keep branches isolated (e.g., <code>main</code>, <code>dev</code>).
          </div>
        </li>
      </ol>

      {/* Tiny YAML sample */}
      <div className="card" style={{ padding: 12, marginTop: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, color: "var(--ink-2)" }}>
          <FileCode2 className="icon" />
          <strong>Example YAML</strong>
        </div>
        <pre style={pre}>
{`name: WebApp CI
on: [push]
stages:
  - name: Build
    jobs:
      - name: Install deps
        run: npm ci
      - name: Build
        run: npm run build
  - name: Test
    jobs:
      - name: Unit tests
        run: npm test -- --ci
  - name: Deploy
    jobs:
      - name: Deploy preview
        run: npx vercel --prod
`}
        </pre>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
          <a href="#pipelines" className="btn btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            Import YAML <ArrowRight className="icon" />
          </a>
          <a href="#pipelines" className="btn">Open Builder</a>
        </div>
      </div>
    </section>
  );
}

/* tiny inline styles consistent with your GitHub theme */
const row = {
  display: "grid",
  gridTemplateColumns: "220px 1fr",
  gap: 12,
  alignItems: "start",
};
const left = { display: "flex", alignItems: "center", gap: 8, color: "var(--ink)" };
const right = { color: "var(--ink-2)" };
const iconWrap = {
  width: 22, height: 22, borderRadius: 6,
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  background: "#f6f8fa", border: "1px solid var(--border)"
};
const pre = {
  margin: 0,
  padding: "10px 12px",
  background: "#f6f8fa",
  border: "1px solid var(--border)",
  borderRadius: 6,
  overflowX: "auto",
  fontSize: 12.5,
  lineHeight: 1.5,
};
