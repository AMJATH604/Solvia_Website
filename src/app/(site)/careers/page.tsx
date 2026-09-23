import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { PageHero } from "@/components/site/ui";
import { Icon } from "@/lib/icons";
import { getItems, getPage, getSettings, list } from "@/lib/site";

export const metadata: Metadata = { title: "Careers" };

export default async function CareersPage() {
  const [pages, jobs, settings] = await Promise.all([getPage("pages"), getItems("careers"), getSettings()]);
  const perks = list(pages.perks);
  return (
    <>
      <PageHero eyebrow={pages.careersEyebrow} title={pages.careersTitle} intro={pages.careersIntro} />

      {perks.length > 0 && (
        <section className="container-x">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {perks.map((p, i) => (
              <Reveal key={i} delay={i * 70}>
                <div className="h-full rounded-4xl bg-surface p-7">
                  <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-white text-brand">
                    <Icon name={p.icon} className="size-5" />
                  </span>
                  <h2 className="mt-6 text-lg font-semibold">{p.title}</h2>
                  <p className="mt-1.5 text-[15px] text-muted">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="container-x py-20 md:py-28">
        <div className="flex items-end justify-between gap-6">
          <h2 className="display text-3xl md:text-5xl">Open roles</h2>
          <p className="text-muted">{jobs.length} open</p>
        </div>
        {jobs.length ? (
          <ul className="mt-10 divide-y divide-line border-y border-line">
            {jobs.map((j) => (
              <li key={j.id}>
                <Link href={`/careers/${j.slug}`} className="group grid gap-3 py-7 md:grid-cols-[1.4fr_1fr_auto] md:items-center">
                  <div>
                    <p className="text-sm text-brand">{j.department}</p>
                    <h3 className="mt-1 text-2xl font-semibold tracking-tight">{j.title}</h3>
                    {j.summary && <p className="mt-2 max-w-xl text-[15px] text-muted">{j.summary}</p>}
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm text-ink/70">
                    {j.location && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1">
                        <MapPin className="size-3.5" /> {j.location}
                      </span>
                    )}
                    {j.type && <span className="rounded-full border border-line px-3 py-1">{j.type}</span>}
                    {j.experience && <span className="rounded-full border border-line px-3 py-1">{j.experience}</span>}
                  </div>
                  <span className="inline-flex size-12 items-center justify-center rounded-full border border-line transition group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                    <ArrowUpRight className="size-5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-10 rounded-4xl border border-dashed border-line p-10 text-center">
            <p className="mx-auto max-w-xl text-muted">{pages.careersEmpty}</p>
            {settings.email && (
              <a href={`mailto:${settings.email}`} className="mt-5 inline-block font-medium text-brand">
                {settings.email}
              </a>
            )}
          </div>
        )}
      </section>
    </>
  );
}
