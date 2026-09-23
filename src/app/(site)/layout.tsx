import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getItems, getSettings } from "@/lib/site";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, services] = await Promise.all([getSettings(), getItems("services")]);
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-forest focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      {settings.announcementEnabled && settings.announcementText && (
        <div className="bg-forest text-white">
          <div className="container-x flex h-10 items-center justify-center text-sm">
            <Link href={settings.announcementLink || "/"} className="group inline-flex items-center gap-2 text-white/85 hover:text-white">
              <span className="size-1.5 rounded-full bg-mint" />
              {settings.announcementText}
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      )}
      <Header brandName={settings.brandName} logoImage={settings.logoImage} />
      <main id="main">{children}</main>
      <Footer settings={settings} services={services} />
    </>
  );
}
