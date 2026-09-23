"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { Badge, inputCls, timeAgo } from "./ui";

type Row = {
  id: string;
  title: string;
  subtitle: string;
  published: boolean;
  updatedAt: string;
  date: string;
  href: string;
  publicHref: string;
  actions: React.ReactNode;
};

export function CollectionTable({ rows, sortLabel }: { rows: Row[]; sortLabel: string }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const shown = useMemo(
    () =>
      rows.filter(
        (r) =>
          (filter === "all" || (filter === "published") === r.published) &&
          `${r.title} ${r.subtitle}`.toLowerCase().includes(q.trim().toLowerCase()),
      ),
    [rows, q, filter],
  );
  const count = (f: typeof filter) => (f === "all" ? rows.length : rows.filter((r) => (f === "published") === r.published).length);

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white">
      <div className="flex flex-col gap-3 border-b border-line p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-xl bg-surface p-1">
          {(["all", "published", "draft"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-[13px] capitalize ${filter === f ? "bg-white font-medium shadow-sm" : "text-muted hover:text-ink"}`}
            >
              {f === "draft" ? "Drafts" : f} <span className="text-ink/40">{count(f)}</span>
            </button>
          ))}
        </div>
        <label className="relative sm:w-64">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink/35" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className={`${inputCls} h-9 pl-9`} aria-label="Search" />
        </label>
      </div>
      <table className="w-full">
        <thead className="hidden text-left text-[12px] font-medium tracking-wide text-ink/45 uppercase md:table-header-group">
          <tr className="border-b border-line">
            <th className="px-5 py-2.5 font-medium">Title</th>
            <th className="w-28 px-3 py-2.5 font-medium">Status</th>
            <th className="w-32 px-3 py-2.5 font-medium">{sortLabel}</th>
            <th className="w-48 px-3 py-2.5" />
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {shown.map((r) => (
            <tr key={r.id} className="group flex flex-col gap-2 px-4 py-3 hover:bg-surface/50 md:table-row md:p-0">
              <td className="md:px-5 md:py-3.5">
                <Link href={r.href} className="block">
                  <span className="font-medium group-hover:text-brand">{r.title}</span>
                  {r.subtitle && <span className="mt-0.5 line-clamp-1 block text-[13px] text-muted">{r.subtitle}</span>}
                </Link>
              </td>
              <td className="md:px-3">
                <span className="inline-flex items-center gap-2">
                  {r.published ? <Badge tone="green">● Live</Badge> : <Badge>Draft</Badge>}
                  {r.publicHref && (
                    <a href={r.publicHref} target="_blank" rel="noopener noreferrer" className="text-ink/35 hover:text-brand" title="View on site" aria-label="View on site">
                      <ExternalLink className="size-3.5" />
                    </a>
                  )}
                </span>
              </td>
              <td className="text-[13px] text-muted md:px-3">{r.date || timeAgo(r.updatedAt)}</td>
              <td className="md:px-3">{r.actions}</td>
            </tr>
          ))}
          {shown.length === 0 && (
            <tr>
              <td colSpan={4} className="px-5 py-10 text-center text-muted">
                Nothing matches.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
