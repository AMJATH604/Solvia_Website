import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { CtaBand, Prose, Tags, WorkCover } from "@/components/site/ui";
import { markdownToHtml } from "@/lib/markdown";
import { getItems, getPage, list } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

async function load(slug: string) {
  const work = await getItems("work");
  const index = work.findIndex((w) => w.slug === slug);
  return { work, index, item: work[index] };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { item } = await load((await params).slug);
  return item ? { title: item.title, description: item.summary } : {};
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const [{ work, index, item }, home] = await Promise.all([load(slug), getPage("home")]);
  if (!item) notFound();
  const next = work.length > 1 ? work[(index + 1) % work.length] : null;
  const chapters = [
    { label: "The problem", body: item.problem },
    { label: "Our approach", body: item.approach },
    { label: "The outcome", body: item.outcome },
  ].filter((c) => c.body);
  const metrics = list(item.metrics).filter((m) => m.value);

  return (
    <>
      <section className="container-x pt-10 pb-12 md:pt-16">
        <Link href="/work" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink">
          <ArrowLeft className="size-4" /> All work
        </Link>
        <Reveal className="mt-10 max-w-5xl">
          <div className="flex flex-wrap gap-2 text-sm">
            {[item.industry, item.client, item.year].filter(Boolean).map((t) => (
              <span key={t} className="rounded-full border border-line px-3 py-1 text-ink/70">
                {t}
              </span>
            ))}
          </div>
          <h1 className="display mt-6 text-4xl md:text-[68px]">{item.title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted md:text-xl">{item.summary}</p>
        </Reveal>
      </section>

      <section className="container-x">
        <Reveal className="aspect-[16/9] overflow-hidden rounded-5xl md:aspect-[16/6]">
          <WorkCover item={item} index={index} showMetric={!item.cover && metrics.length === 0} />
        </Reveal>
        {metrics.length > 0 && (
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {metrics.map((m, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="rounded-4xl bg-surface p-7">
                  <p className="text-4xl font-semibold tracking-tight text-brand md:text-5xl">{m.value}</p>
                  <p className="mt-2 text-[15px] text-muted">{m.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <section className="container-x py-20 md:py-28">
        <div className="mx-auto max-w-5xl space-y-16">
          {chapters.map((c, i) => (
            <Reveal key={c.label} className="grid gap-6 md:grid-cols-[220px_1fr]">
              <div>
                <span className="text-sm text-brand">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">{c.label}</h2>
              </div>
              <Prose html={markdownToHtml(c.body)} />
            </Reveal>
          ))}
          {list(item.stack).length > 0 && (
            <Reveal className="grid gap-6 md:grid-cols-[220px_1fr]">
              <h2 className="text-2xl font-semibold tracking-tight">Tech stack</h2>
              <Tags items={item.stack} />
            </Reveal>
          )}
        </div>
      </section>

      {next && (
        <section className="container-x">
          <Link
            href={`/work/${next.slug}`}
            className="group flex flex-col gap-4 rounded-5xl border border-line p-8 transition hover:border-brand/40 md:flex-row md:items-center md:justify-between md:p-12"
          >
            <div>
              <p className="text-sm text-muted">Next case study</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight md:text-4xl">{next.title}</p>
            </div>
            <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-forest text-white transition group-hover:bg-brand">
              <ArrowRight className="size-6" />
            </span>
          </Link>
        </section>
      )}

      <CtaBand title={home.ctaTitle} text={home.ctaText} label={home.ctaPrimaryLabel} href={home.ctaPrimaryLink} />
    </>
  );
}
