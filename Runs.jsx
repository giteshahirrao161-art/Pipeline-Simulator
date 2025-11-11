import React, { useEffect, useState } from "react";
import { listRuns } from "../api";
import RunTimeline from "../components/RunTimeline.jsx";
import Button from "../components/ui/Button.jsx";

export default function RunsPage() {
  const [runs, setRuns] = useState(null);

  async function refresh() {
    const data = await listRuns().catch(() => []);
    setRuns(data);
  }
  useEffect(() => { refresh(); }, []);

  if (runs == null) {
    return (
      <div className="card" style={{ padding: 16 }}>
        <div className="skeletons">
          <div className="sk"></div>
          <div className="sk w-60"></div>
          <div className="sk w-80"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid" style={{ gap: 12 }}>
      <div className="card" style={{ padding: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h3 className="card-title" style={{ fontSize: 16 }}>Recent Runs</h3>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="outline" onClick={refresh}>Refresh</Button>
        </div>
      </div>

      <div className="grid" style={{ gap: 12 }}>
        {runs.length > 0 ? runs.map(r => (
          <RunTimeline key={r._id} run={r} />
        )) : (
          <div className="card" style={{ padding: 16, color: "var(--ink-2)" }}>
            No runs to show.
          </div>
        )}
      </div>
    </div>
  );
}
