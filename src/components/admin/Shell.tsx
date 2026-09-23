"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Briefcase,
  Building2,
  Compass,
  DatabaseBackup,
  ExternalLink,
  HelpCircle,
  Home,
  Image as ImageIcon,
  Inbox,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  PanelsTopLeft,
  Plus,
  Quote,
  Rocket,
  Search,
  Settings,
  ShieldCheck,
  UserCircle,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { Wordmark } from "@/components/brand/Logo";

const ICONS: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  inbox: Inbox,
  home: Home,
  building: Building2,
  panels: PanelsTopLeft,
  layers: Layers,
  compass: Compass,
  briefcase: Briefcase,
  newspaper: Newspaper,
  rocket: Rocket,
  users: Users,
  quote: Quote,
  help: HelpCircle,
  image: ImageIcon,
  settings: Settings,
  shield: ShieldCheck,
  backup: DatabaseBackup,
  account: UserCircle,
};

export type NavItem = { href: string; label: string; icon: string; badge?: number };
export type NavGroup = { label: string; items: NavItem[] };
export type Command = { href: string; label: string; group: string; icon?: string };

function Sidebar({
  groups,
  user,
  logout,
  onNavigate,
}: {
  groups: NavGroup[];
  user: { name: string; email: string };
  logout: () => Promise<void>;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`));
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 px-5">
        <Link href="/admin" onClick={onNavigate} className="flex items-center gap-2.5">
          <Wordmark className="text-[24px]" />
          <span className="rounded-md bg-forest px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-white uppercase">Admin</span>
        </Link>
      </div>
      <nav aria-label="Admin" className="flex-1 overflow-y-auto px-3 pb-6">
        {groups.map((g) => (
          <div key={g.label} className="mt-5 first:mt-2">
            <p className="px-3 pb-1.5 text-[11px] font-medium tracking-[0.08em] text-ink/40 uppercase">{g.label}</p>
            <ul className="space-y-0.5">
              {g.items.map((item) => {
                const Icon = ICONS[item.icon] || Layers;
                const on = active(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={on ? "page" : undefined}
                      className={`group flex h-9 items-center gap-2.5 rounded-lg px-3 transition ${
                        on ? "bg-forest text-white" : "text-ink/70 hover:bg-ink/[0.05] hover:text-ink"
                      }`}
                    >
                      <Icon className={`size-[17px] ${on ? "text-mint" : "text-ink/45 group-hover:text-ink/70"}`} strokeWidth={1.8} />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge ? (
                        <span className={`rounded-full px-1.5 text-[11px] font-semibold ${on ? "bg-mint text-forest" : "bg-brand text-white"}`}>
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-line p-3">
        <div className="flex items-center gap-3 rounded-xl p-2">
          <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-brand text-[13px] font-semibold text-white">
            {user.name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{user.name}</p>
            <p className="truncate text-[12px] text-muted">{user.email}</p>
          </div>
          <form action={logout}>
            <button type="submit" className="inline-flex size-8 items-center justify-center rounded-lg text-ink/50 hover:bg-ink/[0.05] hover:text-ink" aria-label="Sign out" title="Sign out">
              <LogOut className="size-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function CommandPalette({ commands, open, onClose }: { commands: Command[]; open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? commands.filter((c) => `${c.label} ${c.group}`.toLowerCase().includes(s)) : commands;
  }, [q, commands]);

  useEffect(() => {
    if (open) {
      setQ("");
      setIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  if (!open) return null;

  const go = (c?: Command) => {
    if (!c) return;
    onClose();
    router.push(c.href);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-forest/30 px-4 pt-[12vh] backdrop-blur-sm" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-white shadow-[0_40px_120px_-30px_rgba(12,26,20,0.5)]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search className="size-4 text-ink/40" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setIndex(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setIndex((i) => Math.min(i + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setIndex((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter") {
                e.preventDefault();
                go(results[index]);
              } else if (e.key === "Escape") onClose();
            }}
            placeholder="Jump to a page or create something…"
            className="h-14 flex-1 bg-transparent text-[15px] outline-none placeholder:text-ink/35"
            aria-label="Search commands"
          />
          <kbd className="rounded-md border border-line px-1.5 py-0.5 text-[11px] text-ink/50">Esc</kbd>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto p-2" role="listbox">
          {results.length === 0 && <li className="px-3 py-8 text-center text-muted">No matches</li>}
          {results.map((c, i) => {
            const Icon = c.label.startsWith("New ") ? Plus : ICONS[c.icon || ""] || Layers;
            return (
              <li key={`${c.href}-${c.label}`} role="option" aria-selected={i === index}>
                <button
                  type="button"
                  onMouseEnter={() => setIndex(i)}
                  onClick={() => go(c)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left ${i === index ? "bg-surface" : ""}`}
                >
                  <Icon className="size-4 text-ink/50" />
                  <span className="flex-1">{c.label}</span>
                  <span className="text-[12px] text-ink/40">{c.group}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export function Shell({
  groups,
  commands,
  user,
  logout,
  children,
}: {
  groups: NavGroup[];
  commands: Command[];
  user: { name: string; email: string };
  logout: () => Promise<void>;
  children: React.ReactNode;
}) {
  const [mobile, setMobile] = useState(false);
  const [palette, setPalette] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMobile(false), [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-dvh lg:pl-[260px]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] border-r border-line bg-white lg:block">
        <Sidebar groups={groups} user={user} logout={logout} />
      </aside>

      {mobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-forest/30 backdrop-blur-sm" onClick={() => setMobile(false)} />
          <aside className="absolute inset-y-0 left-0 w-[280px] bg-white shadow-2xl">
            <button
              type="button"
              onClick={() => setMobile(false)}
              className="absolute top-3 right-3 inline-flex size-10 items-center justify-center rounded-lg hover:bg-surface"
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>
            <Sidebar groups={groups} user={user} logout={logout} onNavigate={() => setMobile(false)} />
          </aside>
        </div>
      )}

      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-[#F7F9F8]/85 px-4 backdrop-blur-xl md:px-8">
        <button
          type="button"
          onClick={() => setMobile(true)}
          className="inline-flex size-10 items-center justify-center rounded-lg hover:bg-ink/[0.05] lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => setPalette(true)}
          className="flex h-10 w-full max-w-md items-center gap-2.5 rounded-xl border border-line bg-white px-3.5 text-left text-ink/45 transition hover:border-ink/20"
        >
          <Search className="size-4" />
          <span className="flex-1 truncate">Search or jump to…</span>
          <kbd className="hidden rounded-md border border-line px-1.5 py-0.5 text-[11px] sm:inline">⌘K</kbd>
        </button>
        <div className="ml-auto flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-3.5 font-medium ring-1 ring-line transition hover:bg-surface"
          >
            <ExternalLink className="size-4" />
            <span className="hidden sm:inline">View site</span>
          </a>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1180px] px-4 py-8 md:px-8 md:py-10">{children}</main>

      <CommandPalette commands={commands} open={palette} onClose={() => setPalette(false)} />
    </div>
  );
}
