import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { ButtonLink, CtaBand, Prose, ServiceCard, Tags } from "@/components/site/ui";
import { Icon } from "@/lib/icons";
import { markdownToHtml } from "@/lib/markdown";
import { getItems, getPage, list } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

async function load(slug: string) {
  const services = await getItems("services");
  return { services, service: services.find((s) => s.slug === slug) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service } = await load((await params).slug);
  return service ? { title: service.title, description: service.summary } : {};
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const [{ services, service }, home] = await Promise.all([load(slug), getPage("home")]);
  if (!service) notFound();
  const others = services.filter((s) => s.id !== service.id).slice(0, 3);
  const deliverables = list(service.deliverables).filter((d) => d.title);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="bg-grid mask-fade pointer-events-none absolute inset-0" />
        <div className="glow pointer-events-none absolute -top-40 right-0 h-80 w-[640px] opacity-25" />
        <div className="container-x relative pt-10 pb-16 md:pt-16 md:pb-24">
          <Link href="/services" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink">
            <ArrowLeft className="size-4" /> All services
          </Link>
          <Reveal className="mt-10 max-w-4xl">
            <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-brand text-white">
              <Icon name={service.icon} className="size-7" />
            </span>
            <h1 className="display mt-8 text-5xl md:text-[80px]">{service.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">{service.summary}</p>
            <div className="mt-10">
              <ButtonLink href="/contact" size="lg">
                Discuss your project
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-x grid gap-14 pb-16 lg:grid-cols-[1.6fr_1fr]">
        <Reveal>
          <Prose html={markdownToHtml(service.body)} />
        </Reveal>
        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          {list<string>(service.capabilities).length > 0 && (
            <div className="rounded-4xl border border-line p-7">
              <h2 className="font-semibold">Capabilities</h2>
              <ul className="mt-4 space-y-3">
                {list<string>(service.capabilities).map((c) => (
                  <li key={c} className="flex items-center gap-3 text-[15px] text-ink/80">
                    <span className="inline-flex size-5 items-center justify-center rounded-full bg-brand/10 text-brand">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {list(service.technologies).length > 0 && (
            <div className="rounded-4xl border border-line p-7">
              <h2 className="mb-4 font-semibold">Technologies</h2>
              <Tags items={service.technologies} />
            </div>
          )}
        </aside>
      </section>

      {deliverables.length > 0 && (
        <section className="container-x py-16">
          <div className="rounded-5xl bg-forest p-7 text-white md:p-14">
            <h2 className="display text-3xl md:text-5xl">What you get</h2>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {deliverables.map((d, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div className="h-full rounded-3xl border border-white/10 bg-white/[0.04] p-7">
                    <span className="text-sm text-mint">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="mt-6 text-xl font-semibold">{d.title}</h3>
                    <p className="mt-2 text-[15px] text-white/60">{d.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section className="container-x py-16">
          <h2 className="display text-3xl md:text-4xl">Other services</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {others.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={i} />
            ))}
          </div>
        </section>
      )}

      <CtaBand title={home.ctaTitle} text={home.ctaText} label={home.ctaPrimaryLabel} href={home.ctaPrimaryLink} />
    </>
  );
}
