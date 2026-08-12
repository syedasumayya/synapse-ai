import axios from "axios";
import type { Note, PredictionResult, DashboardStats, ModelInfo } from "@/types";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

export async function fetchNotes(params?: { category?: string; search?: string; limit?: number; offset?: number }): Promise<Note[]> {
  const { data } = await api.get<Note[]>("/notes", { params });
  return data;
}

export async function fetchNote(id: number): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(payload: { title: string; content: string; category?: string; priority?: string }): Promise<Note> {
  const { data } = await api.post<Note>("/notes", payload);
  return data;
}

export async function updateNote(id: number, payload: Partial<Note>): Promise<Note> {
  const { data } = await api.put<Note>(`/notes/${id}`, payload);
  return data;
}

export async function deleteNote(id: number): Promise<void> {
  await api.delete(`/notes/${id}`);
}

export async function fetchStats(): Promise<DashboardStats> {
  const { data } = await api.get<DashboardStats>("/notes/stats/summary");
  return data;
}

export async function predictText(text: string): Promise<PredictionResult> {
  const { data } = await api.post<PredictionResult>("/ml/predict", { text });
  return data;
}

export async function fetchModelInfo(): Promise<ModelInfo> {
  const { data } = await api.get<ModelInfo>("/ml/model-info");
  return data;
}

export async function retrainModel(): Promise<{ status: string; info: ModelInfo }> {
  const { data } = await api.post("/ml/retrain");
  return data;
}