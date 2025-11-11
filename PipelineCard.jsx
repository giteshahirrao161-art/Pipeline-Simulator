import React from "react";
import { Play, Clock, GitBranch, Settings2 } from "lucide-react";

function fmtDate(ts) {
  if (!ts) return "—";
  try { return new Date(ts).toLocaleString(); } catch { return "—"; }
}

function StatusPill({ status }) {
  const map = {
    success: { text: "success", cls: "pill", style: { color: "#2da44e" } },
    running: { text: "running", cls: "pill", style: { color: "#0969da" } },
    failed:  { text: "failed",  cls: "pill", style: { color: "#d1242f" } },
    queued:  { text: "queued",  cls: "pill", style: { color: "#6e7781" } },
  };
  const s = map[status] || { text: status || "—", cls: "pill", style: {} };
  return <span className={s.cls} style={s.style}>{s.text}</span>;
}

/**
 * GitHub-like compact list item:
 * - Left: name + description + meta row
 * - Right: actions (Run, Settings)
 */
export default function PipelineCard({ pipeline, onRun, onOpen }) {
  const { name, description, branch = "main", updatedAt, lastStatus, _id } = pipeline;

  return (
    <div
      className="card"
      style={{
        padding: 12,
        borderRadius: 6,
        boxShadow: "var(--shadow-1)",
        transition: "background .12s ease, box-shadow .12s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-2)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-1)")}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", justifyContent: "space-between" }}>
        {/* Left: title + desc */}
        <div style={{ minWidth: 0, flex: "1 1 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <a
              href="#pipelines"
              onClick={(e) => { e.preventDefault(); onOpen && onOpen(_id); }}
              className="card-title"
              style={{ fontSize: 16, fontWeight: 800, color: "var(--ink)" }}
              title={name}
            >
              {name}
            </a>
            <StatusPill status={lastStatus} />
          </div>

          {description && (
            <p style={{ marginTop: 4, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.35 }}>
              {description}
            </p>
          )}

          {/* meta row */}
          <div style={{ display: "flex", gap: 14, alignItems: "center", marginTop: 8, color: "var(--ink-3)", fontSize: 12, flexWrap: "wrap" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <GitBranch className="icon" /> {branch}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Clock className="icon" /> Updated {fmtDate(updatedAt)}
            </span>
            <span>ID: {_id?.slice?.(0, 8) || "—"}</span>
          </div>
        </div>

        {/* Right: actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <button
            className="btn btn-primary"
            title="Run pipeline"
            onClick={() => onRun && onRun(_id)}
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <Play className="icon" /> Run
          </button>
          <button
            className="btn"
            title="Settings"
            onClick={() => onOpen && onOpen(_id)}
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <Settings2 className="icon" /> Settings
          </button>
        </div>
      </div>
    </div>
  );
}
