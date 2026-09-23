import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import type { Doc } from "@/lib/site";
import { SocialLinks } from "./Social";

export function Footer({ settings, services }: { settings: Doc; services: Doc[] }) {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-forest text-white">
      <div className="bg-grid-dark mask-fade pointer-events-none absolute inset-0 opacity-60" />
      <div className="container-x relative pt-20 pb-10 md:pt-24">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo logoImage={settings.logoImage} brandName={settings.brandName} tone="light" className="text-[34px]" />
            {settings.footerBlurb && (
              <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/60">{settings.footerBlurb}</p>
            )}
            <SocialLinks settings={settings} className="mt-7" />
          </div>

          <div className="md:col-span-2">
            <h2 className="text-sm font-medium text-white/40">Services</h2>
            <ul className="mt-4 space-y-3 text-[15px]">
              {services.slice(0, 6).map((s) => (
                <li key={s.id}>
                  <Link href={`/services/${s.slug}`} className="text-white/75 transition hover:text-white">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h2 className="text-sm font-medium text-white/40">Company</h2>
            <ul className="mt-4 space-y-3 text-[15px]">
              {[
                ["/about", "About"],
                ["/solutions", "Solutions"],
                ["/work", "Work"],
                ["/insights", "Insights"],
                ["/careers", "Careers"],
                ["/contact", "Contact"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-white/75 transition hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h2 className="text-sm font-medium text-white/40">Get in touch</h2>
            <ul className="mt-4 space-y-3 text-[15px] text-white/75">
              {settings.email && (
                <li>
                  <a href={`mailto:${settings.email}`} className="inline-flex items-center gap-2.5 transition hover:text-white">
                    <Mail className="size-4 text-mint" /> {settings.email}
                  </a>
                </li>
              )}
              {settings.phone && (
                <li>
                  <a href={`tel:${String(settings.phone).replace(/\s/g, "")}`} className="inline-flex items-center gap-2.5 transition hover:text-white">
                    <Phone className="size-4 text-mint" /> {settings.phone}
                  </a>
                </li>
              )}
              {settings.address && (
                <li className="flex gap-2.5">
                  <MapPin className="mt-1 size-4 shrink-0 text-mint" />
                  <span className="whitespace-pre-line">{settings.address}</span>
                </li>
              )}
            </ul>
            <Link
              href="/contact"
              className="group mt-6 inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-[15px] font-medium text-forest transition hover:bg-mint"
            >
              Start a project
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        <div aria-hidden="true" className="pointer-events-none mt-20 select-none overflow-hidden">
          <div className="flex justify-center text-[clamp(84px,22vw,300px)] leading-[0.8] opacity-[0.07]">
            <Logo tone="light" className="" />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/45 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {settings.companyName}. All rights reserved.
          </p>
          {settings.footerNote && <p>{settings.footerNote}</p>}
        </div>
      </div>
    </footer>
  );
}
