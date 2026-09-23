import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { CtaBand, Prose } from "@/components/site/ui";
import { markdownToHtml, readingTime } from "@/lib/markdown";
import { formatDate, getItems, getPage } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = (await getItems("insights")).find((p) => p.slug === slug);
  return post ? { title: post.title, description: post.excerpt, openGraph: { type: "article", images: post.cover ? [post.cover] : undefined } } : {};
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const [posts, home] = await Promise.all([getItems("insights"), getPage("home")]);
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <>
      <article className="container-x pt-10 pb-8 md:pt-16">
        <Link href="/insights" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink">
          <ArrowLeft className="size-4" /> All insights
        </Link>
        <Reveal className="mx-auto mt-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
            {post.category && <span className="rounded-full bg-brand/10 px-3 py-1 text-brand">{post.category}</span>}
            <span>{formatDate(post.date)}</span>
            <span>·</span>
            <span>{readingTime(post.body)} min read</span>
          </div>
          <h1 className="display mt-6 text-4xl md:text-6xl">{post.title}</h1>
          {post.excerpt && <p className="mt-6 text-xl leading-relaxed text-muted">{post.excerpt}</p>}
          {post.author && (
            <div className="mt-8 flex items-center gap-3 border-y border-line py-5">
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-forest text-sm font-semibold text-white">
                {String(post.author).charAt(0)}
              </span>
              <div>
                <p className="font-medium">{post.author}</p>
                <p className="text-sm text-muted">Solvia Technologies</p>
              </div>
            </div>
          )}
        </Reveal>
        {post.cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.cover} alt="" className="mx-auto mt-12 aspect-[16/8] w-full max-w-5xl rounded-5xl object-cover" />
        )}
        <div className="mx-auto mt-12 max-w-3xl">
          <Prose html={markdownToHtml(post.body)} />
        </div>
      </article>
      <CtaBand title={home.ctaTitle} text={home.ctaText} label={home.ctaPrimaryLabel} href={home.ctaPrimaryLink} />
    </>
  );
}
