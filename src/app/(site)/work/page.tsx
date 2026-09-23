import type { Metadata } from "next";
import { CtaBand, PageHero, WorkCard } from "@/components/site/ui";
import { getItems, getPage } from "@/lib/site";

export const metadata: Metadata = { title: "Work" };

export default async function WorkPage() {
  const [pages, home, work] = await Promise.all([getPage("pages"), getPage("home"), getItems("work")]);
  return (
    <>
      <PageHero eyebrow={pages.workEyebrow} title={pages.workTitle} intro={pages.workIntro} />
      <section className="container-x pb-8">
        {work.length ? (
          <div className="grid gap-x-6 gap-y-14 md:grid-cols-2">
            {work.map((w, i) => (
              <WorkCard key={w.id} item={w} index={i} />
            ))}
          </div>
        ) : (
          <p className="rounded-4xl border border-dashed border-line p-12 text-center text-muted">Case studies are coming soon.</p>
        )}
      </section>
      <CtaBand title={home.ctaTitle} text={home.ctaText} label={home.ctaPrimaryLabel} href={home.ctaPrimaryLink} />
    </>
  );
}
