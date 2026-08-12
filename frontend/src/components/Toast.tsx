import React from "react";
import { useToastStore, type Toast } from "@/store/useToastStore";
import { Icon } from "./Icon";

const STYLES: Record<Toast["type"], string> = {
  info: "border-info/40 bg-info/10 text-info",
  ok: "border-ok/40 bg-ok/10 text-ok",
  err: "border-err/40 bg-err/10 text-err",
  accent: "border-accent/40 bg-accent/10 text-accent",
};
const ICONS: Record<Toast["type"], string> = {
  info: "info",
  ok: "check_circle",
  err: "error",
  accent: "auto_awesome",
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();
  return (
    <div className="fixed top-5 right-5 z-[200] flex flex-col gap-2.5 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => removeToast(t.id)}
          className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-xl border backdrop-blur-md shadow-2xl cursor-pointer anim-slide-in ${STYLES[t.type]}`}
        >
          <Icon name={ICONS[t.type]} className="text-xl" />
          <span className="text-sm font-medium">{t.message}</span>
        </div>
      ))}
    </div>
  );
};