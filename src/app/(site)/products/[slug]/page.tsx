import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Globe, Plus, LayoutGrid, Sparkles, CreditCard, Building2 } from "lucide-react";
import { ProductScreen } from "@/components/site/ProductMockups";
import { Reveal } from "@/components/site/Reveal";
import { ProductPageAnimations } from "@/components/site/ProductPageAnimations";
import { Icon } from "@/lib/icons";
import { getItems, list, safeColor, type Doc } from "@/lib/site";
import { CASEFLOW_DEFAULT_SCREENS } from "@/lib/caseflow-screens";

type Props = { params: Promise<{ slug: string }> };

async function load(slug: string) {
  return (await getItems("products")).find((p) => p.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await load((await params).slug);
  if (!p) return {};
  return {
    title: `${p.name} — ${p.tagline || "by Solvia"}`,
    description: p.summary,
    openGraph: { images: p.logo ? [p.logo] : undefined },
  };
}

function PlayBadge({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 text-forest transition hover:bg-white/90"
    >
      <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
        <path fill="#34A853" d="M3.6 1.8 13.4 12l-9.8 10.2c-.4-.2-.6-.7-.6-1.2V3c0-.5.2-1 .6-1.2Z" />
        <path fill="#FBBC04" d="m17 8.3-3.6 3.7 3.6 3.7 4.1-2.3c1.2-.7 1.2-2.1 0-2.8L17 8.3Z" />
        <path fill="#4285F4" d="M3.6 22.2 13.4 12l3.6 3.7L5.4 22.3c-.7.4-1.4.3-1.8-.1Z" />
        <path fill="#EA4335" d="M3.6 1.8c.4-.4 1.1-.5 1.8-.1L17 8.3 13.4 12 3.6 1.8Z" />
      </svg>
      <span className="text-left leading-tight">
        <span className="block text-[10px] tracking-wide uppercase opacity-60">Get it on</span>
        <span className="block font-semibold">Google Play</span>
      </span>
    </a>
  );
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const p = await load(slug);
  if (!p) notFound();

  const accent = safeColor(p.accentColor, "#2563EB");
  const stats = list(p.stats).filter((s) => s.value);
  const modules = list(p.modules).filter((m) => m.title);
  const spotlights = list(p.spotlights).filter((s) => s.title);
  const trust = list(p.trust).filter((t) => t.title);
  const screens = list(p.screens).filter((s) => s.image);
  const faqs = list(p.faqs).filter((f) => f.question);
  const platforms = list<string>(p.platforms);
  const cta = p.primaryCtaLink || "/contact";

  return (
    <div style={{ "--product": accent } as React.CSSProperties}>
      <ProductPageAnimations accentColor={accent} />
      {/* ------------------------------ Hero ------------------------------ */}
      <section className="relative overflow-hidden bg-[#0B1020] text-white">
        <div className="bg-grid-dark mask-fade pointer-events-none absolute inset-0" />
        <div
          className="pointer-events-none absolute -top-40 right-[-5%] h-[640px] w-[820px] opacity-45 blur-3xl"
          style={{ background: `radial-gradient(closest-side, ${accent}, transparent)` }}
        />
        <div className="container-x relative pt-10 md:pt-14">
          <Link href="/products" className="inline-flex items-center gap-1.5 text-sm text-white/55 hover:text-white">
            <ArrowLeft className="size-4" /> All products
          </Link>
        </div>
        <div className="container-x relative grid items-center gap-14 pt-10 pb-20 lg:grid-cols-[1.1fr_1fr] lg:pb-0">
          <Reveal className="lg:pb-28">
            <div className="flex flex-wrap items-center gap-3">
              {p.logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.logo} alt={`${p.name} logo`} className="size-14 rounded-2xl bg-white object-contain p-1" />
              )}
              <div>
                <p className="text-2xl font-semibold tracking-tight">{p.name}</p>
                <p className="text-sm text-white/55">A Solvia Technologies product</p>
              </div>
              {p.status && (
                <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-white/80">
                  <span className="mr-1.5 inline-block size-1.5 rounded-full bg-emerald-400 align-middle" />
                  {p.status}
                </span>
              )}
            </div>
            <h1 className="display mt-9 text-5xl md:text-7xl">{p.headline}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70 md:text-xl">{p.summary}</p>
            {p.audience && <p className="mt-4 text-[15px] text-white/50">{p.audience}</p>}
            <div className="mt-9 flex flex-wrap items-center gap-3">
              {p.primaryCtaLabel && (
                <Link
                  href={cta}
                  className="group inline-flex items-center gap-2 rounded-full bg-[var(--product)] px-7 py-4 font-medium text-white shadow-[0_10px_40px_-10px_var(--product)] transition hover:brightness-110"
                >
                  {p.primaryCtaLabel}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              )}
              {p.playStoreLink && <PlayBadge href={p.playStoreLink} />}
              {p.webAppLink && (
                <a
                  href={p.webAppLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-4 font-medium text-white ring-1 ring-white/20 transition hover:ring-white/50"
                >
                  <Globe className="size-4" /> Open web app
                </a>
              )}
            </div>
            {platforms.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-2">
                {platforms.map((pl) => (
                  <li key={pl} className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/75">
                    {pl}
                  </li>
                ))}
              </ul>
            )}
          </Reveal>
          <Reveal delay={150} className="relative flex justify-center lg:h-[640px] lg:items-end">
            <ProductScreen visual="diary" className="absolute top-16 left-[4%] hidden scale-90 -rotate-6 opacity-70 xl:block" />
            <ProductScreen visual="dashboard" className="relative lg:translate-y-10" />
          </Reveal>
        </div>
      </section>

      {/* ----------------------------- Stats ------------------------------ */}
      {stats.length > 0 && (
        <section className="border-b border-line">
          <div className="container-x grid grid-cols-2 md:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={i} delay={i * 60} className={`py-10 md:py-14 ${i > 0 ? "md:border-l md:border-line md:pl-8" : ""}`}>
                <p className="text-4xl font-semibold tracking-tight text-[var(--product)] md:text-5xl">{s.value}</p>
                <p className="mt-2 text-[15px] text-muted">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* --------------------------- Sub-nav ----------------------------- */}
      <nav className="sticky top-0 z-40 border-b border-line bg-white/80 backdrop-blur-xl dark:bg-[#0B1020]/80">
        <div className="container-x flex gap-2 overflow-x-auto py-3">
          {[
            { label: "Overview", href: `/products/${slug}`, icon: LayoutGrid },
            { label: "All Features", href: `/products/${slug}/features`, icon: Sparkles },
            { label: "Pricing", href: `/products/${slug}/pricing`, icon: CreditCard },
            { label: "Bar Associations", href: `/products/${slug}/bar`, icon: Building2 },
          ].map((link) => {
            const IconComp = link.icon;
            return (
              <Link
                key={link.label}
                href={link.href}
                className="group flex shrink-0 items-center gap-2 rounded-xl border border-transparent px-5 py-3 text-sm font-semibold text-muted transition-all hover:border-[var(--product)]/20 hover:bg-[var(--product)]/5 hover:text-[var(--product)] hover:shadow-sm"
              >
                <IconComp className="size-4 text-[var(--product)] opacity-60 transition group-hover:opacity-100" />
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ---------------------------- Modules ----------------------------- */}
      {modules.length > 0 && (
        <section className="container-x py-24 md:py-32">
          <Reveal className="max-w-3xl">
            <p className="eyebrow text-[var(--product)]!">Inside {p.name}</p>
            <h2 className="display mt-4 text-4xl md:text-[56px]">Everything a practice runs on.</h2>
            <p className="mt-5 text-lg text-muted">
              {modules.length} modules that cover the full life of a matter — from the first client meeting to the final order.
            </p>
          </Reveal>
          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((m: Doc, i) => (
              <Reveal
                key={i}
                delay={(i % 3) * 70}
                // A lone card on the last row spans the full width instead of sitting by itself.
                className={i === modules.length - 1 && modules.length % 3 === 1 ? "lg:col-span-3" : ""}
              >
                <div className="group h-full rounded-4xl border border-line bg-white p-7 transition hover:-translate-y-1 hover:border-[var(--product)]/40 hover:shadow-[0_24px_60px_-30px_rgba(11,16,32,0.35)]">
                  <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-[var(--product)]/10 text-[var(--product)] transition group-hover:bg-[var(--product)] group-hover:text-white">
                    <Icon name={m.icon} className="size-6" />
                  </span>
                  <h3 className="mt-7 text-xl font-semibold tracking-tight">{m.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{m.text}</p>
                  {list<string>(m.features).length > 0 && (
                    <ul className="mt-5 flex flex-wrap gap-1.5">
                      {list<string>(m.features).map((f) => (
                        <li key={f} className="rounded-full bg-surface px-2.5 py-1 text-[13px] text-ink/70">
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* --------------------------- Spotlights --------------------------- */}
      {spotlights.map((s: Doc, i) => (
        <section key={i} className={i % 2 === 0 ? "bg-surface/70" : ""}>
          <div className="container-x grid items-center gap-14 py-20 md:py-28 lg:grid-cols-2">
            <Reveal className={i % 2 === 1 ? "lg:order-2" : ""}>
              {s.eyebrow && <p className="eyebrow text-[var(--product)]!">{s.eyebrow}</p>}
              <h2 className="display mt-4 text-4xl md:text-5xl">{s.title}</h2>
              {s.text && <p className="mt-5 text-lg leading-relaxed text-muted">{s.text}</p>}
              {list<string>(s.points).length > 0 && (
                <ul className="mt-8 space-y-3">
                  {list<string>(s.points).map((pt) => (
                    <li key={pt} className="flex items-start gap-3 text-[16px]">
                      <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--product)] text-white">
                        <Check className="size-3.5" strokeWidth={3} />
                      </span>
                      {pt}
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
            <Reveal delay={120} className={`relative flex justify-center ${i % 2 === 1 ? "lg:order-1" : ""}`}>
              <div
                className="pointer-events-none absolute inset-x-10 top-10 bottom-10 rounded-full opacity-25 blur-3xl"
                style={{ background: accent }}
              />
              {s.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.image} alt={s.title} className="relative max-h-[640px] w-auto rounded-[40px] shadow-2xl" />
              ) : (
                <ProductScreen visual={s.visual} className="relative" />
              )}
            </Reveal>
          </div>
        </section>
      ))}

      {/* ----------------------------- Trust ------------------------------ */}
      {trust.length > 0 && (
        <section className="relative overflow-hidden bg-[#0B1020] py-24 text-white md:py-32">
          <div className="bg-grid-dark mask-fade pointer-events-none absolute inset-0" />
          <div className="container-x relative">
            <Reveal className="max-w-3xl">
              <p className="eyebrow text-[var(--product)]!" style={{ filter: "brightness(1.4)" }}>
                Security & trust
              </p>
              <h2 className="display mt-4 text-4xl md:text-[56px]">Built for confidential work.</h2>
              <p className="mt-5 text-lg text-white/60">Client matters deserve more than a spreadsheet. {p.name} is designed so sensitive data stays where it belongs.</p>
            </Reveal>
            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {trust.map((t: Doc, i) => (
                <Reveal key={i} delay={i * 70}>
                  <div className="h-full rounded-3xl border border-white/10 bg-white/[0.04] p-7">
                    <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-white/10 text-white">
                      <Icon name={t.icon} className="size-5" />
                    </span>
                    <h3 className="mt-6 text-lg font-semibold">{t.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-white/60">{t.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------------------- Gallery ----------------------------- */}
      {(() => {
        const gallery = screens.length > 0 ? screens : (p.slug === "caseflow" ? CASEFLOW_DEFAULT_SCREENS : []);
        return gallery.length > 0 ? (
          <section className="py-24 md:py-32">
            <div className="container-x">
              <Reveal>
                <p className="eyebrow text-[var(--product)]!">{p.screensEyebrow || "Inside the app"}</p>
                <h2 className="display text-4xl md:text-[56px]">{p.screensTitle || "A closer look"}</h2>
                <p className="mt-4 text-lg text-muted">
                  {p.screensIntro || "Real screenshots from the CaseFlow app — what your advocates will actually see."}
                </p>
              </Reveal>
            </div>
            <div className="mt-12 flex snap-x gap-6 overflow-x-auto px-5 pb-6 md:px-[max(2rem,calc((100vw-1240px)/2+2rem))]">
              {gallery.map((sc: Doc | (typeof CASEFLOW_DEFAULT_SCREENS)[0], i) => (
                <figure key={i} className="w-[240px] shrink-0 snap-start">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={sc.image} alt={sc.title || ""} className="w-full rounded-[32px] border border-line shadow-lg" />
                  {sc.title && <figcaption className="mt-4 font-semibold">{sc.title}</figcaption>}
                  {"caption" in sc && sc.caption && <p className="mt-1 text-sm text-muted">{sc.caption}</p>}
                </figure>
              ))}
            </div>
          </section>
        ) : null;
      })()}

      {/* ------------------------------ FAQ ------------------------------- */}
      {faqs.length > 0 && (
        <section className="container-x py-24 md:py-32">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
            <Reveal>
              <p className="eyebrow text-[var(--product)]!">FAQ</p>
              <h2 className="display mt-4 text-4xl md:text-[56px]">{p.name}, answered</h2>
            </Reveal>
            <Reveal className="divide-y divide-line">
              {faqs.map((f: Doc, i) => (
                <details key={i} className="group py-5 first:pt-0">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium tracking-tight [&::-webkit-details-marker]:hidden">
                    {f.question}
                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-surface transition group-open:rotate-45 group-open:bg-[var(--product)] group-open:text-white">
                      <Plus className="size-4" />
                    </span>
                  </summary>
                  <p className="mt-3 max-w-2xl pr-12 text-[15px] leading-relaxed text-muted">{f.answer}</p>
                </details>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {/* ------------------------------ CTA ------------------------------- */}
      <section className="container-x pb-24 md:pb-32">
        <Reveal>
          <div className="relative overflow-hidden rounded-5xl bg-[var(--product)] px-7 py-16 text-center text-white md:px-16 md:py-24">
            <div className="bg-grid-dark pointer-events-none absolute inset-0 opacity-60" />
            <div className="relative mx-auto max-w-3xl">
              {p.logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.logo} alt="" className="mx-auto size-16 rounded-2xl bg-white object-contain p-1" />
              )}
              <h2 className="display mt-8 text-4xl md:text-6xl">{p.ctaTitle || `Try ${p.name}`}</h2>
              {p.ctaText && <p className="mx-auto mt-5 max-w-xl text-lg text-white/80">{p.ctaText}</p>}
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <Link href={cta} className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-medium text-forest transition hover:bg-white/90">
                  {p.primaryCtaLabel || "Get in touch"}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                {p.playStoreLink && <PlayBadge href={p.playStoreLink} />}
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
