import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Minus, Plus } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { getItems, safeColor, type Doc } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

async function load(slug: string) {
  return (await getItems("products")).find((p) => p.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await load((await params).slug);
  if (!p) return {};
  return {
    title: `Pricing — ${p.name}`,
    description: `${p.name} pricing plans for advocates, firms and bar associations.`,
  };
}

/* ----- Pricing plans (from CaseFlow website) ----- */

const PLANS = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Get started with the essentials — no card needed.",
    highlighted: false,
    features: [
      "Court diary and hearing reminders",
      "Case dossiers, parties and clients",
      "Daily tasks",
      "Legal calculators and stamp values",
      "Bare acts, templates and dictionaries",
    ],
  },
  {
    name: "Pro",
    price: "₹199",
    period: "/ month",
    badge: "Popular",
    description: "Everything in Free, plus AI, eCourts and advanced tools.",
    highlighted: true,
    features: [
      "Everything in Free",
      "CaseFlow AI legal assistant",
      "PDF and e-filing document tools",
      "eCourts import, export and backup",
      "Certified copy and caveat trackers",
      "Advocate Commissioner field kit",
      "Priority support",
    ],
  },
  {
    name: "Business",
    price: "₹499",
    period: "/ month",
    description: "For firms — shared chambers, multi-user and client management.",
    highlighted: false,
    features: [
      "Everything in Pro",
      "Multi-user firm chambers",
      "Associate management and assignment",
      "Shared case files and calendars",
      "Client-level fee tracking",
      "Admin dashboard",
      "Dedicated support",
    ],
  },
];

/* ----- Feature comparison matrix ----- */

const MATRIX = [
  {
    area: "Practice",
    rows: [
      { label: "Court diary and hearing reminders", free: true, pro: true, business: true },
      { label: "Case dossiers, parties and clients", free: true, pro: true, business: true },
      { label: "Daily tasks", free: true, pro: true, business: true },
    ],
  },
  {
    area: "Tools and research",
    rows: [
      { label: "Legal calculators and stamp values", free: true, pro: true, business: true },
      { label: "Bare acts, templates and dictionaries", free: true, pro: true, business: true },
      { label: "CaseFlow AI legal assistant", free: false, pro: true, business: true },
      { label: "PDF and e-filing document tools", free: false, pro: true, business: true },
    ],
  },
  {
    area: "Courts",
    rows: [
      { label: "eCourts import, export and backup", free: false, pro: true, business: true },
      { label: "Certified copy and caveat trackers", free: false, pro: true, business: true },
      { label: "Advocate Commissioner field kit", free: false, pro: true, business: true },
    ],
  },
  {
    area: "Firm",
    rows: [
      { label: "Multi-user chambers", free: false, pro: false, business: true },
      { label: "Associate management", free: false, pro: false, business: true },
      { label: "Client-level fee analytics", free: false, pro: false, business: true },
    ],
  },
  {
    area: "Support",
    rows: [
      { label: "Community support", free: true, pro: true, business: true },
      { label: "Priority email support", free: false, pro: true, business: true },
      { label: "Dedicated support", free: false, pro: false, business: true },
    ],
  },
];

const FAQS = [
  { q: "Can I try Pro features for free?", a: "Yes — new accounts get a 14-day Pro trial, no card required." },
  { q: "How do I pay?", a: "UPI, debit card or net banking through Razorpay. We don't store card details." },
  { q: "Can I cancel anytime?", a: "Yes. Cancel from Settings → Subscription. You'll keep Pro features until the billing period ends." },
  { q: "Is there a discount for yearly billing?", a: "Yes — annual plans save roughly two months compared with monthly billing." },
  { q: "What about bar associations?", a: "Bar associations have a separate plan. Visit the Bar Association page for details." },
];

function Cell({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="inline-flex size-6 items-center justify-center rounded-full bg-[var(--product)]/15 text-[var(--product)]">
      <Check className="size-3.5" strokeWidth={3} />
    </span>
  ) : (
    <span className="inline-flex size-6 items-center justify-center rounded-full bg-surface text-muted/40">
      <Minus className="size-3.5" strokeWidth={2} />
    </span>
  );
}

export default async function PricingPage({ params }: Props) {
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
        <div className="container-x relative pb-16 pt-10 md:pb-24">
          <Reveal>
            <p className="eyebrow text-[var(--product)]!" style={{ filter: "brightness(1.4)" }}>Pricing</p>
            <h1 className="display mt-4 text-5xl md:text-7xl">Simple, fair pricing.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl">
              Start free with the essentials. Upgrade when your practice needs more.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ----------------------------- Plan Cards ----------------------------- */}
      <section className="container-x -mt-2 pb-20 md:pb-28">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 80}>
              <div
                className={`relative flex h-full flex-col rounded-4xl border p-7 transition ${
                  plan.highlighted
                    ? "border-[var(--product)]/50 bg-[#0B1020] text-white shadow-[0_20px_60px_-20px_var(--product)]"
                    : "border-line bg-white"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  {plan.badge && (
                    <span className="rounded-full bg-[var(--product)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                      {plan.badge}
                    </span>
                  )}
                </div>
                <p className={`mt-2 text-sm ${plan.highlighted ? "text-white/60" : "text-muted"}`}>{plan.description}</p>
                <div className="mt-6">
                  <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                  <span className={`ml-1 text-sm ${plan.highlighted ? "text-white/50" : "text-muted"}`}>{plan.period}</span>
                </div>
                <ul className="mt-7 grow space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-start gap-3 text-[15px] ${plan.highlighted ? "text-white/80" : ""}`}>
                      <span className={`mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full ${plan.highlighted ? "bg-[var(--product)] text-white" : "bg-[var(--product)]/10 text-[var(--product)]"}`}>
                        <Check className="size-3" strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact?interest=CaseFlow%20demo"
                  className={`mt-8 flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-medium transition ${
                    plan.highlighted
                      ? "bg-white text-forest hover:bg-white/90"
                      : "bg-[var(--product)] text-white hover:brightness-110"
                  }`}
                >
                  Get started <ArrowRight className="size-4" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ----------------------------- Comparison Table ----------------------------- */}
      <section className="bg-surface/70 py-20 md:py-28">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow text-[var(--product)]!">Compare plans</p>
            <h2 className="display mt-4 text-3xl md:text-5xl">Feature-by-feature comparison</h2>
          </Reveal>

          <Reveal className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-line">
                  <th className="py-4 pr-4 text-sm font-medium text-muted">Feature</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold">Free</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-[var(--product)]">Pro</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold">Business</th>
                </tr>
              </thead>
              <tbody>
                {MATRIX.map((section) => (
                  <>
                    <tr key={section.area}>
                      <td colSpan={4} className="pt-8 pb-3 text-xs font-bold uppercase tracking-widest text-muted/60">
                        {section.area}
                      </td>
                    </tr>
                    {section.rows.map((row) => (
                      <tr key={row.label} className="border-b border-line/50">
                        <td className="py-3.5 pr-4 text-[15px]">{row.label}</td>
                        <td className="px-4 py-3.5 text-center"><Cell ok={row.free} /></td>
                        <td className="px-4 py-3.5 text-center"><Cell ok={row.pro} /></td>
                        <td className="px-4 py-3.5 text-center"><Cell ok={row.business} /></td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

      {/* ----------------------------- FAQ ----------------------------- */}
      <section className="container-x py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <Reveal>
            <p className="eyebrow text-[var(--product)]!">FAQ</p>
            <h2 className="display mt-4 text-3xl md:text-5xl">Pricing, answered.</h2>
          </Reveal>
          <Reveal className="divide-y divide-line">
            {FAQS.map((faq) => (
              <details key={faq.q} className="group py-5 first:pt-0">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium tracking-tight [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-surface transition group-open:rotate-45 group-open:bg-[var(--product)] group-open:text-white">
                    <Plus className="size-4" />
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl pr-12 text-[15px] leading-relaxed text-muted">{faq.a}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ----------------------------- Bar CTA ----------------------------- */}
      <section className="container-x pb-24 md:pb-32">
        <Reveal>
          <div className="rounded-4xl border border-line bg-surface/50 p-8 md:flex md:items-center md:justify-between md:p-12">
            <div>
              <p className="eyebrow text-[var(--product)]!">Bar Associations</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">Need a plan for your entire bar association?</h3>
              <p className="mt-2 max-w-lg text-[15px] text-muted">Digital membership cards, notices, elections and events — all inside CaseFlow.</p>
            </div>
            <Link
              href={`/products/${slug}/bar`}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--product)] px-7 py-4 font-medium text-white transition hover:brightness-110 md:mt-0"
            >
              Bar Association plans <ArrowRight className="size-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
