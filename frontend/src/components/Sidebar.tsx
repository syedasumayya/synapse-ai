import React from "react";
import { Icon } from "./Icon";

const NAV = [
  { id: "dashboard", icon: "dashboard", label: "Dashboard" },
  { id: "notes", icon: "edit_note", label: "Notes" },
  { id: "mllab", icon: "psychology", label: "ML Lab" },
  { id: "database", icon: "storage", label: "Database" },
  { id: "architecture", icon: "account_tree", label: "Architecture" },
  { id: "python", icon: "code", label: "Python Backend" },
];

interface Props {
  currentPage: string;
  onNavigate: (page: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<Props> = ({ currentPage, onNavigate, isOpen, onClose }) => (
  <>
    {isOpen && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" style={{ animation: "fadeUp 0.2s ease both" }} onClick={onClose} />
    )}
    <aside
      className={`fixed md:static z-50 w-[260px] min-w-[260px] bg-bg-s border-r border-card-b flex flex-col h-screen transition-transform duration-300 ease-out ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      {/* Logo */}
      <div className="p-6 pb-5 border-b border-card-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-orange-600 flex items-center justify-center shadow-lg shadow-accent/20 shrink-0">
            <Icon name="hub" style={{ fontSize: "22px", color: "white" }} />
          </div>
          <div className="min-w-0">
            <span className="text-[21px] font-extrabold bg-gradient-to-r from-accent via-orange-500 to-accent bg-clip-text text-transparent anim-grad leading-tight block">
              SYNAPSE
            </span>
            <p className="text-[9px] text-neutral-600 tracking-[0.18em] uppercase font-bold -mt-0.5">AI Platform</p>
          </div>
          <button className="md:hidden ml-auto text-neutral-500 hover:text-neutral-300 transition-colors p-1" onClick={onClose}>
            <Icon name="close" style={{ fontSize: "20px" }} />
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
        <p className="text-[9px] text-neutral-600 font-bold tracking-[0.18em] uppercase px-4 mb-3">Navigation</p>
        {NAV.map((item, i) => {
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); onClose(); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 anim-fade-up ${
                active
                  ? "bg-accent/10 text-accent border-l-[3px] border-accent pl-[13px]"
                  : "text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.03] border-l-[3px] border-transparent pl-[13px]"
              }`}
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <Icon name={item.icon} style={{ fontSize: "19px", opacity: active ? 1 : 0.5 }} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-card-b">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/[0.04] border border-accent/10">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent/20 to-orange-600/20 flex items-center justify-center shrink-0">
            <Icon name="neurology" style={{ fontSize: "18px", color: "#f59e0b" }} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-neutral-300">Neural Engine</p>
            <p className="text-[10px] text-neutral-600 font-mono">v2.4 · 60→32→16→6</p>
          </div>
          <div className="ml-auto w-2 h-2 rounded-full bg-ok animate-pulse shrink-0" />
        </div>
      </div>
    </aside>
  </>
);