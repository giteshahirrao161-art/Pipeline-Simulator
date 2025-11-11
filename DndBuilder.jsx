import React, { useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { v4 as uuid } from "uuid";

function SortableItem({ id, children, className="" }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1 };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={className}>
      {children}
    </div>
  );
}

export default function DndBuilder({ initial, onSave, onCancel }) {
  // pipeline state: [{id, name, jobs:[{id,name,script}]}]
  const [stages, setStages] = useState(() => (
    initial?.stages ?? [
      { id: uuid(), name: "Build", jobs: [{ id: uuid(), name: "Install deps", script: "npm ci" }, { id: uuid(), name: "Build", script: "npm run build" }] },
      { id: uuid(), name: "Test", jobs: [{ id: uuid(), name: "Unit tests", script: "npm test -- --ci" }] },
      { id: uuid(), name: "Deploy", jobs: [{ id: uuid(), name: "Deploy preview", script: "echo deploy" }] },
    ]
  ));
  const [name, setName] = useState(initial?.name || "My CI/CD");
  const [description, setDescription] = useState(initial?.description || "Created with Builder");

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 }}));

  // Drag handlers (stage-level)
  function onDragEndStage(e) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = stages.findIndex(s => s.id === active.id);
    const newIdx = stages.findIndex(s => s.id === over.id);
    setStages(arrayMove(stages, oldIdx, newIdx));
  }

  // Drag handlers (job-level per stage)
  function onDragEndJob(stageId, e) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    setStages(prev => {
      const copy = structuredClone(prev);
      const st = copy.find(s => s.id === stageId);
      const oldIdx = st.jobs.findIndex(j => j.id === active.id);
      const newIdx = st.jobs.findIndex(j => j.id === over.id);
      st.jobs = arrayMove(st.jobs, oldIdx, newIdx);
      return copy;
    });
  }

  // helpers
  const addStage = () => setStages(s => [...s, { id: uuid(), name: `Stage ${s.length+1}`, jobs: [] }]);
  const removeStage = (id) => setStages(s => s.filter(x => x.id !== id));
  const renameStage = (id, v) => setStages(s => s.map(x => x.id===id?{...x,name:v}:x));

  const addJob = (stageId) => setStages(s => s.map(st => st.id===stageId ? ({...st, jobs:[...st.jobs, { id: uuid(), name: "New job", script: "echo hi" }]}) : st));
  const removeJob = (stageId, jobId) => setStages(s => s.map(st => st.id===stageId ? ({...st, jobs: st.jobs.filter(j=>j.id!==jobId)}) : st));
  const editJob = (stageId, jobId, field, val) =>
    setStages(s => s.map(st => st.id===stageId ? ({...st, jobs: st.jobs.map(j => j.id===jobId ? ({...j, [field]: val}) : j)}) : st));

  // Save -> convert to server shape
  function save() {
    const payload = {
      name, description,
      stages: stages.map(st => ({
        name: st.name,
        jobs: st.jobs.map(j => ({ name: j.name, script: j.script }))
      }))
    };
    onSave?.(payload);
  }

  return (
    <div className="grid gap-4">
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="grid gap-1">
            <span className="text-sm font-medium">Pipeline name</span>
            <input className="border rounded px-3 py-2" value={name} onChange={e=>setName(e.target.value)} />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium">Description</span>
            <input className="border rounded px-3 py-2" value={description} onChange={e=>setDescription(e.target.value)} />
          </label>
        </div>
        <div className="mt-3 flex gap-2">
          <button className="rounded bg-indigo-600 text-white px-3 py-2" onClick={save}>Save Pipeline</button>
          <button className="rounded border px-3 py-2" onClick={addStage}>Add Stage</button>
          <button className="rounded border px-3 py-2" onClick={onCancel}>Back</button>
        </div>
      </div>

      {/* Stage list DnD */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEndStage}>
        <SortableContext items={stages.map(s=>s.id)} strategy={verticalListSortingStrategy}>
          <div className="grid gap-4">
            {stages.map(stage => (
              <SortableItem key={stage.id} id={stage.id}
                className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <input className="border rounded px-2 py-1 font-medium"
                         value={stage.name}
                         onChange={e=>renameStage(stage.id, e.target.value)} />
                  <button className="ml-auto text-red-600 text-sm" onClick={()=>removeStage(stage.id)}>Remove</button>
                </div>

                {/* Jobs inside stage */}
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e)=>onDragEndJob(stage.id, e)}>
                  <SortableContext items={stage.jobs.map(j=>j.id)} strategy={verticalListSortingStrategy}>
                    <div className="grid gap-2">
                      {stage.jobs.map(job => (
                        <SortableItem key={job.id} id={job.id}
                          className="rounded-lg border p-3 bg-gray-50">
                          <div className="grid md:grid-cols-2 gap-2 items-start">
                            <input className="border rounded px-2 py-1"
                                   value={job.name}
                                   onChange={e=>editJob(stage.id, job.id, "name", e.target.value)} />
                            <input className="border rounded px-2 py-1 font-mono"
                                   value={job.script}
                                   onChange={e=>editJob(stage.id, job.id, "script", e.target.value)} />
                          </div>
                          <div className="mt-2">
                            <button className="text-xs text-red-600" onClick={()=>removeJob(stage.id, job.id)}>
                              Remove job
                            </button>
                          </div>
                        </SortableItem>
                      ))}
                      <button className="rounded border px-2 py-1 w-fit" onClick={()=>addJob(stage.id)}>+ Add job</button>
                    </div>
                  </SortableContext>
                </DndContext>
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
