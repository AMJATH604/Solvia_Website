import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { getPage, getSettings, list } from "@/lib/site";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const [pages, s] = await Promise.all([getPage("pages"), getSettings()]);
  const channels = [
    s.email && { icon: Mail, label: "Email", value: s.email, href: `mailto:${s.email}` },
    s.phone && { icon: Phone, label: "Phone", value: s.phone, href: `tel:${String(s.phone).replace(/\s/g, "")}` },
    s.whatsapp && { icon: MessageCircle, label: "WhatsApp", value: "Chat with us", href: `https://wa.me/${String(s.whatsapp).replace(/\D/g, "")}` },
    s.address && { icon: MapPin, label: "Office", value: s.address, href: s.mapLink || undefined },
    s.hours && { icon: Clock, label: "Hours", value: s.hours },
  ].filter(Boolean) as { icon: typeof Mail; label: string; value: string; href?: string }[];

  return (
    <section className="relative overflow-hidden">
      <div className="bg-grid mask-fade pointer-events-none absolute inset-0" />
      <div className="glow pointer-events-none absolute -top-40 left-0 h-80 w-[640px] opacity-25" />
      <div className="container-x relative grid gap-14 pt-16 pb-24 md:pt-24 md:pb-32 lg:grid-cols-[1fr_1.3fr]">
        <Reveal>
          <p className="eyebrow">{pages.contactEyebrow}</p>
          <h1 className="display mt-5 text-5xl md:text-7xl">{pages.contactTitle}</h1>
          {pages.contactIntro && <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">{pages.contactIntro}</p>}
          <ul className="mt-12 space-y-3">
            {channels.map((c) => {
              const body = (
                <>
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                    <c.icon className="size-5" />
                  </span>
                  <span>
                    <span className="block text-sm text-muted">{c.label}</span>
                    <span className="block font-medium whitespace-pre-line">{c.value}</span>
                  </span>
                </>
              );
              return (
                <li key={c.label}>
                  {c.href ? (
                    <a
                      href={c.href}
                      {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="flex items-start gap-4 rounded-3xl border border-transparent p-3 transition hover:border-line hover:bg-white"
                    >
                      {body}
                    </a>
                  ) : (
                    <div className="flex items-start gap-4 p-3">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </Reveal>
        <Reveal delay={120}>
          <ContactForm
            services={list<string>(pages.contactServices)}
            budgets={list<string>(pages.contactBudgets)}
            success={pages.contactSuccess || "Thanks — we'll be in touch soon."}
          />
        </Reveal>
      </div>
    </section>
  );
}
