import { LayoutDashboard, MessageSquare, History, FileText, Settings, Activity } from "lucide-react";
import { useState } from "react";

const items = [
  { title: "Dashboard", icon: LayoutDashboard },
  { title: "AI Chat", icon: MessageSquare },
  { title: "History", icon: History },
  { title: "Reports", icon: FileText },
  { title: "Settings", icon: Settings },
];

export const Sidebar = () => {
  const [active, setActive] = useState("Dashboard");
  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 p-5 flex flex-col gap-8 glass-panel border-r border-border/50">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl gradient-primary grid place-items-center shadow-[var(--shadow-glow)]">
          <Activity className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="font-display font-bold text-lg leading-none">ArogyaAI</h1>
          <p className="text-[10px] text-muted-foreground tracking-widest uppercase mt-1">Smart Health</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1.5">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold px-3 mb-2">Menu</p>
        {items.map((item) => {
          const isActive = active === item.title;
          return (
            <button
              key={item.title}
              onClick={() => setActive(item.title)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-[var(--transition-smooth)] group relative ${
                isActive
                  ? "gradient-primary text-primary-foreground shadow-[var(--shadow-card)]"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon className="h-[18px] w-[18px]" />
              {item.title}
              {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-foreground/80" />}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto p-4 rounded-2xl glass-card text-center">
        <div className="h-10 w-10 mx-auto rounded-full gradient-primary grid place-items-center mb-2">
          <Activity className="h-5 w-5 text-primary-foreground" />
        </div>
        <p className="text-xs font-semibold">Upgrade to Pro</p>
        <p className="text-[10px] text-muted-foreground mt-1">Unlock advanced AI insights</p>
        <button className="mt-3 w-full text-xs gradient-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
          Upgrade
        </button>
      </div>
    </aside>
  );
};
