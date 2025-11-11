import React, { useEffect, useState } from "react";
import { listPipelines, triggerRun } from "../api";
import PipelineCard from "../components/PipelineCard.jsx";
import Button from "../components/ui/Button.jsx";

export default function PipelinesPage() {
  const [pipes, setPipes] = useState(null);

  async function refresh() {
    const data = await listPipelines().catch(() => []);
    setPipes(data);
  }
  useEffect(() => { refresh(); }, []);

  if (pipes == null) {
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
        <h3 className="card-title" style={{ fontSize: 16 }}>Pipelines</h3>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="outline" onClick={refresh}>Refresh</Button>
        </div>
      </div>

      <div className="grid" style={{ gap: 12 }}>
        {pipes.length > 0 ? pipes.map(p => (
          <PipelineCard
            key={p._id}
            pipeline={p}
            onRun={async () => { await triggerRun(p._id); await refresh(); }}
            onOpen={() => {}}
          />
        )) : (
          <div className="card" style={{ padding: 16, color: "var(--ink-2)" }}>
            No pipelines yet.
          </div>
        )}
      </div>
    </div>
  );
}
