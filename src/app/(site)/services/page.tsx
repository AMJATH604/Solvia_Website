import type { Metadata } from "next";
import { CtaBand, PageHero, ServiceCard } from "@/components/site/ui";
import { getItems, getPage } from "@/lib/site";

export const metadata: Metadata = { title: "Services" };

export default async function ServicesPage() {
  const [pages, home, services] = await Promise.all([getPage("pages"), getPage("home"), getItems("services")]);
  return (
    <>
      <PageHero eyebrow={pages.servicesEyebrow} title={pages.servicesTitle} intro={pages.servicesIntro} />
      <section className="container-x pb-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} />
          ))}
        </div>
      </section>
      <CtaBand title={home.ctaTitle} text={home.ctaText} label={home.ctaPrimaryLabel} href={home.ctaPrimaryLink} />
    </>
  );
}
