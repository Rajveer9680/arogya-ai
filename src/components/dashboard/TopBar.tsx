import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Bell, Mic, Sparkles, FileText, Calendar as CalIcon, MessageSquare, X, LogOut, User as UserIcon, Settings } from "lucide-react";
import { loadReports, MedicalReport, formatDate } from "@/lib/reportStore";
import { loadEvents, CalendarEvent } from "@/lib/calendarStore";
import { loadConversations, Conversation } from "@/lib/chatStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Profile = {
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  provider: string | null;
};

type ResultGroup = {
  reports: MedicalReport[];
  events: CalendarEvent[];
  chats: Conversation[];
};

export const TopBar = () => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("full_name, email, avatar_url, provider")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) {
        setProfile(data);
      } else {
        setProfile({
          full_name: (user.user_metadata as any)?.full_name || (user.user_metadata as any)?.name || null,
          email: user.email ?? null,
          avatar_url: (user.user_metadata as any)?.avatar_url || (user.user_metadata as any)?.picture || null,
          provider: (user.app_metadata as any)?.provider ?? "email",
        });
      }
    };
    loadProfile();
    const { data: sub } = supabase.auth.onAuthStateChange(() => loadProfile());
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate("/auth");
  };

  const displayName = profile?.full_name || profile?.email?.split("@")[0] || "Account";
  const initials = (displayName || "U")
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();


  const results: ResultGroup = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { reports: [], events: [], chats: [] };
    const reports = loadReports().filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q) ||
        r.findings.some((f) => f.label.toLowerCase().includes(q) || f.value.toLowerCase().includes(q)),
    ).slice(0, 5);
    const events = loadEvents().filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        (e.doctor || "").toLowerCase().includes(q) ||
        (e.location || "").toLowerCase().includes(q) ||
        (e.notes || "").toLowerCase().includes(q),
    ).slice(0, 5);
    const chats = loadConversations().filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.messages.some((m) => m.text.toLowerCase().includes(q)),
    ).slice(0, 5);
    return { reports, events, chats };
  }, [query]);

  const totalCount = results.reports.length + results.events.length + results.chats.length;

  const goAssistant = () => {
    if (query.trim()) {
      sessionStorage.setItem("arogyaai.prefill", query.trim());
    }
    navigate("/assistant");
  };

  return (
    <header className="flex items-center gap-3 mb-6 animate-fade-in">
      {/* Global Search Pill */}
      <div ref={wrapRef} className="flex-1 relative">
        <div className="flex items-center h-12 pl-5 pr-2 rounded-full glass-card shadow-sm border border-border/60 focus-within:ring-2 focus-within:ring-primary/30 transition-all">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => { if (e.key === "Enter") goAssistant(); }}
            placeholder="Ask anything about your health..."
            className="flex-1 h-full bg-transparent px-3 text-sm placeholder:text-muted-foreground focus:outline-none"
          />
          {query && (
            <button
              onClick={() => { setQuery(""); setOpen(false); }}
              className="h-8 w-8 rounded-full grid place-items-center text-muted-foreground hover:bg-secondary transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            className="h-9 w-9 rounded-full grid place-items-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            aria-label="Voice search"
          >
            <Mic className="h-[18px] w-[18px]" />
          </button>
          <button
            onClick={goAssistant}
            className="h-9 w-9 rounded-full grid place-items-center text-primary hover:bg-primary/10 transition-colors"
            aria-label="Ask AI"
          >
            <Sparkles className="h-[18px] w-[18px]" strokeWidth={2.2} />
          </button>
        </div>

        {/* Results dropdown */}
        {open && query.trim() && (
          <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl glass-card shadow-[var(--shadow-elevated)] border border-border/60 overflow-hidden z-50 max-h-[480px] overflow-y-auto">
            {totalCount === 0 ? (
              <div className="p-6 text-center">
                <p className="text-sm text-muted-foreground">No results for "{query}"</p>
                <button
                  onClick={goAssistant}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full gradient-primary text-primary-foreground text-xs font-semibold"
                >
                  <Sparkles className="h-3.5 w-3.5" /> Ask AI Assistant
                </button>
              </div>
            ) : (
              <>
                {results.reports.length > 0 && (
                  <div className="p-2">
                    <p className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Reports</p>
                    {results.reports.map((r) => (
                      <Link
                        key={r.id}
                        to={`/files/${r.id}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-secondary/70 transition-colors"
                      >
                        <div className="h-8 w-8 rounded-lg bg-primary/10 grid place-items-center shrink-0">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{r.name}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{r.type} • {formatDate(r.uploadedAt)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                {results.events.length > 0 && (
                  <div className="p-2 border-t border-border/40">
                    <p className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Calendar</p>
                    {results.events.map((e) => (
                      <Link
                        key={e.id}
                        to="/calendar"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-secondary/70 transition-colors"
                      >
                        <div className="h-8 w-8 rounded-lg bg-accent/10 grid place-items-center shrink-0">
                          <CalIcon className="h-4 w-4 text-accent-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{e.title}</p>
                          <p className="text-[11px] text-muted-foreground truncate capitalize">{e.type} • {e.date}{e.time ? ` • ${e.time}` : ""}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                {results.chats.length > 0 && (
                  <div className="p-2 border-t border-border/40">
                    <p className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Conversations</p>
                    {results.chats.map((c) => (
                      <Link
                        key={c.id}
                        to="/assistant"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-secondary/70 transition-colors"
                      >
                        <div className="h-8 w-8 rounded-lg bg-success/10 grid place-items-center shrink-0">
                          <MessageSquare className="h-4 w-4 text-success" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{c.title}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{c.messages.length} messages</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                <button
                  onClick={goAssistant}
                  className="w-full flex items-center justify-center gap-2 p-3 border-t border-border/40 text-xs font-semibold text-primary hover:bg-primary/5 transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5" /> Ask AI about "{query}"
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Notification pill */}
      <button className="relative h-12 w-12 rounded-full glass-card border border-border/60 grid place-items-center hover:bg-secondary transition-colors shrink-0">
        <Bell className="h-[18px] w-[18px] text-foreground" />
        <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold grid place-items-center ring-2 ring-background">
          3
        </span>
      </button>

      {/* User pill with menu */}
      <div ref={menuRef} className="relative shrink-0">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex items-center gap-3 h-12 pl-1.5 pr-4 rounded-full glass-card border border-border/60 hover:bg-secondary/70 transition-colors"
        >
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt={displayName} className="h-9 w-9 rounded-full object-cover" />
          ) : (
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-orange-400 to-amber-700 grid place-items-center text-white font-semibold text-xs shadow-sm">
              {initials}
            </div>
          )}
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold leading-tight">{displayName}</p>
            <p className="text-[11px] text-muted-foreground leading-tight capitalize">
              {profile?.provider === "google" ? "Google account" : profile?.email || "Member"}
            </p>
          </div>
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl glass-card border border-border/60 shadow-[var(--shadow-elevated)] overflow-hidden z-50">
            <div className="p-4 border-b border-border/40 flex items-center gap-3">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={displayName} className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-700 grid place-items-center text-white font-semibold text-xs">
                  {initials}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{displayName}</p>
                <p className="text-[11px] text-muted-foreground truncate">{profile?.email}</p>
              </div>
            </div>
            <div className="p-2">
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-secondary/70 transition-colors">
                <UserIcon className="h-4 w-4 text-muted-foreground" /> Profile
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-secondary/70 transition-colors">
                <Settings className="h-4 w-4 text-muted-foreground" /> Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          </div>
        )}
      </div>

    </header>
  );
};
