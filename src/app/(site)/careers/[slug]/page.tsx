import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Briefcase, Clock, MapPin, Send } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { Prose } from "@/components/site/ui";
import { markdownToHtml } from "@/lib/markdown";
import { getItems, getSettings } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = (await getItems("careers")).find((j) => j.slug === slug);
  return job ? { title: job.title, description: job.summary } : {};
}

export default async function JobPage({ params }: Props) {
  const { slug } = await params;
  const [jobs, settings] = await Promise.all([getItems("careers"), getSettings()]);
  const job = jobs.find((j) => j.slug === slug);
  if (!job) notFound();
  const email = job.applyEmail || settings.email;
  const apply = email ? `mailto:${email}?subject=${encodeURIComponent(`Application: ${job.title}`)}` : "/contact";

  return (
    <section className="container-x pt-10 pb-24 md:pt-16 md:pb-32">
      <Link href="/careers" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" /> All roles
      </Link>
      <div className="mt-10 grid gap-14 lg:grid-cols-[1.6fr_1fr]">
        <Reveal>
          <p className="eyebrow">{job.department}</p>
          <h1 className="display mt-4 text-5xl md:text-7xl">{job.title}</h1>
          {job.summary && <p className="mt-6 max-w-2xl text-xl leading-relaxed text-muted">{job.summary}</p>}
          <Prose html={markdownToHtml(job.body)} className="mt-12" />
        </Reveal>
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-4xl border border-line p-7">
            <ul className="space-y-4 text-[15px]">
              {job.location && (
                <li className="flex items-center gap-3">
                  <MapPin className="size-4 text-brand" /> {job.location}
                </li>
              )}
              {job.type && (
                <li className="flex items-center gap-3">
                  <Briefcase className="size-4 text-brand" /> {job.type}
                </li>
              )}
              {job.experience && (
                <li className="flex items-center gap-3">
                  <Clock className="size-4 text-brand" /> {job.experience}
                </li>
              )}
            </ul>
            <a
              href={apply}
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-4 font-medium text-white transition hover:brightness-110"
            >
              Apply for this role <Send className="size-4" />
            </a>
            {email && <p className="mt-3 text-center text-sm text-muted">or email {email}</p>}
          </div>
        </aside>
      </div>
    </section>
  );
}
