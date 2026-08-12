import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Icon } from "@/components/Icon";
import { useToastStore } from "@/store/useToastStore";
import { CATEGORY_COLORS, CATEGORY_ICONS, type PredictionResult, type ModelInfo, type Category } from "@/types";
import * as api from "@/services/api";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const getCatColor = (cat: string): string => (CATEGORY_COLORS as Record<string, string>)[cat] || "#666";

export const MLLab: React.FC<{ onMenuToggle: () => void }> = ({ onMenuToggle }) => {
  const [info, setInfo] = useState<ModelInfo | null>(null);
  const [text, setText] = useState("Schedule a meeting with the client about the project deadline");
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [retraining, setRetraining] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const { addToast } = useToastStore();

  useEffect(() => {
    setLoading(true);
    Promise.all([api.fetchModelInfo(), api.predictText(text)])
      .then(([m, p]) => { setInfo(m); setResult(p); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const runPred = async () => {
    if (!text.trim()) return;
    setPredicting(true);
    try { setResult(await api.predictText(text)); } catch { addToast("Prediction failed", "err"); }
    finally { setPredicting(false); }
  };

  const handleRetrain = async () => {
    setRetraining(true);
    try { const r = await api.retrainModel(); setInfo(r.info); addToast("Model retrained successfully", "ok"); } catch { addToast("Retrain failed", "err"); }
    finally { setRetraining(false); }
  };

  const lossData = info?.lossCurve ? {
    labels: info.lossCurve.map((_, i) => i + 1),
    datasets: [{ label: "Training Loss", data: info.lossCurve, borderColor: "#ef4444", backgroundColor: "rgba(239,68,68,0.08)", fill: true, tension: 0.4, pointRadius: 0, borderWidth: 2 }],
  } : null;

  const summaryItems: [string, string, string][] = [
    ["Architecture", info?.architecture || "--", "#fff"],
    ["Vocabulary", `${info?.vocabularySize || "--"} words`, "#fff"],
    ["Samples", `${info?.trainingSamples || "--"}`, "#fff"],
    ["Iterations", `${info?.nIter || "--"}`, "#fff"],
    ["Val Score", info?.bestValidationScore ? `${(info.bestValidationScore * 100).toFixed(1)}%` : "--", "#10b981"],
    ["Status", info?.trained ? "Ready" : "Not Trained", info?.trained ? "#10b981" : "#ef4444"],
  ];

  if (loading) {
    return (
      <>
        <Header title="ML Lab" subtitle="Neural network training & inference" onMenuToggle={onMenuToggle} showNewButton={false} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1,2].map(i => (
              <div key={i} className="bg-card rounded-2xl border border-card-b p-6">
                <div className="skeleton h-4 w-32 rounded mb-5" />
                <div className="grid grid-cols-2 gap-3">{[1,2,3,4].map(j => <div key={j} className="bg-bg-s rounded-xl p-3"><div className="skeleton h-3 w-16 rounded mb-2" /><div className="skeleton h-6 w-20 rounded" /></div>)}</div>
              </div>
            ))}
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="ML Lab" subtitle="Neural network training & inference" onMenuToggle={onMenuToggle} showNewButton={false} />
      <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-card rounded-2xl border border-card-b p-6 anim-fade-up">
              <h3 className="text-[13px] font-semibold text-neutral-300 mb-5 tracking-tight">Model Summary</h3>
              <div className="grid grid-cols-2 gap-3">
                {summaryItems.map(([label, value, color], i) => (
                  <div key={label} className="bg-bg-s rounded-xl p-3.5 anim-fade-up" style={{ animationDelay: `${i * 0.04}s` }}>
                    <p className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold">{label}</p>
                    <p className="text-sm font-bold mt-1" style={{ color }}>{value}</p>
                  </div>
                ))}
              </div>
              <button onClick={handleRetrain} disabled={retraining} className="mt-5 w-full bg-gradient-to-r from-accent to-accent-h hover:shadow-[0_4px_24px_rgba(245,158,11,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all px-4 py-3 rounded-xl text-sm font-semibold text-black disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2">
                <Icon name={retraining ? "hourglass_empty" : "refresh"} className="text-base" />{retraining ? "Retraining..." : "Retrain Model"}
              </button>
            </div>
            {lossData && (
              <div className="bg-card rounded-2xl border border-card-b p-6 anim-fade-up delay-2">
                <h3 className="text-[13px] font-semibold text-neutral-300 mb-5 tracking-tight">Training Loss Curve</h3>
                <div className="h-48">
                  <Line data={lossData} options={{ responsive: true, maintainAspectRatio: false, scales: { x: { display: true, grid: { color: "#1e1e1e" }, ticks: { color: "#525252", font: { size: 9 }, maxTicksLimit: 10 } }, y: { grid: { color: "#1e1e1e" }, ticks: { color: "#ef4444", font: { size: 9 } } } }, plugins: { legend: { display: false } }, interaction: { mode: "index", intersect: false } }} />
                </div>
              </div>
            )}
          </div>

          <div className="bg-card rounded-2xl border border-card-b p-6 anim-fade-up delay-1">
            <h3 className="text-[13px] font-semibold text-neutral-300 mb-5 tracking-tight">Live Prediction</h3>
            <textarea value={text} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)} rows={3} className="w-full px-4 py-3 bg-bg-s border border-card-b rounded-xl text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all resize-none mb-4 font-mono text-xs leading-relaxed" placeholder="Type text to classify..." />
            <button onClick={runPred} disabled={predicting} className="border border-card-b px-4 py-2.5 rounded-xl text-sm text-neutral-300 hover:border-accent/50 hover:text-accent hover:bg-accent/5 transition-all mb-5 flex items-center gap-2 disabled:opacity-40">
              <Icon name={predicting ? "hourglass_empty" : "auto_awesome"} className="text-sm" />{predicting ? "Classifying..." : "Classify"}
            </button>
            {result && (
              <div className="space-y-3 anim-fade-up" style={{ animationDuration: "0.3s" }}>
                <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: `${getCatColor(result.category)}08`, border: `1px solid ${getCatColor(result.category)}20` }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${getCatColor(result.category)}15`, color: getCatColor(result.category) }}>
                    <Icon name={CATEGORY_ICONS[result.category as Category]} className="text-2xl" />
                  </div>
                  <div>
                    <p className="text-lg font-bold" style={{ color: getCatColor(result.category) }}>{result.category}</p>
                    <p className="text-xs text-neutral-500">{(result.confidence * 100).toFixed(1)}% confidence · Priority: <span className="font-medium text-neutral-400">{result.priority}</span></p>
                  </div>
                </div>
                {Object.entries(result.probabilities)
                  .sort(([, a], [, b]) => b - a)
                  .map(([cat, prob]) => (
                    <div key={cat} className="flex items-center gap-3">
                      <span className="text-[10px] w-16 text-neutral-500 font-medium">{cat}</span>
                      <div className="flex-1 h-2.5 bg-bg-s rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${prob * 100}%`, background: getCatColor(cat) }} />
                      </div>
                      <span className="text-[10px] text-neutral-600 w-10 text-right font-mono">{(prob * 100).toFixed(1)}%</span>
                    </div>
                  ))
                }
                {result.tags.length > 0 && (
                  <div className="flex gap-1.5 pt-2">
                    <span className="text-[10px] text-neutral-600 leading-6">Tags:</span>
                    {result.tags.map(t => <span key={t} className="text-[10px] px-2.5 py-1 rounded-lg bg-accent/[0.08] text-accent-l/80 border border-accent/15">{t}</span>)}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};