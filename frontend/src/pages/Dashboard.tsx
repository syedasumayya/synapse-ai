import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Icon } from "@/components/Icon";
import { CATEGORY_COLORS, CATEGORY_ICONS, type Note, type DashboardStats, type Category } from "@/types";
import * as api from "@/services/api";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);

interface Props { onNewNote: () => void; onMenuToggle: () => void; }

export const Dashboard: React.FC<Props> = ({ onNewNote, onMenuToggle }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.fetchStats(), api.fetchNotes({ limit: 5 })])
      .then(([s, r]) => { setStats(s); setRecent(r); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const getCatColor = (cat: string): string => {
    return (CATEGORY_COLORS as Record<string, string>)[cat] || "#666";
  };

  if (loading) {
    return (
      <>
        <Header title="Dashboard" subtitle="Real-time analytics" onNewNote={onNewNote} onMenuToggle={onMenuToggle} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-card rounded-2xl p-5 border border-card-b">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-bg-s" />
                  <div className="skeleton h-3 w-14 rounded" />
                </div>
                <div className="skeleton h-8 w-20 rounded" />
              </div>
            ))}
          </div>
        </main>
      </>
    );
  }

  const acc = stats?.modelInfo?.bestValidationScore
    ? (stats.modelInfo.bestValidationScore * 100).toFixed(1)
    : "--";
  const totalNotes = stats?.totalNotes ?? 0;
  const aiNotes = stats?.aiClassified ?? 0;
  const activeCats = stats
    ? Object.values(stats.categoryDistribution).filter(v => v > 0).length
    : 0;

  const catKeys = stats ? Object.keys(stats.categoryDistribution) : [];
  const catValues = stats ? Object.values(stats.categoryDistribution) : [];
  const catBgColors = catKeys.map(c => getCatColor(c));

  return (
    <>
      <Header title="Dashboard" subtitle="Real-time analytics & AI insights" onNewNote={onNewNote} onMenuToggle={onMenuToggle} />
      <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: "edit_note", label: "Total Notes", value: totalNotes, color: "#f59e0b" },
            { icon: "auto_awesome", label: "AI Classified", value: aiNotes, color: "#8b5cf6" },
            { icon: "trending_up", label: "Accuracy", value: `${acc}%`, color: "#10b981" },
            { icon: "category", label: "Categories", value: `${activeCats} / 6`, color: "#06b6d4" },
          ].map((s, i) => (
            <div
              key={s.label}
              className="card-glow bg-card rounded-2xl p-5 border border-card-b hover:border-card-h transition-all duration-300 anim-fade-up"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${s.color}14` }}>
                  <Icon name={s.icon} className="text-xl" style={{ color: s.color }} />
                </div>
                <span className="text-[9px] text-neutral-600 uppercase font-bold" style={{ letterSpacing: "0.14em" }}>{s.label}</span>
              </div>
              <p className="text-[26px] font-extrabold tracking-tight leading-none" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-card rounded-2xl border border-card-b p-6 anim-fade-up delay-3">
            <h3 className="text-[13px] font-semibold text-neutral-300 mb-5 tracking-tight">Category Distribution</h3>
            {totalNotes === 0 ? (
              <div className="h-56 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-bg-s border border-card-b flex items-center justify-center mb-3">
                  <Icon name="pie_chart" className="text-2xl text-neutral-700" />
                </div>
                <p className="text-xs text-neutral-600">No data yet</p>
                <p className="text-[10px] text-neutral-700 mt-0.5">Create notes to see distribution</p>
              </div>
            ) : (
              <div className="h-56 flex items-center justify-center">
                <Doughnut
                  data={{
                    labels: catKeys,
                    datasets: [{
                      data: catValues,
                      backgroundColor: catBgColors,
                      borderWidth: 0,
                      hoverOffset: 10,
                      spacing: 3,
                    }],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "70%",
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: { color: "#737373", font: { size: 10, family: "Space Grotesk", weight: 500  }, padding: 16, usePointStyle: true, pointStyleWidth: 8 },
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>

          <div className="lg:col-span-2 bg-card rounded-2xl border border-card-b p-6 anim-fade-up delay-4">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[13px] font-semibold text-neutral-300 tracking-tight">Recent Notes</h3>
              {recent.length > 0 && <span className="text-[10px] text-neutral-600 font-medium">{totalNotes} total</span>}
            </div>
            {recent.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="w-16 h-16 rounded-2xl bg-bg-s border border-card-b flex items-center justify-center mb-4">
                  <Icon name="note_add" className="text-3xl text-neutral-700" />
                </div>
                <p className="text-sm text-neutral-500 font-medium">No notes yet</p>
                <p className="text-xs text-neutral-700 mt-1 mb-5">Create your first note to get started</p>
                <button onClick={onNewNote} className="bg-gradient-to-r from-accent to-accent-h hover:shadow-[0_4px_20px_rgba(245,158,11,0.3)] hover:-translate-y-0.5 transition-all px-5 py-2.5 rounded-xl text-sm font-semibold text-black flex items-center gap-2">
                  <Icon name="add" className="text-base" /> Create Note
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {recent.map((n, i) => (
                  <div key={n.id} className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-bg-s/40 hover:bg-bg-t/60 transition-colors anim-fade-up" style={{ animationDelay: `${(i + 4) * 0.05}s` }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${getCatColor(n.category)}12`, color: getCatColor(n.category) }}>
                      <Icon name={CATEGORY_ICONS[n.category as Category]} className="text-base" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-neutral-200 truncate">{n.title}</p>
                      <p className="text-[11px] text-neutral-600 truncate mt-0.5">{n.content}</p>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded-lg border shrink-0 font-semibold" style={{ color: getCatColor(n.category), borderColor: `${getCatColor(n.category)}25`, background: `${getCatColor(n.category)}08` }}>
                      {n.category}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-card-b p-6 anim-fade-up delay-6">
          <h3 className="text-[13px] font-semibold text-neutral-300 mb-4 tracking-tight">AI Classification Pipeline</h3>
          <div className="flex flex-wrap items-center gap-2">
            {["Input Text", "Bag-of-Words (60)", "Neural Net (60→32→16→6)", "Softmax", "Category + Priority + Tags"].map((step, i) => (
              <React.Fragment key={step}>
                <div className="px-4 py-2.5 rounded-xl bg-bg-s border border-card-b text-[11px] font-medium text-neutral-400">{step}</div>
                {i < 4 && <Icon name="arrow_forward" className="text-accent/30" style={{ fontSize: "16px" }} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};