"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

export const NAV = [
  { href: "/services", label: "Services" },
  { href: "/solutions", label: "Solutions" },
  { href: "/work", label: "Work" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "Company" },
  { href: "/careers", label: "Careers" },
];

export function Header({ brandName, logoImage }: { brandName?: string; logoImage?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled || open
          ? "border-b border-line/80 bg-white/80 shadow-[0_1px_0_rgba(12,26,20,0.02),0_8px_24px_-12px_rgba(12,26,20,0.08)] backdrop-blur-xl"
          : "border-b border-transparent bg-white/0"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between gap-6 md:h-[72px]">
        <Link href="/" className="shrink-0 rounded-md" aria-label={`${brandName || "Solvia"} home`}>
          <Logo logoImage={logoImage} brandName={brandName} className="text-[27px]" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-3.5 py-2 text-[15px] transition-colors ${
                isActive(item.href) ? "bg-surface text-ink" : "text-ink/70 hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/contact"
            className="group hidden items-center gap-1.5 rounded-full bg-forest px-5 py-2.5 text-[15px] font-medium text-white transition hover:bg-black sm:inline-flex"
          >
            Get in touch
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-11 items-center justify-center rounded-full text-ink hover:bg-surface lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="h-[calc(100dvh-64px)] overflow-y-auto border-t border-line bg-white lg:hidden">
          <nav aria-label="Mobile" className="container-x flex flex-col py-6">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between border-b border-line py-4 text-2xl font-medium tracking-tight ${
                  isActive(item.href) ? "text-brand" : "text-ink"
                }`}
              >
                {item.label}
                <ArrowUpRight className="size-5 text-ink/30" />
              </Link>
            ))}
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-4 text-lg font-medium text-white"
            >
              Get in touch <ArrowUpRight className="size-5" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
