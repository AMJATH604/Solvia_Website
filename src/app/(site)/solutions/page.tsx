import type { Metadata } from "next";
import { Reveal } from "@/components/site/Reveal";
import { CtaBand, PageHero } from "@/components/site/ui";
import { Icon } from "@/lib/icons";
import { getItems, getPage, list } from "@/lib/site";

export const metadata: Metadata = { title: "Solutions" };

export default async function SolutionsPage() {
  const [pages, home, industries] = await Promise.all([getPage("pages"), getPage("home"), getItems("industries")]);
  return (
    <>
      <PageHero eyebrow={pages.solutionsEyebrow} title={pages.solutionsTitle} intro={pages.solutionsIntro} />
      <section className="container-x pb-8">
        <div className="grid gap-4 md:grid-cols-2">
          {industries.map((ind, i) => (
            <Reveal key={ind.id} delay={(i % 2) * 90}>
              <article className="group flex h-full flex-col rounded-4xl border border-line bg-white p-7 transition hover:border-brand/40 hover:shadow-[0_24px_60px_-30px_rgba(12,26,20,0.3)] md:p-10">
                <div className="flex items-center gap-4">
                  <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                    <Icon name={ind.icon} className="size-6" />
                  </span>
                  <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{ind.title}</h2>
                </div>
                <p className="mt-5 text-[17px] leading-relaxed text-muted">{ind.summary}</p>
                {list<string>(ind.problems).length > 0 && (
                  <div className="mt-8 rounded-3xl bg-surface p-5">
                    <p className="text-xs font-medium tracking-[0.08em] text-muted uppercase">Problems we solve</p>
                    <ul className="mt-3 space-y-2.5">
                      {list<string>(ind.problems).map((p) => (
                        <li key={p} className="flex items-start gap-3 text-[15px] text-ink/85">
                          <svg viewBox="0 0 24 24" className="mt-0.5 size-5 shrink-0" aria-hidden="true">
                            <circle cx="12" cy="12" r="12" fill="var(--accent)" />
                            <path d="M7 12.5 L10.5 16 L17 8.5" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </section>
      <CtaBand title={home.ctaTitle} text={home.ctaText} label={home.ctaPrimaryLabel} href={home.ctaPrimaryLink} />
    </>
  );
}
