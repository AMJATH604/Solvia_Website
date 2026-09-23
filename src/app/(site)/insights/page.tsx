import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { PageHero } from "@/components/site/ui";
import { readingTime } from "@/lib/markdown";
import { formatDate, getItems, getPage } from "@/lib/site";

export const metadata: Metadata = { title: "Insights" };

export default async function InsightsPage() {
  const [pages, posts] = await Promise.all([getPage("pages"), getItems("insights")]);
  const [lead, ...rest] = posts;
  return (
    <>
      <PageHero eyebrow={pages.insightsEyebrow} title={pages.insightsTitle} intro={pages.insightsIntro} />
      <section className="container-x pb-24 md:pb-32">
        {!lead && <p className="rounded-4xl border border-dashed border-line p-12 text-center text-muted">Articles are coming soon.</p>}
        {lead && (
          <Reveal>
            <Link
              href={`/insights/${lead.slug}`}
              className="group grid overflow-hidden rounded-5xl border border-line bg-white transition hover:shadow-[0_30px_80px_-40px_rgba(12,26,20,0.4)] md:grid-cols-2"
            >
              <div className="relative min-h-[260px] overflow-hidden bg-forest">
                {lead.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={lead.cover} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                ) : (
                  <>
                    <div className="bg-grid-dark absolute inset-0" />
                    <div className="glow absolute -bottom-20 -left-10 size-96 opacity-70" />
                    <p className="absolute bottom-8 left-8 text-sm font-medium text-mint">{lead.category || "Featured"}</p>
                  </>
                )}
              </div>
              <div className="flex flex-col p-8 md:p-12">
                <p className="text-sm text-muted">
                  {formatDate(lead.date)} · {readingTime(lead.body)} min read
                </p>
                <h2 className="display mt-5 text-3xl md:text-5xl">{lead.title}</h2>
                <p className="mt-5 flex-1 text-lg leading-relaxed text-muted">{lead.excerpt}</p>
                <span className="mt-8 inline-flex items-center gap-1.5 font-medium">
                  Read article <ArrowUpRight className="size-4 transition group-hover:text-brand" />
                </span>
              </div>
            </Link>
          </Reveal>
        )}
        {rest.length > 0 && (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {rest.map((p, i) => (
              <Reveal key={p.id} delay={i * 70}>
                <Link
                  href={`/insights/${p.slug}`}
                  className="group flex h-full flex-col rounded-4xl border border-line bg-white p-7 transition hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(12,26,20,0.35)]"
                >
                  <div className="flex items-center gap-2 text-sm text-muted">
                    {p.category && <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-brand">{p.category}</span>}
                    <span>{formatDate(p.date)}</span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold tracking-tight text-balance">{p.title}</h3>
                  <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted">{p.excerpt}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-medium">
                    Read article <ArrowUpRight className="size-4 transition group-hover:text-brand" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
