import React, { useMemo } from "react";
import { PlayCircle, CheckCircle2, XCircle, Clock, ChevronDown, ChevronRight } from "lucide-react";

function fmtDate(ts) {
  if (!ts) return "—";
  try { return new Date(ts).toLocaleString(); } catch { return "—"; }
}
function fmtMs(ms) {
  if (ms == null) return "—";
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  if (m < 60) return `${m}m ${r}s`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return `${h}h ${rm}m`;
}
function StatusPill({ status }) {
  const map = {
    success: { text: "success", color: "#2da44e" },
    running: { text: "running", color: "#0969da" },
    failed:  { text: "failed",  color: "#d1242f" },
    queued:  { text: "queued",  color: "#6e7781" },
    cancelled:{ text:"cancelled", color:"#6e7781" },
  };
  const s = map[status] || { text: status || "—", color: "inherit" };
  return <span className="pill" style={{ color: s.color }}>{s.text}</span>;
}
function JobIcon({ status }) {
  if (status === "success") return <CheckCircle2 className="icon" color="#2da44e" />;
  if (status === "failed")  return <XCircle className="icon" color="#d1242f" />;
  if (status === "running") return <PlayCircle className="icon" color="#0969da" />;
  if (status === "queued")  return <Clock className="icon" color="#6e7781" />;
  return <Clock className="icon" color="#6e7781" />;
}

export default function RunTimeline({ run }) {
  // Defensive defaults
  const {
    _id = "",
    pipelineName = "Pipeline",
    status = "queued",
    startedAt,
    durationMs,
    stages = [],
  } = run || {};

  const stats = useMemo(() => {
    const jobs = stages.flatMap(s => s.jobs || []);
    const total = jobs.length || 1;
    const done = jobs.filter(j => j.status === "success").length;
    const failed = jobs.filter(j => j.status === "failed").length;
    const running = jobs.filter(j => j.status === "running").length;
    const pct = Math.round((done / total) * 100);
    return { total, done, failed, running, pct };
  }, [stages]);

  return (
    <section className="card" style={{ padding: 16 }}>
      {/* Header */}
      <div className="card-head" style={{ marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <h3 className="card-title" style={{ fontSize: 16 }}>{pipelineName} • Run <code>{_id.slice(0,8) || "—"}</code></h3>
          <StatusPill status={status} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--ink-3)", fontSize: 12 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Clock className="icon" /> {fmtDate(startedAt)}
          </span>
          <span>Duration: {fmtMs(durationMs)}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="progress" title={`${stats.pct}%`}>
        <div className="bar" style={{ width: `${stats.pct}%` }} />
      </div>
      <div style={{ display: "flex", gap: 12, color: "var(--ink-3)", fontSize: 12, marginTop: 6 }}>
        <span>jobs: {stats.done}/{stats.total} done</span>
        {stats.running > 0 && <span>• {stats.running} running</span>}
        {stats.failed > 0 && <span>• {stats.failed} failed</span>}
      </div>

      {/* Stages */}
      <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
        {(stages || []).map((stage, si) => (
          <details key={stage._id || `${stage.name}-${si}`} open style={detailsStyle}>
            <summary style={summaryStyle}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <ChevronDown className="icon" style={{ transform: "translateY(1px)" }} />
                <strong>{stage.name || `Stage ${si+1}`}</strong>
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 12, color: "var(--ink-3)", fontSize: 12 }}>
                <span>{(stage.jobs?.length ?? 0)} jobs</span>
                {stage.durationMs != null && <span>{fmtMs(stage.durationMs)}</span>}
              </span>
            </summary>

            <div style={{ display: "grid", gap: 6, marginTop: 8 }}>
              {(stage.jobs || []).map((job, ji) => (
                <div
                  key={job._id || `${job.name}-${ji}`}
                  style={jobRowStyle}
                  title={job.status || "—"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                    <JobIcon status={job.status} />
                    <div style={{ fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {job.name || `Job ${ji+1}`}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--ink-3)", fontSize: 12 }}>
                    {job.durationMs != null && <span>{fmtMs(job.durationMs)}</span>}
                    {job.status && <StatusPill status={job.status} />}
                  </div>
                </div>
              ))}
              {(stage.jobs || []).length === 0 && (
                <div style={emptyRowStyle}>No jobs found in this stage.</div>
              )}
            </div>
          </details>
        ))}
        {(stages || []).length === 0 && (
          <div style={emptyRowStyle}>No stages for this run.</div>
        )}
      </div>
    </section>
  );
}

/* Inline styles (kept tiny; uses your GitHub-like CSS tokens) */
const detailsStyle = {
  border: "1px solid var(--border)",
  borderRadius: 6,
  background: "var(--surface)",
  padding: 8,
};
const summaryStyle = {
  listStyle: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 8,
};
const jobRowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  padding: "8px 10px",
  border: "1px solid var(--border)",
  borderRadius: 6,
  background: "#fff",
};
const emptyRowStyle = {
  padding: "10px 12px",
  border: "1px dashed var(--border)",
  borderRadius: 6,
  color: "var(--ink-3)",
  background: "#fff",
};
