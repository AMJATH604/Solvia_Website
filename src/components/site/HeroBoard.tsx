"use client";

import { useEffect, useState } from "react";

type Ticket = { problem?: string; solution?: string; tag?: string };

function Check({ solved }: { solved: boolean }) {
  return (
    <span
      className={`relative inline-flex size-7 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
        solved ? "border-brand bg-brand" : "border-dashed border-ink/25 bg-white"
      }`}
    >
      {solved && (
        <svg viewBox="0 0 24 24" className="draw-check size-4" aria-hidden="true">
          <path d="M5 12.5 L10 17 L19 7" pathLength={1} fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

export function HeroBoard({ tickets }: { tickets: Ticket[] }) {
  const rows = tickets.filter((t) => t.problem).slice(0, 5);
  const [solved, setSolved] = useState(0);

  useEffect(() => {
    if (!rows.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSolved(rows.length);
      return;
    }
    const delay = solved >= rows.length ? 3800 : solved === 0 ? 900 : 1500;
    const t = setTimeout(() => setSolved((s) => (s >= rows.length ? 0 : s + 1)), delay);
    return () => clearTimeout(t);
  }, [solved, rows.length]);

  if (!rows.length) return null;
  const pct = Math.round((Math.min(solved, rows.length) / rows.length) * 100);

  return (
    <div className="relative">
      <div className="glow pointer-events-none absolute -inset-10 opacity-40" />
      <div className="relative rounded-[28px] border border-line bg-white/90 p-2 shadow-[0_40px_100px_-40px_rgba(12,26,20,0.45)] backdrop-blur">
        <div className="rounded-[22px] border border-line bg-white">
          {/* window chrome */}
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-[#FF5F57]" />
              <span className="size-2.5 rounded-full bg-[#FEBC2E]" />
              <span className="size-2.5 rounded-full bg-[#28C840]" />
            </div>
            <p className="text-[13px] font-medium text-ink/60">Problem board</p>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand">
              <span className="pulse-ring size-1.5 rounded-full bg-brand" /> Live
            </span>
          </div>

          <ul className="divide-y divide-line" aria-live="off">
            {rows.map((t, i) => {
              const done = i < solved;
              return (
                <li key={i} className="flex gap-3.5 px-5 py-4">
                  <Check solved={done} />
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-[15px] leading-snug transition-colors duration-500 ${
                        done ? "text-ink/40 line-through decoration-ink/20" : "text-ink"
                      }`}
                    >
                      {t.problem}
                    </p>
                    <div
                      className={`grid transition-all duration-500 ${done ? "mt-1.5 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                    >
                      <p className="overflow-hidden text-[15px] font-medium leading-snug text-brand">{t.solution}</p>
                    </div>
                  </div>
                  {t.tag && (
                    <span className="h-fit shrink-0 rounded-full bg-surface px-2.5 py-1 text-xs text-ink/60">{t.tag}</span>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-4 border-t border-line px-5 py-4">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface">
              <div className="h-full rounded-full bg-brand transition-all duration-700" style={{ width: `${pct}%` }} />
            </div>
            <p className="text-[13px] tabular-nums text-ink/60">
              {Math.min(solved, rows.length)}/{rows.length} solved
            </p>
          </div>
        </div>
      </div>

      <div className="float absolute -bottom-6 -left-4 hidden items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 shadow-[0_20px_50px_-20px_rgba(12,26,20,0.35)] sm:flex">
        <svg viewBox="0 0 100 100" className="size-9" aria-hidden="true">
          <rect width="100" height="100" rx="26" fill="var(--accent)" />
          <path d="M29 52 L44 67 L72 33" fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div>
          <p className="text-sm font-semibold text-ink">Problem solved</p>
          <p className="text-xs text-muted">Shipped to production</p>
        </div>
      </div>
    </div>
  );
}
