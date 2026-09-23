import Link from "next/link";
import { ArrowRight, ArrowUpRight, Plus, Quote } from "lucide-react";
import { HeroBoard } from "@/components/site/HeroBoard";
import { Reveal } from "@/components/site/Reveal";
import { ButtonLink, CtaBand, SectionHeading, ServiceCard, WorkCard } from "@/components/site/ui";
import { Icon } from "@/lib/icons";
import { formatDate, getItems, getPage, list, type Doc } from "@/lib/site";

export default async function HomePage() {
  const [home, services, work, industries, testimonials, insights, faqs] = await Promise.all([
    getPage("home"),
    getItems("services"),
    getItems("work"),
    getItems("industries"),
    getItems("testimonials"),
    getItems("insights"),
    getItems("faqs"),
  ]);

  const featuredWork = (work.filter((w) => w.featured).length ? work.filter((w) => w.featured) : work).slice(0, 3);
  const marquee = list<string>(home.marqueeItems);
  const cells = services.reduce((n, s) => n + (s.featured ? 2 : 1), 0);
  const ctaSpan = 3 - (cells % 3);

  return (
    <>
      {/* ------------------------------ Hero ------------------------------ */}
      <section className="relative overflow-hidden">
        <div className="bg-grid mask-fade pointer-events-none absolute inset-0" />
        <div className="glow pointer-events-none absolute -top-48 right-[-10%] h-[520px] w-[720px] opacity-25" />
        <div className="container-x relative grid items-center gap-16 pt-12 pb-20 md:pt-20 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:pt-24 lg:pb-28">
          <Reveal>
            {home.heroEyebrow && (
              <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white/70 py-1.5 pr-4 pl-1.5 text-sm text-ink/75 backdrop-blur">
                <span className="inline-flex size-6 items-center justify-center rounded-full bg-brand/10">
                  <svg viewBox="0 0 24 24" className="size-3.5" aria-hidden="true">
                    <path d="M5 12.5 L10 17 L19 7" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {home.heroEyebrow}
              </p>
            )}
            <h1 className="display mt-7 text-[52px] sm:text-7xl xl:text-[92px]">
              {home.heroTitle} <span className="text-brand">{home.heroHighlight}</span>
            </h1>
            {home.heroSubtitle && (
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted md:text-xl">{home.heroSubtitle}</p>
            )}
            <div className="mt-10 flex flex-wrap gap-3">
              {home.heroPrimaryLabel && (
                <ButtonLink href={home.heroPrimaryLink} size="lg">
                  {home.heroPrimaryLabel}
                </ButtonLink>
              )}
              {home.heroSecondaryLabel && (
                <ButtonLink href={home.heroSecondaryLink} variant="ghost" size="lg">
                  {home.heroSecondaryLabel}
                </ButtonLink>
              )}
            </div>
          </Reveal>
          <Reveal delay={150}>
            <HeroBoard tickets={list(home.heroTickets)} />
          </Reveal>
        </div>
      </section>

      {/* ---------------------------- Marquee ----------------------------- */}
      {marquee.length > 0 && (
        <section className="border-y border-line bg-surface/60 py-10" aria-label={home.marqueeTitle || "Technologies"}>
          {home.marqueeTitle && <p className="container-x text-center text-sm text-muted">{home.marqueeTitle}</p>}
          <div className="marquee relative mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]">
            <ul className="marquee-track flex w-max gap-3">
              {[...marquee, ...marquee].map((m, i) => (
                <li
                  key={i}
                  aria-hidden={i >= marquee.length}
                  className="rounded-full border border-line bg-white px-5 py-2.5 text-[15px] font-medium whitespace-nowrap text-ink/70"
                >
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---------------------------- Services ---------------------------- */}
      {services.length > 0 && (
        <section className="container-x py-24 md:py-32">
          <SectionHeading
            eyebrow={home.servicesEyebrow}
            title={home.servicesTitle}
            intro={home.servicesIntro}
            action={
              <ButtonLink href="/services" variant="ghost">
                All services
              </ButtonLink>
            }
          />
          <div className="mt-14 grid grid-flow-dense gap-4 md:grid-cols-3">
            {services.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={i} large={Boolean(s.featured)} />
            ))}
            <Reveal className={ctaSpan === 2 ? "md:col-span-2" : ctaSpan === 3 ? "md:col-span-3" : ""}>
              <Link
                href="/contact"
                className="group relative flex h-full min-h-[260px] flex-col justify-between overflow-hidden rounded-4xl bg-forest p-7 text-white md:p-8"
              >
                <div className="bg-grid-dark absolute inset-0" />
                <div className="glow absolute -right-24 -bottom-24 size-72 opacity-60" />
                <p className="relative text-sm text-mint">Not sure where you fit?</p>
                <div className="relative">
                  <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">Bring us the problem. We&apos;ll find the fix.</h3>
                  <span className="mt-6 inline-flex items-center gap-2 text-[15px] font-medium text-white/85 group-hover:text-white">
                    Talk to an engineer <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* ----------------------- Why Solvia + stats ----------------------- */}
      <section className="relative overflow-hidden bg-forest py-24 text-white md:py-32">
        <div className="bg-grid-dark mask-fade pointer-events-none absolute inset-0" />
        <div className="glow pointer-events-none absolute top-0 left-[-10%] h-96 w-[600px] opacity-40" />
        <div className="container-x relative">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.3fr]">
            <SectionHeading eyebrow={home.whyEyebrow} title={home.whyTitle} intro={home.whyIntro} dark />
            <div className="grid gap-4 sm:grid-cols-2">
              {list(home.whyItems).map((w, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div className="h-full rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-white/20 hover:bg-white/[0.06]">
                    <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-mint/10 text-mint">
                      <Icon name={w.icon} className="size-5" />
                    </span>
                    <h3 className="mt-6 text-xl font-semibold tracking-tight">{w.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-white/60">{w.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {home.statsEnabled && list(home.stats).length > 0 && (
            <Reveal className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-4">
              {list(home.stats).map((s, i) => (
                <div key={i} className="bg-forest p-7 md:p-9">
                  <p className="text-4xl font-semibold tracking-tight text-white md:text-5xl">{s.value}</p>
                  <p className="mt-2 text-[15px] text-white/55">{s.label}</p>
                </div>
              ))}
            </Reveal>
          )}
        </div>
      </section>

      {/* ----------------------------- Process ---------------------------- */}
      {list(home.processSteps).length > 0 && (
        <section className="container-x py-24 md:py-32">
          <SectionHeading eyebrow={home.processEyebrow} title={home.processTitle} intro={home.processIntro} />
          <ol className="relative mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {list(home.processSteps).map((s, i, arr) => (
              <Reveal as="li" key={i} delay={i * 90}>
                <div className="relative h-full rounded-4xl border border-line bg-white p-7">
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex size-11 items-center justify-center rounded-full text-[15px] font-semibold ${
                        i === arr.length - 1 ? "bg-brand text-white" : "bg-surface text-ink"
                      }`}
                    >
                      {i === arr.length - 1 ? (
                        <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
                          <path d="M5 12.5 L10 17 L19 7" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        String(i + 1).padStart(2, "0")
                      )}
                    </span>
                    {s.duration && <span className="text-[13px] text-muted">{s.duration}</span>}
                  </div>
                  <h3 className="mt-10 text-2xl font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </section>
      )}

      {/* -------------------------- Featured work ------------------------- */}
      {featuredWork.length > 0 && (
        <section className="bg-surface/70 py-24 md:py-32">
          <div className="container-x">
            <SectionHeading
              eyebrow="Work"
              title={home.workTitle}
              intro={home.workIntro}
              action={
                <ButtonLink href="/work" variant="ghost">
                  All case studies
                </ButtonLink>
              }
            />
            <div className="mt-14 grid gap-x-6 gap-y-12 md:grid-cols-3">
              {featuredWork.map((w, i) => (
                <WorkCard key={w.id} item={w} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --------------------------- Industries --------------------------- */}
      {industries.length > 0 && (
        <section className="container-x py-24 md:py-32">
          <SectionHeading
            eyebrow="Solutions"
            title={home.industriesTitle}
            intro={home.industriesIntro}
            action={
              <ButtonLink href="/solutions" variant="ghost">
                Explore solutions
              </ButtonLink>
            }
          />
          <div className="mt-14 grid gap-px overflow-hidden rounded-4xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((ind, i) => (
              <Reveal key={ind.id} delay={i * 60} className="bg-white">
                <Link href="/solutions" className="group flex h-full items-start gap-5 p-7 transition hover:bg-surface/60">
                  <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl border border-line text-brand transition group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                    <Icon name={ind.icon} className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight">{ind.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{ind.summary}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* -------------------------- Testimonials -------------------------- */}
      {testimonials.length > 0 && (
        <section className="container-x pb-24 md:pb-32">
          <SectionHeading eyebrow="Testimonials" title={home.testimonialsTitle} />
          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.id} delay={i * 80}>
                <figure className="flex h-full flex-col rounded-4xl border border-line bg-white p-8">
                  <Quote className="size-7 text-brand" />
                  <blockquote className="mt-5 flex-1 text-lg leading-relaxed text-ink">“{t.quote}”</blockquote>
                  <figcaption className="mt-8 flex items-center gap-3">
                    {t.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.photo} alt="" className="size-11 rounded-full object-cover" />
                    ) : (
                      <span className="inline-flex size-11 items-center justify-center rounded-full bg-brand/10 font-semibold text-brand">
                        {String(t.name || "?").charAt(0)}
                      </span>
                    )}
                    <div>
                      <p className="font-semibold">{t.name}</p>
                      <p className="text-sm text-muted">{[t.role, t.company].filter(Boolean).join(", ")}</p>
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ---------------------------- Insights ---------------------------- */}
      {insights.length > 0 && (
        <section className="border-t border-line py-24 md:py-32">
          <div className="container-x">
            <SectionHeading
              eyebrow="Insights"
              title={home.insightsTitle}
              action={
                <ButtonLink href="/insights" variant="ghost">
                  All insights
                </ButtonLink>
              }
            />
            <div className="mt-14 grid gap-4 md:grid-cols-3">
              {insights.slice(0, 3).map((p: Doc, i) => (
                <Reveal key={p.id} delay={i * 80}>
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
                    <span className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-medium text-ink">
                      Read article <ArrowUpRight className="size-4 transition group-hover:text-brand" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------ FAQ ------------------------------- */}
      {faqs.length > 0 && (
        <section className="container-x pb-8">
          <div className="grid gap-12 rounded-5xl bg-surface p-7 md:p-14 lg:grid-cols-[1fr_1.6fr]">
            <SectionHeading eyebrow="FAQ" title={home.faqTitle} />
            <Reveal>
              <div className="divide-y divide-line">
                {faqs.map((f) => (
                  <details key={f.id} className="group py-5 first:pt-0">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium tracking-tight [&::-webkit-details-marker]:hidden">
                      {f.question}
                      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-ink transition group-open:rotate-45 group-open:bg-brand group-open:text-white">
                        <Plus className="size-4" />
                      </span>
                    </summary>
                    <p className="mt-3 max-w-2xl pr-12 text-[15px] leading-relaxed text-muted">{f.answer}</p>
                  </details>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      <CtaBand title={home.ctaTitle} text={home.ctaText} label={home.ctaPrimaryLabel} href={home.ctaPrimaryLink} />
    </>
  );
}
