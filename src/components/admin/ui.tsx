import Link from "next/link";

export const inputCls =
  "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ink/35 outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10 disabled:bg-surface";

export function PageHeader({
  title,
  description,
  actions,
  breadcrumb,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumb?: { href: string; label: string }[];
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {breadcrumb && (
          <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-1.5 text-[13px] text-muted">
            {breadcrumb.map((b, i) => (
              <span key={b.href} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-ink/25">/</span>}
                <Link href={b.href} className="hover:text-ink">
                  {b.label}
                </Link>
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-[26px] font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-white ${className}`}>{children}</div>;
}

const badgeTones = {
  green: "bg-brand/10 text-[#0a7a51]",
  gray: "bg-ink/[0.06] text-ink/60",
  amber: "bg-amber-100 text-amber-800",
  blue: "bg-sky-100 text-sky-800",
  dark: "bg-forest text-white",
};

export function Badge({ children, tone = "gray" }: { children: React.ReactNode; tone?: keyof typeof badgeTones }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-medium ${badgeTones[tone]}`}>
      {children}
    </span>
  );
}

export function btn(variant: "primary" | "secondary" | "ghost" | "danger" | "dark" = "secondary", size: "sm" | "md" = "md") {
  const v = {
    primary: "bg-brand text-white hover:brightness-110 shadow-sm",
    dark: "bg-forest text-white hover:bg-black",
    secondary: "bg-white text-ink ring-1 ring-line hover:bg-surface",
    ghost: "text-ink/70 hover:bg-ink/[0.05] hover:text-ink",
    danger: "bg-white text-red-600 ring-1 ring-red-200 hover:bg-red-50",
  }[variant];
  const s = size === "sm" ? "h-8 px-3 text-[13px] gap-1.5" : "h-10 px-4 text-[14px] gap-2";
  return `inline-flex items-center justify-center rounded-xl font-medium transition disabled:opacity-50 disabled:pointer-events-none ${v} ${s}`;
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-white px-6 py-16 text-center">
      <svg viewBox="0 0 100 100" className="size-12 opacity-90" aria-hidden="true">
        <rect width="100" height="100" rx="26" fill="var(--accent)" opacity="0.12" />
        <path d="M29 52 L44 67 L72 33" fill="none" stroke="var(--accent)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p className="mt-4 font-semibold">{title}</p>
      {text && <p className="mt-1 max-w-sm text-muted">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function timeAgo(iso?: string) {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
