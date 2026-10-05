import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { ProductScreen } from "@/components/site/ProductMockups";
import { Icon } from "@/lib/icons";
import { getItems, list, safeColor, type Doc } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

async function load(slug: string) {
  return (await getItems("products")).find((p) => p.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await load((await params).slug);
  if (!p) return {};
  return {
    title: `Features — ${p.name}`,
    description: `Explore every feature inside ${p.name}: ${list(p.modules).map((m: Doc) => m.title).join(", ")}.`,
  };
}

/* ------------------------------------------------------------------ */
/*  Feature groups — mirrors the CaseFlow website's feature catalogue */
/* ------------------------------------------------------------------ */

const FEATURE_GROUPS = [
  {
    id: "practice",
    title: "Your practice",
    intro: "The diary, the cases and the people — the part of the day you open the app for.",
    items: [
      { name: "Home", line: "Today's hearings, upcoming dates, active cases and clients at a glance." },
      { name: "Court Diary", line: "A month calendar with every hearing marked, and the board for any day." },
      { name: "Legal Repository", line: "Every case dossier with its status, court and next hearing, searchable by title, CNR or client.", detail: "Search by CNR" },
      { name: "Case Dossier", line: "Parties, case number, CNR, court, stage, history and interim orders — one screen per case." },
      { name: "Court Schedule", line: "Your hearings by date, so tomorrow's board is never a surprise." },
      { name: "Daily Tasks", line: "A simple list for the day, next to your hearings." },
      { name: "Client Directory", line: "Every client, their cases and how to reach them." },
    ],
  },
  {
    id: "courts",
    title: "Courts and eCourts",
    intro: "Bring cases in from eCourts, pay fees and track the filings the registry is sitting on.",
    items: [
      { name: "eCourts Import", line: "Import the cases you saved in the eCourts Services app, or restore a CaseFlow backup.", detail: "mycases.txt → CaseFlow" },
      { name: "Export & Backup", line: "Export any case with its complete data." },
      { name: "eCourts ePay", line: "Court fees, fines, judicial deposits and process fees through the official portal." },
      { name: "Court Portals", line: "Certified copies, video conferencing, holiday calendars and fee payment for every state.", detail: "36 states · 600+ districts" },
      { name: "Certified Copies", line: "Track each CC application from box drop to memo, ready and collected." },
      { name: "Caveat Tracker", line: "Caveats with filing and expiry dates, so an ex-parte order never catches you out." },
      { name: "E-Filing", line: "Track your electronic filings and their status." },
    ],
  },
  {
    id: "tools",
    title: "Legal tools",
    intro: "Calculators, reference materials and templates that save a trip to the library.",
    items: [
      { name: "Court Fee Calculator", line: "Tamil Nadu 2017 amendment and 1955 Act schedules with automatic total.", detail: "TN Act V of 2017" },
      { name: "Limitation Calculator", line: "Pick the article and the cause-of-action date — get the deadline instantly." },
      { name: "Delay Condonation", line: "Section 5 delay worked out for your condonation petition." },
      { name: "Interest Calculator", line: "Simple and compound interest, with period and amount." },
      { name: "Maintenance Calculator", line: "Section 125 CrPC maintenance estimation." },
      { name: "MACT Calculator", line: "Motor accident tribunal compensation with multiplier table." },
      { name: "Partition Share", line: "Hindu and Muslim succession share calculations." },
      { name: "Stamp Value Lookup", line: "Document-level stamp duty values for your state." },
    ],
  },
  {
    id: "research",
    title: "Research and reference",
    intro: "AI help, bare acts and the reference shelf — offline where it matters.",
    items: [
      { name: "CaseFlow AI", line: "Ask a legal question in plain language, or photograph an order and let AI summarise it." },
      { name: "Legal Pulse", line: "A daily feed of Supreme Court and High Court news." },
      { name: "Bare Acts", line: "16 bare acts readable offline, with section search." },
      { name: "Legal Dictionary", line: "502 legal terms explained in plain English." },
      { name: "Drafting Templates", line: "Ready-made templates for common petitions and applications." },
    ],
  },
  {
    id: "commissioner",
    title: "Advocate Commissioner",
    intro: "The complete field kit for court-appointed commissions.",
    items: [
      { name: "Site Check-in", line: "GPS-stamped start and end with duration recorded automatically." },
      { name: "Evidence Photos", line: "Each photo carries location metadata and a SHA-256 fingerprint." },
      { name: "Sketch Tool", line: "Draw site sketches on the phone and attach them to the visit." },
      { name: "Notes & Witnesses", line: "Record observations, measurements and witness statements on-site." },
      { name: "Expenses", line: "Track commission-related expenses for the final report." },
    ],
  },
  {
    id: "team",
    title: "Firm and network",
    intro: "Digital chambers for your firm and the professional network around it.",
    items: [
      { name: "Chambers", line: "A shared workspace for your firm — cases, hearings and tasks in one view." },
      { name: "Recruit Associates", line: "Invite juniors and assign cases to them." },
      { name: "Advocate Directory", line: "Find advocates by court, specialisation or location." },
      { name: "My Bar", line: "Your bar association's membership card, notices and events." },
    ],
  },
];

export default async function FeaturesPage({ params }: Props) {
  const { slug } = await params;
  const p = await load(slug);
  if (!p) notFound();

  const accent = safeColor(p.accentColor, "#2563EB");
  const totalFeatures = FEATURE_GROUPS.reduce((n, g) => n + g.items.length, 0);

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
            <p className="eyebrow text-[var(--product)]!" style={{ filter: "brightness(1.4)" }}>Features</p>
            <h1 className="display mt-4 text-5xl md:text-7xl">Everything an advocate&rsquo;s day asks for.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl">
              {totalFeatures} screens from the {p.name} app — the diary and the dossier, eCourts, the legal tools,
              research, your team and the commissioner&rsquo;s field kit.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ----------------------------- Feature Groups ----------------------------- */}
      {FEATURE_GROUPS.map((group, gi) => (
        <section key={group.id} className={gi % 2 === 0 ? "" : "bg-surface/70"}>
          <div className="container-x py-20 md:py-28">
            <Reveal>
              <p className="eyebrow text-[var(--product)]!">{group.title}</p>
              <h2 className="display mt-4 text-3xl md:text-5xl">{group.title}</h2>
              <p className="mt-4 max-w-2xl text-lg text-muted">{group.intro}</p>
            </Reveal>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item, ii) => (
                <Reveal key={item.name} delay={(ii % 3) * 60}>
                  <div className="group h-full rounded-3xl border border-line bg-white p-6 transition hover:-translate-y-1 hover:border-[var(--product)]/40 hover:shadow-[0_24px_60px_-30px_rgba(11,16,32,0.25)]">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold tracking-tight">{item.name}</h3>
                      {item.detail && (
                        <span className="shrink-0 rounded-full bg-[var(--product)]/10 px-2.5 py-1 text-xs font-medium text-[var(--product)]">
                          {item.detail}
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-[15px] leading-relaxed text-muted">{item.line}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}

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
              <h2 className="display mt-8 text-4xl md:text-6xl">See every feature in action.</h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-white/80">
                Request a demo and our team will walk you through {p.name} — from dashboard to field kit.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <Link
                  href="/contact?interest=CaseFlow%20demo"
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-medium text-forest transition hover:bg-white/90"
                >
                  Request a demo
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href={`/products/${slug}/pricing`}
                  className="inline-flex items-center gap-2 rounded-full px-6 py-4 font-medium text-white ring-1 ring-white/30 transition hover:ring-white/60"
                >
                  View pricing
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
