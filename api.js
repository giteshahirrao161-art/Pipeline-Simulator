import axios from "axios";
const base = import.meta.env.VITE_API_BASE || "http://localhost:4000";
export const api = axios.create({ baseURL: `${base}/api` });

export const listPipelines = () => api.get("/pipelines").then(r => r.data);
export const createPipeline = (p) => api.post("/pipelines", p).then(r => r.data);
export const triggerRun = (id, params={}) => api.post(`/pipelines/${id}/run`, params).then(r => r.data);
export const listRuns = () => api.get("/runs").then(r => r.data);
export const getRun = (id) => api.get(`/runs/${id}`).then(r => r.data);
