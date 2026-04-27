import { Search, Bell, Plus } from "lucide-react";

export const TopBar = () => (
  <header className="flex items-center gap-4 mb-6 animate-fade-in">
    <div className="flex-1 relative max-w-xl">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        placeholder="Search symptoms, reports, conditions..."
        className="w-full h-11 pl-11 pr-4 rounded-xl glass-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
      />
    </div>

    <button className="hidden md:flex items-center gap-2 h-11 px-5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-glow)] transition-all hover:-translate-y-0.5">
      <Plus className="h-4 w-4" strokeWidth={2.5} />
      New Analysis
    </button>

    <button className="relative h-11 w-11 rounded-xl glass-card grid place-items-center hover:bg-secondary transition-colors">
      <Bell className="h-[18px] w-[18px] text-foreground" />
      <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
    </button>

    <div className="flex items-center gap-3 pl-3 border-l border-border">
      <div className="text-right hidden sm:block">
        <p className="text-sm font-semibold leading-tight">Aarav Sharma</p>
        <p className="text-xs text-muted-foreground">Premium Member</p>
      </div>
      <div className="h-11 w-11 rounded-xl gradient-primary grid place-items-center text-primary-foreground font-semibold text-sm shadow-[var(--shadow-card)]">
        AS
      </div>
    </div>
  </header>
);
