import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Icon } from "@/components/Icon";
import { CATEGORY_COLORS, PRIORITY_COLORS, type Note } from "@/types";
import * as api from "@/services/api";

export const Database: React.FC<{ onMenuToggle: () => void }> = ({ onMenuToggle }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.fetchNotes({ limit: 200 }).then(setNotes).finally(() => setLoading(false)); }, []);

  return (
    <>
      <Header title="Database" subtitle="SQLite raw data viewer" onMenuToggle={onMenuToggle} showNewButton={false} />
      <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3 flex-wrap anim-fade-up">
          {[
            { icon: "storage", color: "#f59e0b", label: "Records", value: notes.length },
            { icon: "database", color: "#06b6d4", label: "Engine", value: "SQLite" },
            { icon: "table_chart", color: "#10b981", label: "Table", value: "notes" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2.5 px-4 py-2.5 bg-card rounded-xl border border-card-b">
              <Icon name={s.icon} className="text-lg" style={{ color: s.color }} />
              <span className="text-sm text-neutral-400">{s.label}:</span>
              <span className="text-sm font-semibold text-white">{s.value}</span>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-2xl border border-card-b overflow-hidden anim-fade-up delay-1">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-card-b bg-bg-s/50">
                  {["ID", "Title", "Category", "Priority", "Tags", "AI", "Created"].map((h) => (
                    <th key={h} className="text-left px-4 py-3.5 text-[10px] font-semibold text-neutral-500 uppercase tracking-[0.1em]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-card-b/30"><td colSpan={7} className="px-4 py-4"><div className="skeleton h-4 w-full rounded" /></td></tr>
                  ))
                ) : notes.map((n) => (
                  <tr key={n.id} className="border-b border-card-b/30 hover:bg-bg-s/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-neutral-600">{n.id}</td>
                    <td className="px-4 py-3 text-neutral-300 max-w-[200px] truncate font-medium">{n.title}</td>
                    <td className="px-4 py-3"><span className="text-[10px] px-2.5 py-1 rounded-lg border font-medium" style={{ color: CATEGORY_COLORS[n.category], borderColor: `${CATEGORY_COLORS[n.category]}25`, background: `${CATEGORY_COLORS[n.category]}08` }}>{n.category}</span></td>
                    <td className="px-4 py-3 text-xs font-medium" style={{ color: PRIORITY_COLORS[n.priority as keyof typeof PRIORITY_COLORS] }}>{n.priority}</td>
                    <td className="px-4 py-3 text-xs text-neutral-500 max-w-[150px] truncate">{n.tags.join(", ") || "—"}</td>
                    <td className="px-4 py-3">{n.aiClassified ? <Icon name="check_circle" className="text-ok text-sm" /> : <Icon name="cancel" className="text-neutral-700 text-sm" />}</td>
                    <td className="px-4 py-3 text-xs text-neutral-600 font-mono">{n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!loading && notes.length === 0 && <p className="text-center text-neutral-600 py-16 text-sm">No records in database</p>}
        </div>

        <div className="bg-card rounded-2xl border border-card-b p-6 anim-fade-up delay-2">
          <h3 className="text-sm font-semibold text-neutral-300 mb-4">Schema</h3>
          <div className="bg-bg-s rounded-xl p-5 font-mono text-xs leading-relaxed text-neutral-400 overflow-x-auto">
            <pre>{`{
  "table": "notes",
  "keyPath": "id (auto-increment)",
  "indexes": ["category", "created_at"],
  "columns": [
    { "name": "title",      "type": "VARCHAR(255)", "null": false },
    { "name": "content",    "type": "TEXT",         "null": false },
    { "name": "category",   "type": "VARCHAR(50)",  "null": false },
    { "name": "priority",   "type": "VARCHAR(20)",  "null": false, "default": "Medium" },
    { "name": "tags",       "type": "VARCHAR(1000)","null": true  },
    { "name": "ai_classified","type":"BOOLEAN",      "null": false, "default": false },
    { "name": "confidence", "type": "FLOAT",        "null": true  },
    { "name": "created_at", "type": "DATETIME",     "null": false, "default": "NOW()" }
  ]
}`}</pre>
          </div>
        </div>
      </main>
    </>
  );
};