import React, { useEffect, useState } from "react";
import { listPipelines, createPipeline, triggerRun, listRuns } from "../api";
import PipelineCard from "../components/PipelineCard.jsx";
import RunTimeline from "../components/RunTimeline.jsx";
import HowItWorks from "../components/HowItWorks.jsx";
import DndBuilder from "../components/Builder/DndBuilder.jsx";
import Button from "../components/ui/Button.jsx";
import Section from "../components/ui/Section.jsx";
import Faq from "../components/Faq.jsx";

import { motion } from "framer-motion";
import { Rocket, PlusCircle, RefreshCw, BarChart, Layers, Activity } from "lucide-react";

const fadeUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } };

export default function Dashboard(){
  const [pipes, setPipes] = useState([]);
  const [runs, setRuns] = useState([]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [loading, setLoading] = useState(true);

  async function refresh(){
    setLoading(true);
    const [p, r] = await Promise.all([
      listPipelines().catch(()=>[]),
      listRuns().catch(()=>[])
    ]);
    setPipes(p); setRuns(r); setLoading(false);
  }
  useEffect(()=>{ refresh(); }, []);

  async function seed(){
    await createPipeline({
      name: "WebApp CI/CD",
      description: "Demo pipeline created from UI",
      stages: [
        { name: "Build",  jobs: [{ name: "Install deps" }, { name: "Build" }] },
        { name: "Test",   jobs: [{ name: "Unit tests" }] },
        { name: "Deploy", jobs: [{ name: "Deploy preview" }] }
      ]
    });
    await refresh();
  }

  async function savePipeline(payload){
    await createPipeline(payload);
    setShowBuilder(false);
    await refresh();
  }

  if (showBuilder){
    return <DndBuilder onSave={savePipeline} onCancel={()=>setShowBuilder(false)} />;
  }

  // derived stats (for the ribbon)
  const totalPipes = pipes.length;
  const totalRuns  = runs.length;
  const successPct = (() => {
    const jobs = runs.flatMap(r => r.stages.flatMap(s => s.jobs));
    const done = jobs.filter(j => j.status === "success").length;
    return jobs.length ? Math.round((done/jobs.length)*100) : 0;
  })();

  return (
    <div className="grid gap-10">
      {/* Quick actions section (fills empty space up top) */}
      <motion.div {...fadeUp} transition={{ duration: .25 }} className="rounded-2xl border bg-white/90 p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={()=>setShowBuilder(true)}><PlusCircle className="w-4 h-4" /> Open Builder</Button>
          <Button variant="success" onClick={seed}><Rocket className="w-4 h-4" /> Demo Pipeline</Button>
          <Button variant="outline" onClick={refresh}><RefreshCw className="w-4 h-4" /> Refresh</Button>
        </div>
        <div className="grid sm:grid-cols-3 gap-3 mt-4">
          <StatCard icon={<Layers className="w-5 h-5" />} label="Pipelines" value={totalPipes} />
          <StatCard icon={<Activity className="w-5 h-5" />} label="Total Runs" value={totalRuns} />
          <StatCard icon={<BarChart className="w-5 h-5" />} label="Success rate" value={`${successPct}%`} tone="ok" />
        </div>
      </motion.div>

      {/* Pipelines */}
      <Section title="Pipelines">
        <div id="pipelines" />
        {loading ? (
          <SkeletonGrid />
        ) : (
          <motion.div {...fadeUp} transition={{ duration: .25 }} className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {pipes.map(p => (
              <PipelineCard
                key={p._id}
                pipeline={p}
                onRun={async ()=>{ await triggerRun(p._id); await refresh(); }}
              />
            ))}
            {pipes.length === 0 && (
              <EmptyCard
                title="No pipelines yet"
                desc="Start by creating one in the visual builder or load a demo."
                primary={{ label: "Open Builder", onClick: ()=>setShowBuilder(true) }}
                secondary={{ label: "Demo Pipeline", onClick: seed }}
              />
            )}
          </motion.div>
        )}
      </Section>

      {/* Recent Runs */}
      <Section title="Recent Runs">
        <div id="runs" />
        {loading ? (
          <SkeletonList />
        ) : (
          <motion.div {...fadeUp} transition={{ duration: .25 }} className="grid gap-5">
            {runs.map(r => <RunTimeline key={r._id} run={r} />)}
            {runs.length === 0 && (
              <EmptyCard
                title="No runs to show"
                desc="Run a pipeline to see live logs and progress."
                primary={{ label: "Demo Pipeline", onClick: seed }}
              />
            )}
          </motion.div>
        )}
      </Section>

      {/* How it works (informative) */}
      <HowItWorks />


      {/* FAQ (details/summary = keyboard friendly; informative content) */}
      <Faq />

    </div>
  );
}

/* ---------- small presentational helpers ---------- */

function StatCard({ icon, label, value, tone }) {
  const color = tone === "ok" ? "text-emerald-600" : tone === "warn" ? "text-amber-600" : "text-indigo-600";
  return (
    <div className="rounded-xl border bg-white/90 p-4 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className={`${color}`}>{icon}</span>
        <div>
          <div className="text-xs text-slate-500">{label}</div>
          <div className="text-lg font-bold">{value}</div>
        </div>
      </div>
      <span className="text-slate-300">◆</span>
    </div>
  );
}

function EmptyCard({ title, desc, primary, secondary }) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <p className="text-base font-semibold">{title}</p>
      <p className="text-sm text-slate-600 mt-1">{desc}</p>
      <div className="mt-3 flex gap-2">
        {primary && <Button onClick={primary.onClick}>{primary.label}</Button>}
        {secondary && <Button variant="outline" onClick={secondary.onClick}>{secondary.label}</Button>}
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="h-5 w-1/2 bg-slate-200 rounded mb-2"></div>
          <div className="h-4 w-3/4 bg-slate-200 rounded mb-4"></div>
          <div className="h-3 w-full bg-slate-200 rounded mb-1"></div>
          <div className="h-3 w-2/3 bg-slate-200 rounded mb-1"></div>
          <div className="h-3 w-3/5 bg-slate-200 rounded"></div>
        </div>
      ))}
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="grid gap-5">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="h-5 w-1/3 bg-slate-200 rounded mb-3"></div>
          <div className="h-3 w-full bg-slate-200 rounded mb-1"></div>
          <div className="h-3 w-4/5 bg-slate-200 rounded"></div>
        </div>
      ))}
    </div>
  );
}
