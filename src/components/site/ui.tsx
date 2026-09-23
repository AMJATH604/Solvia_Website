import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Icon } from "@/lib/icons";
import type { Doc } from "@/lib/site";
import { Reveal } from "./Reveal";

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "dark" | "ghost" | "light" | "outline-light";
  size?: "md" | "lg";
  className?: string;
}) {
  const styles = {
    primary: "bg-brand text-white shadow-[0_8px_24px_-8px_color-mix(in_oklab,var(--accent)_70%,transparent)] hover:brightness-110",
    dark: "bg-forest text-white hover:bg-black",
    ghost: "bg-white text-ink ring-1 ring-line hover:ring-ink/25",
    light: "bg-white text-forest hover:bg-mint",
    "outline-light": "text-white ring-1 ring-white/20 hover:ring-white/50",
  }[variant];
  const sizes = size === "lg" ? "px-7 py-4 text-base" : "px-5 py-3 text-[15px]";
  const external = /^https?:/.test(href);
  return (
    <Link
      href={href || "/"}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group inline-flex items-center justify-center gap-2 rounded-full font-medium transition ${styles} ${sizes} ${className}`}
    >
      {children}
      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  dark = false,
  action,
}: {
  eyebrow?: string;
  title?: string;
  intro?: string;
  align?: "left" | "center";
  dark?: boolean;
  action?: React.ReactNode;
}) {
  const center = align === "center";
  return (
    <Reveal
      className={`flex flex-col gap-6 ${center ? "items-center text-center" : action ? "md:flex-row md:items-end md:justify-between" : ""}`}
    >
      <div className="max-w-3xl">
        {eyebrow && <p className={`eyebrow ${dark ? "text-mint" : ""}`}>{eyebrow}</p>}
        {title && (
          <h2 className={`display mt-4 text-4xl md:text-[56px] ${dark ? "text-white" : "text-ink"}`}>{title}</h2>
        )}
        {intro && (
          <p className={`mt-5 max-w-2xl text-lg leading-relaxed ${dark ? "text-white/65" : "text-muted"} ${center ? "mx-auto" : ""}`}>
            {intro}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title?: string;
  intro?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-grid mask-fade pointer-events-none absolute inset-0" />
      <div className="glow pointer-events-none absolute -top-40 left-1/2 h-80 w-[640px] -translate-x-1/2 opacity-30" />
      <div className="container-x relative pt-16 pb-16 md:pt-28 md:pb-24">
        <Reveal className="max-w-4xl">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="display mt-5 text-5xl md:text-[80px]">{title}</h1>
          {intro && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">{intro}</p>}
          {children}
        </Reveal>
      </div>
    </section>
  );
}

export function ServiceCard({ service, index = 0, large = false }: { service: Doc; index?: number; large?: boolean }) {
  return (
    <Reveal delay={index * 70} className={large ? "md:col-span-2" : ""}>
      <Link
        href={`/services/${service.slug}`}
        className={`group relative flex h-full flex-col overflow-hidden rounded-4xl border border-line bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_24px_60px_-28px_rgba(12,26,20,0.35)] md:p-8 ${
          large ? "md:min-h-[300px]" : "md:min-h-[260px]"
        }`}
      >
        <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-brand/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
        <div className="flex items-start justify-between">
          <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-brand/10 text-brand transition group-hover:bg-brand group-hover:text-white">
            <Icon name={service.icon} className="size-6" />
          </span>
          <ArrowUpRight className="size-5 text-ink/25 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
        </div>
        <h3 className={`mt-auto pt-8 font-semibold md:pt-10 tracking-tight text-ink ${large ? "text-3xl" : "text-2xl"}`}>{service.title}</h3>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted">{service.summary}</p>
        {large && Array.isArray(service.capabilities) && service.capabilities.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2">
            {service.capabilities.slice(0, 5).map((c: string) => (
              <li key={c} className="rounded-full bg-surface px-3 py-1 text-[13px] text-ink/70">
                {c}
              </li>
            ))}
          </ul>
        )}
      </Link>
    </Reveal>
  );
}

const COVER_TINTS = [
  "from-[#0C1A14] via-[#0f3a28] to-[#0EA66E]",
  "from-[#0C1A14] via-[#12342b] to-[#1f7a5a]",
  "from-[#0C1A14] via-[#173a2d] to-[#34D399]",
];

export function WorkCover({
  item,
  index = 0,
  className = "",
  showMetric = true,
}: {
  item: Doc;
  index?: number;
  className?: string;
  showMetric?: boolean;
}) {
  if (item.cover) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={item.cover} alt="" className={`h-full w-full object-cover ${className}`} />
    );
  }
  const metric = showMetric && Array.isArray(item.metrics) ? item.metrics[0] : null;
  return (
    <div className={`relative h-full w-full overflow-hidden bg-gradient-to-br ${COVER_TINTS[index % COVER_TINTS.length]} ${className}`}>
      <div className="bg-grid-dark absolute inset-0" />
      <svg viewBox="0 0 100 100" className="absolute -right-6 -bottom-8 size-56 opacity-20" aria-hidden="true">
        <path d="M18 52 L40 74 L84 22" fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {metric && (
        <div className="absolute bottom-6 left-6 text-white">
          <div className="text-5xl font-semibold tracking-tight md:text-6xl">{metric.value}</div>
          <div className="mt-1 text-sm text-white/70">{metric.label}</div>
        </div>
      )}
      {item.industry && (
        <span className="absolute top-5 left-5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/85 backdrop-blur">
          {item.industry}
        </span>
      )}
    </div>
  );
}

export function WorkCard({ item, index = 0 }: { item: Doc; index?: number }) {
  return (
    <Reveal delay={index * 80}>
      <Link href={`/work/${item.slug}`} className="group block">
        <div className="aspect-[4/3] overflow-hidden rounded-4xl">
          <WorkCover item={item} index={index} className="transition duration-700 group-hover:scale-[1.03]" />
        </div>
        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted">{[item.client, item.year].filter(Boolean).join(" · ")}</p>
            <h3 className="mt-1.5 text-xl font-semibold tracking-tight text-ink text-balance md:text-2xl">{item.title}</h3>
          </div>
          <ArrowUpRight className="mt-1 size-5 shrink-0 text-ink/30 transition group-hover:text-brand" />
        </div>
      </Link>
    </Reveal>
  );
}

export function CtaBand({ title, text, label, href }: { title?: string; text?: string; label?: string; href?: string }) {
  return (
    <section className="container-x py-20 md:py-28">
      <Reveal>
        <div className="relative overflow-hidden rounded-5xl bg-forest px-7 py-16 text-center md:px-16 md:py-24">
          <div className="bg-grid-dark mask-fade pointer-events-none absolute inset-0" />
          <div className="glow pointer-events-none absolute -bottom-40 left-1/2 h-96 w-[720px] -translate-x-1/2 opacity-60" />
          <div className="relative mx-auto max-w-3xl">
            <svg viewBox="0 0 100 100" className="draw-check mx-auto size-16" aria-hidden="true">
              <rect width="100" height="100" rx="26" fill="var(--accent)" />
              <path d="M29 52 L44 67 L72 33" pathLength={1} fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h2 className="display mt-8 text-4xl text-white md:text-6xl">{title}</h2>
            {text && <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/65">{text}</p>}
            {label && (
              <div className="mt-10 flex justify-center">
                <ButtonLink href={href || "/contact"} variant="light" size="lg">
                  {label}
                </ButtonLink>
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function Tags({ items, dark = false }: { items?: unknown; dark?: boolean }) {
  if (!Array.isArray(items) || !items.length) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((t) => (
        <li
          key={String(t)}
          className={`rounded-full px-3.5 py-1.5 text-sm ${dark ? "bg-white/10 text-white/80" : "border border-line bg-white text-ink/75"}`}
        >
          {String(t)}
        </li>
      ))}
    </ul>
  );
}

export function Prose({ html, className = "" }: { html: string; className?: string }) {
  return <div className={`prose ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
