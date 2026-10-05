import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Bell,
  CalendarDays,
  Check,
  IndianRupee,
  Users,
  Vote,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { ProductScreen } from "@/components/site/ProductMockups";
import { getItems, safeColor, type Doc } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

async function load(slug: string) {
  return (await getItems("products")).find((p) => p.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await load((await params).slug);
  if (!p) return {};
  return {
    title: `Bar Associations — ${p.name}`,
    description: `${p.name} for bar associations: digital membership cards, fee tracking, notices, events and elections — in one app.`,
  };
}

const POINTS = [
  {
    icon: BadgeCheck,
    title: "Digital membership cards",
    body: "Enrolment number, membership type and validity — on every member's phone.",
  },
  {
    icon: IndianRupee,
    title: "Annual fee status",
    body: "Who has paid for the year and who hasn't, at a glance.",
  },
  {
    icon: Bell,
    title: "Notices that arrive",
    body: "Post a notice and it reaches every member as a notification, not a photo lost in a group chat.",
  },
  {
    icon: CalendarDays,
    title: "Events",
    body: "Association meetings and programmes, with the details in one place.",
  },
  {
    icon: Vote,
    title: "Elections",
    body: "Run the association's elections from inside the app.",
  },
  {
    icon: Users,
    title: "Members",
    body: "Everyone who belongs to the association, in one list.",
  },
];

export default async function BarPage({ params }: Props) {
  const { slug } = await params;
  const p = await load(slug);
  if (!p) notFound();

  const accent = safeColor(p.accentColor, "#2563EB");

  return (
    <div style={{ "--product": accent } as React.CSSProperties}>
      {/* ------------------------------ Hero ------------------------------ */}
      <section className="relative overflow-hidden bg-[#0B1020] text-white">
        <div className="bg-grid-dark mask-fade pointer-events-none absolute inset-0" />
        <div
          className="pointer-events-none absolute -top-40 right-[-5%] h-[640px] w-[820px] opacity-30 blur-3xl"
          style={{ background: `radial-gradient(closest-side, ${accent}, transparent)` }}
        />
        <div className="container-x relative pt-10 md:pt-14">
          <Link href={`/products/${slug}`} className="inline-flex items-center gap-1.5 text-sm text-white/55 hover:text-white">
            <ArrowLeft className="size-4" /> {p.name}
          </Link>
        </div>
        <div className="container-x relative grid items-center gap-14 pt-10 pb-20 lg:grid-cols-2 lg:pb-0">
          <Reveal className="lg:pb-28">
            <p className="eyebrow text-[var(--product)]!" style={{ filter: "brightness(1.4)" }}>
              Bar Associations
            </p>
            <h1 className="display mt-4 text-5xl md:text-7xl">Your association, modernised.</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70 md:text-xl">
              Digital membership cards, fee tracking, notices, events and elections — 
              all inside {p.name}, on every member&rsquo;s phone.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/contact?interest=CaseFlow%20Bar%20Association"
                className="group inline-flex items-center gap-2 rounded-full bg-[var(--product)] px-7 py-4 font-medium text-white shadow-[0_10px_40px_-10px_var(--product)] transition hover:brightness-110"
              >
                Talk to our team
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={`/products/${slug}/pricing`}
                className="inline-flex items-center gap-2 rounded-full px-6 py-4 font-medium text-white ring-1 ring-white/20 transition hover:ring-white/50"
              >
                View pricing
              </Link>
            </div>
          </Reveal>
          <Reveal delay={150} className="relative flex justify-center lg:h-[640px] lg:items-end">
            <ProductScreen visual="dashboard" className="relative lg:translate-y-10" />
          </Reveal>
        </div>
      </section>

      {/* ----------------------------- Features Grid ----------------------------- */}
      <section className="container-x py-24 md:py-32">
        <Reveal className="max-w-3xl">
          <p className="eyebrow text-[var(--product)]!">What your association gets</p>
          <h2 className="display mt-4 text-4xl md:text-[56px]">
            Replace the WhatsApp group with a real system.
          </h2>
          <p className="mt-5 text-lg text-muted">
            Most bar associations run on phone calls, group photos and paper registers.{" "}
            {p.name} gives every member the tools — and gives the committee the oversight.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {POINTS.map((point, i) => (
            <Reveal key={point.title} delay={(i % 3) * 70}>
              <div className="group h-full rounded-4xl border border-line bg-white p-7 transition hover:-translate-y-1 hover:border-[var(--product)]/40 hover:shadow-[0_24px_60px_-30px_rgba(11,16,32,0.35)]">
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-[var(--product)]/10 text-[var(--product)] transition group-hover:bg-[var(--product)] group-hover:text-white">
                  <point.icon className="size-6" />
                </span>
                <h3 className="mt-7 text-xl font-semibold tracking-tight">{point.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{point.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ----------------------------- How It Works ----------------------------- */}
      <section className="bg-surface/70">
        <div className="container-x py-20 md:py-28">
          <Reveal>
            <p className="eyebrow text-[var(--product)]!">How it works</p>
            <h2 className="display mt-4 text-4xl md:text-[56px]">
              Three steps to bring your association online.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Talk to us",
                text: "We set up your association's private space inside CaseFlow and import your member list.",
              },
              {
                step: "02",
                title: "Members join",
                text: "Members download CaseFlow and see their bar association card, notices and events from day one.",
              },
              {
                step: "03",
                title: "Committee manages",
                text: "Post notices, track fees, announce events and run elections — all from the admin dashboard.",
              },
            ].map((s, i) => (
              <Reveal key={s.step} delay={i * 80}>
                <div className="rounded-3xl border border-line bg-white p-7">
                  <span className="text-sm font-bold text-[var(--product)]">{s.step}</span>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------- Pricing Teaser ----------------------------- */}
      <section className="container-x py-20 md:py-28">
        <Reveal>
          <div className="relative overflow-hidden rounded-4xl border border-[var(--product)]/30 bg-[#0B1020] p-8 text-white md:p-14">
            <div className="bg-grid-dark pointer-events-none absolute inset-0 opacity-50" />
            <div
              className="pointer-events-none absolute -top-20 right-0 h-[400px] w-[500px] opacity-30 blur-3xl"
              style={{ background: `radial-gradient(closest-side, ${accent}, transparent)` }}
            />
            <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <p className="eyebrow text-[var(--product)]!" style={{ filter: "brightness(1.4)" }}>
                  Bar Plan
                </p>
                <h2 className="display mt-4 text-3xl md:text-5xl">
                  One plan for the whole association.
                </h2>
                <p className="mt-4 max-w-lg text-lg text-white/65">
                  A single subscription covers every member. Pricing scales with the size
                  of your association — talk to us for a custom quote.
                </p>
                <ul className="mt-6 space-y-2">
                  {[
                    "All member features included",
                    "Committee admin dashboard",
                    "Unlimited notices and events",
                    "Election module",
                    "Dedicated onboarding support",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-[15px] text-white/80">
                      <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--product)] text-white">
                        <Check className="size-3" strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-center">
                <p className="text-6xl font-bold tracking-tight md:text-7xl">Custom</p>
                <p className="mt-2 text-white/50">Based on association size</p>
                <Link
                  href="/contact?interest=CaseFlow%20Bar%20Association"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-medium text-forest transition hover:bg-white/90"
                >
                  Request a quote <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

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
              <h2 className="display mt-8 text-4xl md:text-6xl">
                Bring {p.name} to your bar association.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-white/80">
                We&rsquo;ll walk your committee through every feature and help onboard your members.
              </p>
              <div className="mt-10">
                <Link
                  href="/contact?interest=CaseFlow%20Bar%20Association"
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-medium text-forest transition hover:bg-white/90"
                >
                  Talk to our team
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
