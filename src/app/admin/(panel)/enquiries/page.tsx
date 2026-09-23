import type { Metadata } from "next";
import Link from "next/link";
import { Download } from "lucide-react";
import { Badge, btn, EmptyState, PageHeader, timeAgo } from "@/components/admin/ui";
import { readDb, type EnquiryStatus } from "@/lib/store";

export const metadata: Metadata = { title: "Enquiries" };

const TABS: { key: "all" | EnquiryStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "open", label: "In progress" },
  { key: "replied", label: "Replied" },
  { key: "archived", label: "Archived" },
];
const TONE = { new: "green", open: "blue", replied: "gray", archived: "gray" } as const;

export default async function EnquiriesPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const { status = "all", q = "" } = await searchParams;
  const db = await readDb();
  const query = q.trim().toLowerCase();
  const list = db.enquiries.filter(
    (e) =>
      (status === "all" ? e.status !== "archived" : e.status === status) &&
      (!query || `${e.name} ${e.email} ${e.company} ${e.message}`.toLowerCase().includes(query)),
  );
  const count = (k: string) => (k === "all" ? db.enquiries.filter((e) => e.status !== "archived").length : db.enquiries.filter((e) => e.status === k).length);

  return (
    <>
      <PageHeader
        title="Enquiries"
        description="Messages from the website contact form."
        actions={
          <a href="/admin/api/enquiries" className={btn("secondary")}>
            <Download className="size-4" /> Export CSV
          </a>
        }
      />
      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        <div className="flex flex-col gap-3 border-b border-line p-3 md:flex-row md:items-center md:justify-between">
          <nav className="flex gap-1 overflow-x-auto rounded-xl bg-surface p-1" aria-label="Filter">
            {TABS.map((t) => (
              <Link
                key={t.key}
                href={`/admin/enquiries${t.key === "all" ? "" : `?status=${t.key}`}`}
                className={`rounded-lg px-3 py-1.5 text-[13px] whitespace-nowrap ${status === t.key ? "bg-white font-medium shadow-sm" : "text-muted hover:text-ink"}`}
              >
                {t.label} <span className="text-ink/40">{count(t.key)}</span>
              </Link>
            ))}
          </nav>
          <form className="md:w-64">
            {status !== "all" && <input type="hidden" name="status" value={status} />}
            <input
              name="q"
              defaultValue={q}
              placeholder="Search enquiries…"
              aria-label="Search enquiries"
              className="h-9 w-full rounded-xl border border-line px-3 text-[14px] outline-none focus:border-brand"
            />
          </form>
        </div>
        {list.length === 0 ? (
          <div className="p-6">
            <EmptyState title="Inbox zero" text="New messages from the contact form will appear here." />
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {list.map((e) => (
              <li key={e.id}>
                <Link href={`/admin/enquiries/${e.id}`} className="grid gap-2 px-5 py-4 hover:bg-surface/50 md:grid-cols-[220px_1fr_auto] md:items-center md:gap-6">
                  <div className="flex items-center gap-3">
                    {e.status === "new" && <span className="size-2 shrink-0 rounded-full bg-brand" aria-label="Unread" />}
                    <div className="min-w-0">
                      <p className={`truncate ${e.status === "new" ? "font-semibold" : "font-medium"}`}>{e.name}</p>
                      <p className="truncate text-[13px] text-muted">{e.company || e.email}</p>
                    </div>
                  </div>
                  <div className="min-w-0">
                    {(e.service || e.budget) && (
                      <p className="mb-0.5 text-[12px] text-brand">{[e.service, e.budget].filter(Boolean).join(" · ")}</p>
                    )}
                    <p className="line-clamp-1 text-ink/75">{e.message}</p>
                  </div>
                  <div className="flex items-center gap-3 md:flex-col md:items-end md:gap-1">
                    <Badge tone={TONE[e.status]}>{e.status === "open" ? "in progress" : e.status}</Badge>
                    <span className="text-[12px] text-ink/40">{timeAgo(e.createdAt)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
