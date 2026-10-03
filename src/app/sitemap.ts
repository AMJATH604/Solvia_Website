import type { MetadataRoute } from "next";
import { getItems, siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const staticPaths = ["", "/products", "/services", "/solutions", "/work", "/insights", "/about", "/careers", "/contact"];
  const [products, services, work, insights, careers] = await Promise.all([
    getItems("products"),
    getItems("services"),
    getItems("work"),
    getItems("insights"),
    getItems("careers"),
  ]);
  const detail = [
    ...products.map((i) => ({ path: `/products/${i.slug}`, updated: i.updatedAt })),
    ...services.map((i) => ({ path: `/services/${i.slug}`, updated: i.updatedAt })),
    ...work.map((i) => ({ path: `/work/${i.slug}`, updated: i.updatedAt })),
    ...insights.map((i) => ({ path: `/insights/${i.slug}`, updated: i.updatedAt })),
    ...careers.map((i) => ({ path: `/careers/${i.slug}`, updated: i.updatedAt })),
  ];
  return [
    ...staticPaths.map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly" as const, priority: p ? 0.8 : 1 })),
    ...detail.map((d) => ({ url: `${base}${d.path}`, lastModified: d.updated, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
