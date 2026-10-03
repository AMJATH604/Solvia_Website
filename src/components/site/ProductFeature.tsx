import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Doc } from "@/lib/site";
import { safeColor } from "@/lib/site";
import { ProductScreen } from "./ProductMockups";
import { Reveal } from "./Reveal";

/** Large dark product card used on the home page and the products index. */
export function ProductFeature({ product }: { product: Doc }) {
  const accent = safeColor(product.accentColor, "#2563EB");
  const platforms: string[] = Array.isArray(product.platforms) ? product.platforms : [];
  return (
    <Reveal>
      <Link
        href={`/products/${product.slug}`}
        className="group relative grid overflow-hidden rounded-5xl bg-[#0B1020] text-white lg:grid-cols-[1.1fr_1fr]"
        style={{ "--product": accent } as React.CSSProperties}
      >
        <div className="bg-grid-dark pointer-events-none absolute inset-0 opacity-70" />
        <div
          className="pointer-events-none absolute -top-32 right-0 h-[480px] w-[620px] opacity-50 blur-3xl"
          style={{ background: `radial-gradient(closest-side, ${accent}, transparent)` }}
        />
        <div className="relative flex flex-col p-8 md:p-14">
          <div className="flex items-center gap-3">
            {product.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.logo} alt="" className="size-12 rounded-2xl bg-white object-contain p-1" />
            ) : null}
            <div>
              <p className="text-xl font-semibold tracking-tight">{product.name}</p>
              <p className="text-sm text-white/55">{product.tagline}</p>
            </div>
            {product.status && (
              <span className="ml-auto rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-white/80">
                <span className="mr-1.5 inline-block size-1.5 rounded-full bg-emerald-400 align-middle" />
                {product.status}
              </span>
            )}
          </div>
          <h3 className="display mt-10 text-4xl md:text-[52px]">{product.headline}</h3>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/65">{product.summary}</p>
          {platforms.length > 0 && (
            <ul className="mt-7 flex flex-wrap gap-2">
              {platforms.map((p) => (
                <li key={p} className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">
                  {p}
                </li>
              ))}
            </ul>
          )}
          <span className="mt-10 inline-flex w-fit items-center gap-2 rounded-full bg-[var(--product)] px-6 py-3.5 font-medium text-white transition group-hover:brightness-110">
            Explore {product.name} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
        <div className="relative hidden items-end justify-center overflow-hidden pt-12 lg:flex">
          <ProductScreen visual="dashboard" className="translate-y-24 transition duration-700 group-hover:translate-y-20" />
        </div>
      </Link>
    </Reveal>
  );
}
