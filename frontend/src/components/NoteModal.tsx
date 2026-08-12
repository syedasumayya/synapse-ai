import React, { useState } from "react";
import { Icon } from "./Icon";
import { useToastStore } from "@/store/useToastStore";
import { useNoteStore } from "@/store/useNoteStore";
import { CATEGORIES, PRIORITIES, CATEGORY_COLORS, type Note, type PredictionResult } from "@/types";
import * as api from "@/services/api";

interface Props {
  note: Note | null;
  onClose: () => void;
}

export const NoteModal: React.FC<Props> = ({ note, onClose }) => {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [category, setCategory] = useState(note?.category || "Work");
  const [priority, setPriority] = useState(note?.priority || "Medium");
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [predicting, setPredicting] = useState(false);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToastStore();
  const { addNote, editNote } = useNoteStore();

  const handleAI = async () => {
    const text = `${title} ${content}`.trim();
    if (!text) { addToast("Enter some text first", "err"); return; }
    setPredicting(true);
    try {
      const result = await api.predictText(text);
      setPrediction(result);
      setCategory(result.category);
      setPriority(result.priority);
      addToast(`Classified as ${result.category} (${(result.confidence * 100).toFixed(1)}%)`, "accent");
    } catch { addToast("Prediction failed", "err"); }
    finally { setPredicting(false); }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) { addToast("Title and content required", "err"); return; }
    setSaving(true);
    try {
      if (note) { await editNote(note.id, { title, content, category, priority }); addToast("Note updated", "ok"); }
      else { await addNote({ title, content, category, priority }); addToast("Note created", "ok"); }
      onClose();
    } catch { addToast("Save failed", "err"); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm anim-fade-up" style={{ animationDuration: "0.2s" }} onClick={onClose}>
      <div className="bg-bg-t border border-card-b rounded-2xl w-full max-w-lg p-6 anim-scale-in max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">{note ? "Edit Note" : "Create New Note"}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-card text-neutral-500 hover:text-neutral-300 transition-colors"><Icon name="close" className="text-xl" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-[11px] text-neutral-500 mb-1.5 block font-medium uppercase tracking-wider">Title</label>
            <input value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} placeholder="Enter note title..." className="w-full px-4 py-3 bg-card border border-card-b rounded-xl text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all" />
          </div>
          <div>
            <label className="text-[11px] text-neutral-500 mb-1.5 block font-medium uppercase tracking-wider">Content</label>
            <textarea value={content} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)} rows={4} placeholder="Write your note content..." className="w-full px-4 py-3 bg-card border border-card-b rounded-xl text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] text-neutral-500 mb-1.5 block font-medium uppercase tracking-wider">Category</label>
              <select value={category} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)} className="w-full px-4 py-3 bg-card border border-card-b rounded-xl text-sm text-neutral-200 focus:outline-none focus:border-accent/50 transition-all">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] text-neutral-500 mb-1.5 block font-medium uppercase tracking-wider">Priority</label>
              <select value={priority} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPriority(e.target.value)} className="w-full px-4 py-3 bg-card border border-card-b rounded-xl text-sm text-neutral-200 focus:outline-none focus:border-accent/50 transition-all">
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          {prediction && (
            <div className="bg-accent/[0.04] border border-accent/20 rounded-xl p-4 anim-fade-up" style={{ animationDuration: "0.3s" }}>
              <div className="flex items-center gap-2 mb-3">
                <Icon name="auto_awesome" className="text-accent" />
                <span className="text-xs font-semibold text-accent">AI Prediction</span>
                <span className="text-[10px] text-accent/50 ml-auto font-mono">{(prediction.confidence * 100).toFixed(1)}%</span>
              </div>
              <div className="space-y-1.5">
                {Object.entries(prediction.probabilities).map(([cat, prob]) => (
                  <div key={cat} className="flex items-center gap-2">
                    <span className="text-[10px] w-16 text-neutral-500">{cat}</span>
                    <div className="flex-1 h-1.5 bg-bg-s rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${prob * 100}%`, background: CATEGORY_COLORS[cat as keyof typeof CATEGORY_COLORS] }} />
                    </div>
                    <span className="text-[10px] text-neutral-600 w-8 text-right font-mono">{(prob * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
              {prediction.tags.length > 0 && (
                <div className="flex gap-1.5 mt-3">
                  {prediction.tags.map((t) => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent-l border border-accent/20">{t}</span>)}
                </div>
              )}
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button onClick={handleAI} disabled={predicting} className="border border-card-b px-4 py-3 rounded-xl text-sm font-medium text-neutral-300 hover:border-accent/50 hover:text-accent hover:bg-accent/5 transition-all flex items-center gap-2 disabled:opacity-40 disabled:pointer-events-none">
              <Icon name={predicting ? "hourglass_empty" : "auto_awesome"} className="text-base" />
              {predicting ? "Classifying..." : "AI Classify"}
            </button>
            <button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-accent to-accent-h hover:shadow-[0_4px_24px_rgba(245,158,11,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-black disabled:opacity-40 disabled:pointer-events-none">
              {saving ? "Saving..." : note ? "Update Note" : "Save Note"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};