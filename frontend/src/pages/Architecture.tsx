import React from "react";
import { Header } from "@/components/Header";
import { Icon } from "@/components/Icon";

const LAYERS = [
  { name: "Client Layer", tech: "React 19 + TypeScript + Tailwind CSS 4", color: "#f59e0b", icon: "web", desc: "Component-based UI, Zustand state management, Chart.js visualizations" },
  { name: "API Gateway", tech: "Vite Dev Proxy / Nginx", color: "#06b6d4", icon: "router", desc: "Request routing, CORS handling, JSON validation, error middleware" },
  { name: "Python Backend", tech: "FastAPI + Pydantic v2", color: "#10b981", icon: "terminal", desc: "Async route handlers, dependency injection, request/response schemas" },
  { name: "ML Service", tech: "scikit-learn MLPClassifier", color: "#8b5cf6", icon: "psychology", desc: "Bag-of-words extraction, neural network 60→32→16→6, softmax output" },
  { name: "Database", tech: "SQLite / PostgreSQL + SQLAlchemy", color: "#f43f5e", icon: "storage", desc: "ORM models, indexed queries, auto-migration, persistent storage" },
];

export const Architecture: React.FC<{ onMenuToggle: () => void }> = ({ onMenuToggle }) => (
  <>
    <Header title="Architecture" subtitle="Full-stack system design" onMenuToggle={onMenuToggle} showNewButton={false} />
    <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
      <div className="flex flex-col items-center gap-0 py-2">
        {LAYERS.map((l, i) => (
          <React.Fragment key={l.name}>
            <div className="w-full max-w-2xl bg-card rounded-2xl border-2 p-6 hover:scale-[1.01] hover:shadow-[0_0_40px_rgba(245,158,11,0.08)] transition-all duration-300 anim-fade-up cursor-default" style={{ borderColor: `${l.color}25`, animationDelay: `${i * 0.08}s` }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${l.color}12`, color: l.color }}>
                  <Icon name={l.icon} className="text-2xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3 className="text-base font-bold text-white">{l.name}</h3>
                    <span className="text-[10px] px-2.5 py-1 rounded-lg border font-mono" style={{ color: l.color, borderColor: `${l.color}25`, background: `${l.color}08` }}>{l.tech}</span>
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed">{l.desc}</p>
                </div>
                <span className="text-3xl font-black shrink-0" style={{ color: `${l.color}12` }}>{String(i + 1).padStart(2, "0")}</span>
              </div>
            </div>
            {i < LAYERS.length - 1 && (
              <div className="flex flex-col items-center py-1" style={{ color: `${l.color}30` }}>
                <div className="w-px h-4" style={{ background: `${l.color}30` }} />
                <div className="w-2 h-2 rounded-full anim-float" style={{ background: `${l.color}40` }} />
                <div className="w-px h-4" style={{ background: `${l.color}30` }} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="bg-card rounded-2xl border border-card-b p-6 anim-fade-up delay-5">
        <h3 className="text-sm font-semibold text-neutral-300 mb-4">Data Flow</h3>
        <div className="flex flex-wrap items-center gap-2">
          {["User Input", "→", "React State", "→", "Axios Request", "→", "FastAPI", "→", "Feature Extraction", "→", "Neural Network", "→", "Prediction", "→", "DB Write", "→", "JSON Response", "→", "UI Update"].map((s, i) =>
            s === "→" ? <span key={i} className="text-accent/40 text-sm">→</span> : (
              <span key={i} className="px-3 py-2 rounded-xl bg-bg-s border border-card-b text-[11px] text-neutral-400 font-medium">{s}</span>
            )
          )}
        </div>
      </div>
    </main>
  </>
);