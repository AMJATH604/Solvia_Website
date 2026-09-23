import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Inbox, Plus } from "lucide-react";
import { Badge, btn, Card, timeAgo } from "@/components/admin/ui";
import { requireUser } from "@/lib/auth";
import { COLLECTIONS } from "@/lib/schema";
import { readDb } from "@/lib/store";

export const metadata: Metadata = { title: "Dashboard" };

const STATUS_TONE = { new: "green", open: "blue", replied: "gray", archived: "gray" } as const;

export default async function Dashboard() {
  const user = await requireUser();
  const db = await readDb();
  const s = db.singletons;
  const monthAgo = Date.now() - 30 * 86400_000;
  const newCount = db.enquiries.filter((e) => e.status === "new").length;
  const monthCount = db.enquiries.filter((e) => new Date(e.createdAt).getTime() > monthAgo).length;
  const liveItems = COLLECTIONS.reduce((n, c) => n + (db.collections[c.key] || []).filter((i) => i.published).length, 0);
  const openRoles = (db.collections.careers || []).filter((i) => i.published).length;
  const work = db.collections.work || [];

  const checklist = [
    { done: Boolean(s.settings?.phone || s.settings?.address), label: "Add your phone number and office address", href: "/admin/content/settings" },
    {
      done: ["linkedin", "x", "github", "instagram", "youtube", "facebook"].some((k) => s.settings?.[k]),
      label: "Link your social profiles",
      href: "/admin/content/settings",
    },
    { done: Boolean(s.home?._updatedAt), label: "Review home page copy and stats", href: "/admin/content/home" },
    {
      done: work.length > 0 && work.every((w) => w.updatedAt !== w.createdAt),
      label: "Replace the sample case studies with real projects",
      href: "/admin/collections/work",
    },
    { done: (db.collections.team || []).some((t) => t.published), label: "Add your team", href: "/admin/collections/team" },
    { done: (db.collections.testimonials || []).some((t) => t.published), label: "Publish a client testimonial", href: "/admin/collections/testimonials" },
    { done: Boolean(s.about?._updatedAt), label: "Tell your story on the Company page", href: "/admin/content/about" },
    { done: Boolean(process.env.SITE_URL), label: "Set SITE_URL for SEO and sharing", href: "/admin/backup#deploy" },
  ];
  const done = checklist.filter((c) => c.done).length;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const kpis = [
    { label: "New enquiries", value: newCount, href: "/admin/enquiries", accent: newCount > 0 },
    { label: "Enquiries · 30 days", value: monthCount, href: "/admin/enquiries" },
    { label: "Live content items", value: liveItems, href: "/admin/collections/services" },
    { label: "Open roles", value: openRoles, href: "/admin/collections/careers" },
  ];

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-muted">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p>
          <h1 className="mt-1 text-[30px] font-semibold tracking-tight">
            {greeting}, {user.name.split(" ")[0]}
          </h1>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/collections/insights/new" className={btn("secondary")}>
            <Plus className="size-4" /> New article
          </Link>
          <Link href="/admin/collections/work/new" className={btn("dark")}>
            <Plus className="size-4" /> New case study
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k) => (
          <Link
            key={k.label}
            href={k.href}
            className={`group rounded-2xl border p-5 transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-24px_rgba(12,26,20,0.35)] ${
              k.accent ? "border-transparent bg-forest text-white" : "border-line bg-white"
            }`}
          >
            <p className={`text-[13px] ${k.accent ? "text-white/60" : "text-muted"}`}>{k.label}</p>
            <div className="mt-3 flex items-end justify-between">
              <p className="text-[34px] leading-none font-semibold tracking-tight tabular-nums">{k.value}</p>
              <ArrowUpRight className={`size-4 ${k.accent ? "text-mint" : "text-ink/30 group-hover:text-brand"}`} />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-semibold">Recent enquiries</h2>
            <Link href="/admin/enquiries" className="inline-flex items-center gap-1 text-[13px] font-medium text-brand">
              View all <ArrowRight className="size-3.5" />
            </Link>
          </div>
          {db.enquiries.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-14 text-center">
              <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-surface">
                <Inbox className="size-5 text-ink/40" />
              </span>
              <p className="mt-3 font-medium">No enquiries yet</p>
              <p className="mt-1 max-w-xs text-muted">Messages sent through the website contact form land here.</p>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {db.enquiries.slice(0, 6).map((e) => (
                <li key={e.id}>
                  <Link href={`/admin/enquiries/${e.id}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface/50">
                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[13px] font-semibold text-brand">
                      {e.name.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate">
                        <span className={e.status === "new" ? "font-semibold" : "font-medium"}>{e.name}</span>
                        {e.company && <span className="text-muted"> · {e.company}</span>}
                      </p>
                      <p className="truncate text-[13px] text-muted">{e.message}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <Badge tone={STATUS_TONE[e.status]}>{e.status}</Badge>
                      <span className="text-[12px] text-ink/40">{timeAgo(e.createdAt)}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Launch checklist</h2>
            <span className="text-[13px] text-muted tabular-nums">
              {done}/{checklist.length}
            </span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface">
            <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${(done / checklist.length) * 100}%` }} />
          </div>
          <ul className="mt-4 space-y-1">
            {checklist.map((c) => (
              <li key={c.label}>
                <Link href={c.href} className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-surface/70">
                  <span
                    className={`inline-flex size-5 shrink-0 items-center justify-center rounded-full ${
                      c.done ? "bg-brand text-white" : "border border-dashed border-ink/25"
                    }`}
                  >
                    {c.done && <Check className="size-3" strokeWidth={3} />}
                  </span>
                  <span className={c.done ? "text-ink/40 line-through" : ""}>{c.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <h2 className="mt-10 mb-4 font-semibold">Content</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {COLLECTIONS.map((c) => {
          const items = db.collections[c.key] || [];
          const live = items.filter((i) => i.published).length;
          return (
            <Link key={c.key} href={`/admin/collections/${c.key}`} className="group rounded-2xl border border-line bg-white p-5 transition hover:border-brand/40">
              <div className="flex items-center justify-between">
                <p className="font-medium">{c.label}</p>
                <ArrowUpRight className="size-4 text-ink/25 group-hover:text-brand" />
              </div>
              <p className="mt-3 text-[26px] leading-none font-semibold tabular-nums">{items.length}</p>
              <p className="mt-1.5 text-[13px] text-muted">
                {live} live{items.length - live ? ` · ${items.length - live} draft` : ""}
              </p>
            </Link>
          );
        })}
      </div>
    </>
  );
}
