import { Sparkles, Send, AlertCircle, CheckCircle2, Brain } from "lucide-react";
import { UploadReport } from "./UploadReport";

const insights = [
  {
    severity: "Mild",
    title: "Possible Vitamin D Deficiency",
    advice: "Increase sun exposure & consider supplements.",
    color: "warning",
  },
  {
    severity: "Normal",
    title: "Cardiovascular Health Stable",
    advice: "Maintain current exercise routine.",
    color: "success",
  },
];

const messages = [
  { from: "ai", text: "Hi Aarav! How are you feeling today? Describe any symptoms." },
  { from: "user", text: "I've had a mild headache and feel tired since morning." },
  { from: "ai", text: "Got it. Could be dehydration or low sleep. Let me analyze your recent vitals…" },
];

export const RightPanel = () => (
  <div className="flex flex-col gap-5 h-full">
    {/* AI Chat */}
    <div className="glass-card rounded-3xl p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl gradient-primary grid place-items-center shadow-[var(--shadow-glow)]">
            <Brain className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm">AI Health Assistant</h3>
            <p className="text-[10px] text-success flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Online
            </p>
          </div>
        </div>
        <Sparkles className="h-4 w-4 text-primary" />
      </div>

      <div className="space-y-2.5 max-h-44 overflow-y-auto pr-1 mb-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${
                m.from === "user"
                  ? "gradient-primary text-primary-foreground rounded-br-sm"
                  : "bg-secondary text-foreground rounded-bl-sm"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Describe your symptoms…"
          className="w-full h-10 pl-3.5 pr-11 rounded-xl bg-secondary/70 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <button className="absolute right-1.5 top-1.5 h-7 w-7 rounded-lg gradient-primary grid place-items-center text-primary-foreground hover:scale-105 transition-transform">
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>

    {/* AI Insights */}
    <div className="glass-card rounded-3xl p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold text-sm">AI Insights</h3>
        <span className="text-[10px] text-muted-foreground">Updated 2m ago</span>
      </div>
      <div className="space-y-2.5">
        {insights.map((ins) => (
          <div key={ins.title} className="p-3 rounded-2xl bg-secondary/60 hover:bg-secondary transition-colors cursor-pointer group">
            <div className="flex items-start gap-2.5">
              {ins.color === "success" ? (
                <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold truncate">{ins.title}</p>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ${
                      ins.color === "success" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
                    }`}
                  >
                    {ins.severity}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{ins.advice}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Upload */}
    <UploadReport />
  </div>
);
