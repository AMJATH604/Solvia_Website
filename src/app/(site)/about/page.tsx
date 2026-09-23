import type { Metadata } from "next";
import { Reveal } from "@/components/site/Reveal";
import { CtaBand, PageHero, Prose } from "@/components/site/ui";
import { Icon } from "@/lib/icons";
import { markdownToHtml } from "@/lib/markdown";
import { getItems, getPage, list } from "@/lib/site";

export const metadata: Metadata = { title: "Company" };

export default async function AboutPage() {
  const [about, home, team] = await Promise.all([getPage("about"), getPage("home"), getItems("team")]);
  return (
    <>
      <PageHero eyebrow={about.eyebrow} title={about.title} intro={about.intro} />

      {(about.mission || about.vision) && (
        <section className="container-x">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { label: "Mission", text: about.mission, dark: true },
              { label: "Vision", text: about.vision, dark: false },
            ]
              .filter((b) => b.text)
              .map((b, i) => (
                <Reveal key={b.label} delay={i * 90}>
                  <div className={`relative h-full overflow-hidden rounded-5xl p-8 md:p-12 ${b.dark ? "bg-forest text-white" : "bg-surface"}`}>
                    {b.dark && <div className="glow absolute -right-20 -bottom-20 size-80 opacity-50" />}
                    <p className={`relative text-sm font-medium tracking-[0.08em] uppercase ${b.dark ? "text-mint" : "text-brand"}`}>{b.label}</p>
                    <p className="relative mt-8 text-2xl leading-snug font-medium tracking-tight md:text-3xl">{b.text}</p>
                  </div>
                </Reveal>
              ))}
          </div>
        </section>
      )}

      {about.story && (
        <section className="container-x py-24 md:py-32">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
            <Reveal>
              <h2 className="display text-4xl md:text-6xl lg:sticky lg:top-28">{about.storyTitle}</h2>
            </Reveal>
            <Reveal>
              <Prose html={markdownToHtml(about.story)} className="md:text-xl" />
            </Reveal>
          </div>
        </section>
      )}

      {list(about.values).length > 0 && (
        <section className="border-t border-line py-24 md:py-32">
          <div className="container-x">
            <Reveal>
              <h2 className="display text-4xl md:text-6xl">{about.valuesTitle}</h2>
            </Reveal>
            <div className="mt-14 grid gap-px overflow-hidden rounded-4xl border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
              {list(about.values).map((v, i) => (
                <Reveal key={i} delay={i * 70} className="bg-white">
                  <div className="h-full p-8">
                    <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                      <Icon name={v.icon} className="size-5" />
                    </span>
                    <h3 className="mt-10 text-xl font-semibold tracking-tight">{v.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted">{v.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {team.length > 0 && (
        <section className="container-x pb-8">
          <Reveal className="max-w-2xl">
            <h2 className="display text-4xl md:text-6xl">{about.teamTitle}</h2>
            {about.teamIntro && <p className="mt-5 text-lg text-muted">{about.teamIntro}</p>}
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m, i) => (
              <Reveal key={m.id} delay={i * 70}>
                <div className="aspect-[4/5] overflow-hidden rounded-4xl bg-surface">
                  {m.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.photo} alt={m.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-6xl font-semibold text-brand/40">{String(m.name).charAt(0)}</div>
                  )}
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  {m.linkedin ? (
                    <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-brand">
                      {m.name}
                    </a>
                  ) : (
                    m.name
                  )}
                </h3>
                <p className="text-[15px] text-muted">{m.role}</p>
                {m.bio && <p className="mt-2 text-sm leading-relaxed text-muted">{m.bio}</p>}
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <CtaBand title={home.ctaTitle} text={home.ctaText} label={home.ctaPrimaryLabel} href={home.ctaPrimaryLink} />
    </>
  );
}
