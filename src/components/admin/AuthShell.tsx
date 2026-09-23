import Link from "next/link";
import { Wordmark } from "@/components/brand/Logo";

const ITEMS = ["Edit every page, live", "Publish case studies & articles", "Manage enquiries in one inbox", "Upload images & documents"];

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-forest p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="bg-grid-dark mask-fade pointer-events-none absolute inset-0" />
        <div className="glow pointer-events-none absolute -bottom-40 -left-20 h-[520px] w-[640px] opacity-60" />
        <Link href="/" className="relative w-fit">
          <Wordmark tone="light" className="text-[30px]" />
        </Link>
        <div className="relative">
          <p className="text-[13px] font-medium tracking-[0.08em] text-mint uppercase">Admin console</p>
          <h2 className="mt-4 max-w-md text-[44px] leading-[1.05] font-semibold tracking-[-0.03em]">
            Everything on your site, one place to change it.
          </h2>
          <ul className="mt-10 space-y-3.5">
            {ITEMS.map((t) => (
              <li key={t} className="flex items-center gap-3 text-[15px] text-white/75">
                <svg viewBox="0 0 24 24" className="size-5 shrink-0" aria-hidden="true">
                  <circle cx="12" cy="12" r="12" fill="var(--accent)" />
                  <path d="M7 12.5 L10.5 16 L17 8.5" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-[13px] text-white/40">Solvia Technologies Pvt Ltd</p>
      </div>
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-[380px]">
          <Link href="/" className="mb-10 inline-block lg:hidden">
            <Wordmark className="text-[28px]" />
          </Link>
          <h1 className="text-[28px] font-semibold tracking-tight">{title}</h1>
          <p className="mt-1.5 mb-8 text-muted">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
