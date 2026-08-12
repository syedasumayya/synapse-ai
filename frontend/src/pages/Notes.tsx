import React from "react";
import { Header } from "@/components/Header";
import { Icon } from "@/components/Icon";
import { useNoteStore } from "@/store/useNoteStore";
import { useToastStore } from "@/store/useToastStore";
import { CATEGORIES, CATEGORY_COLORS, CATEGORY_ICONS, PRIORITY_COLORS, type Note, type Category, type Priority } from "@/types";

interface Props { onNewNote: () => void; onEditNote: (note: Note) => void; onMenuToggle: () => void; }

const getCatColor = (cat: string): string => (CATEGORY_COLORS as Record<string, string>)[cat] || "#666";
const getPriColor = (pri: string): string => (PRIORITY_COLORS as Record<string, string>)[pri] || "#6b7280";

export const Notes: React.FC<Props> = ({ onNewNote, onEditNote, onMenuToggle }) => {
  const { filterCategory, setFilter, searchQuery, setSearch, filteredNotes, loading } = useNoteStore();
  const { addToast } = useToastStore();
  const notes = filteredNotes();

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    await useNoteStore.getState().removeNote(id);
    addToast("Note deleted", "err");
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width) * 100;
    const my = ((e.clientY - r.top) / r.height) * 100;
    el.style.setProperty("--mx", mx + "%");
    el.style.setProperty("--my", my + "%");
  };

  return (
    <>
      <Header title="Notes" subtitle="AI-powered note management" onNewNote={onNewNote} onMenuToggle={onMenuToggle} />
      <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 anim-fade-up">
          <div className="relative flex-1">
            <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" style={{ fontSize: "18px" }} />
            <input
              type="text"
              placeholder="Search by title or content..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-card border border-card-b rounded-xl text-[13px] text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-all"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => setFilter("All")}
              className={`px-4 py-2.5 rounded-xl text-[11px] font-semibold border transition-all tracking-wide ${
                filterCategory === "All" ? "bg-white/[0.08] border-white/20 text-white" : "border-card-b text-neutral-500 hover:border-neutral-600 hover:text-neutral-300"
              }`}
            >
              All
            </button>
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className="px-4 py-2.5 rounded-xl text-[11px] font-semibold border transition-all tracking-wide"
                style={filterCategory === c ? { background: `${CATEGORY_COLORS[c]}12`, borderColor: `${CATEGORY_COLORS[c]}35`, color: CATEGORY_COLORS[c] } : { borderColor: "#2a2a2a", color: "#737373" }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-card rounded-2xl border border-card-b p-5 space-y-4">
                <div className="skeleton h-4 w-16 rounded-lg" />
                <div className="skeleton h-5 w-3/4 rounded-lg" />
                <div className="space-y-1.5"><div className="skeleton h-3 w-full rounded" /><div className="skeleton h-3 w-5/6 rounded" /></div>
                <div className="flex gap-2 pt-2"><div className="skeleton h-6 w-14 rounded-full" /><div className="skeleton h-6 w-14 rounded-full" /></div>
              </div>
            ))}
          </div>
        ) : notes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {notes.map((n, i) => {
              const catColor = getCatColor(n.category);
              const priColor = getPriColor(n.priority);
              return (
                <div
                  key={n.id}
                  onClick={() => onEditNote(n)}
                  className="card-glow bg-card rounded-2xl border border-card-b p-5 hover:border-card-h transition-all duration-300 group cursor-pointer anim-fade-up"
                  style={{ animationDelay: `${i * 0.04}s` }}
                  onMouseMove={handleCardMouseMove}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-[10px] px-2.5 py-1 rounded-lg border font-semibold tracking-wide" style={{ color: catColor, borderColor: `${catColor}25`, background: `${catColor}08` }}>
                      {n.category}
                    </span>
                    <button onClick={(e: React.MouseEvent) => handleDelete(e, n.id)} className="p-1.5 rounded-lg hover:bg-err/10 text-neutral-700 hover:text-err transition-all opacity-0 group-hover:opacity-100">
                      <Icon name="delete_outline" style={{ fontSize: "16px" }} />
                    </button>
                  </div>
                  <h3 className="text-[14px] font-semibold text-neutral-200 mb-2 leading-snug group-hover:text-white transition-colors">{n.title}</h3>
                  <p className="text-[12px] text-neutral-500 line-clamp-2 mb-4 leading-relaxed">{n.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1.5 flex-wrap">
                      {(n.tags || []).slice(0, 3).map(t => (
                        <span key={t} className="text-[9px] px-2 py-0.5 rounded-md bg-accent/[0.08] text-accent-l/80 border border-accent/15 font-medium">{t}</span>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold" style={{ color: priColor }}>{n.priority}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3.5 pt-3.5 border-t border-card-b/50">
                    {n.aiClassified ? (
                      <span className="flex items-center gap-1 text-[10px] text-accent/60 font-medium"><Icon name="auto_awesome" style={{ fontSize: "12px" }} /> AI</span>
                    ) : (
                      <span className="text-[10px] text-neutral-700 font-medium">Manual</span>
                    )}
                    <span className="text-[10px] text-neutral-700 ml-auto font-mono">{n.createdAt ? new Date(n.createdAt).toLocaleDateString() : ""}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 anim-fade-up">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/15 flex items-center justify-center mb-5">
              <Icon name="note_stack" className="text-4xl text-accent/40" />
            </div>
            <p className="text-[15px] text-neutral-400 font-semibold mb-1">No notes found</p>
            <p className="text-[12px] text-neutral-600 mb-6">
              {searchQuery || filterCategory !== "All" ? "Try a different filter or search term" : "Create your first note to get started"}
            </p>
            <button onClick={onNewNote} className="bg-gradient-to-r from-accent to-accent-h hover:shadow-[0_4px_24px_rgba(245,158,11,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all px-6 py-3 rounded-xl text-[13px] font-semibold text-black flex items-center gap-2">
              <Icon name="add" style={{ fontSize: "18px" }} /> Create First Note
            </button>
          </div>
        )}
      </main>
    </>
  );
};