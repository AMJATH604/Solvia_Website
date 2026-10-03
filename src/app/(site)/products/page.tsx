import type { Metadata } from "next";
import { ProductFeature } from "@/components/site/ProductFeature";
import { CtaBand, PageHero } from "@/components/site/ui";
import { getItems, getPage } from "@/lib/site";

export const metadata: Metadata = { title: "Products" };

export default async function ProductsPage() {
  const [pages, home, products] = await Promise.all([getPage("pages"), getPage("home"), getItems("products")]);
  return (
    <>
      <PageHero eyebrow={pages.productsEyebrow} title={pages.productsTitle} intro={pages.productsIntro} />
      <section className="container-x space-y-6 pb-8">
        {products.length ? (
          products.map((p) => <ProductFeature key={p.id} product={p} />)
        ) : (
          <p className="rounded-4xl border border-dashed border-line p-12 text-center text-muted">Products are coming soon.</p>
        )}
      </section>
      <CtaBand title={home.ctaTitle} text={home.ctaText} label={home.ctaPrimaryLabel} href={home.ctaPrimaryLink} />
    </>
  );
}
