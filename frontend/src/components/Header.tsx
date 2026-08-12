import React from "react";
import { Icon } from "./Icon";

interface Props {
  title: string;
  subtitle?: string;
  onNewNote?: () => void;
  onMenuToggle?: () => void;
  showNewButton?: boolean;
}

export const Header: React.FC<Props> = ({ title, subtitle, onNewNote, onMenuToggle, showNewButton = true }) => (
  <header className="flex items-center justify-between px-5 md:px-8 py-4 border-b border-card-b bg-bg-s/60 backdrop-blur-md shrink-0">
    <div className="flex items-center gap-3 min-w-0">
      {onMenuToggle && (
        <button onClick={onMenuToggle} className="p-2 rounded-xl hover:bg-card text-neutral-400 transition-colors shrink-0">
          <Icon name="menu" style={{ fontSize: "20px" }} />
        </button>
      )}
      <div className="min-w-0">
        <h1 className="text-[17px] md:text-[19px] font-bold text-white tracking-tight truncate">{title}</h1>
        {subtitle && <p className="text-[11px] text-neutral-500 mt-0.5 truncate">{subtitle}</p>}
      </div>
    </div>
    {showNewButton && onNewNote && (
      <button
        onClick={onNewNote}
        className="group bg-gradient-to-r from-accent to-accent-h hover:shadow-[0_4px_24px_rgba(245,158,11,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 px-5 py-2.5 rounded-xl text-[13px] font-bold text-black flex items-center gap-2.5 shrink-0 ml-4"
      >
        <Icon name="add" className="group-hover:rotate-90 transition-transform duration-300" style={{ fontSize: "18px" }} />
        <span className="hidden sm:inline">New Note</span>
      </button>
    )}
  </header>
);