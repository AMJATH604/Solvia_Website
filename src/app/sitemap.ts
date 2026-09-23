import type { MetadataRoute } from "next";
import { getItems, siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const staticPaths = ["", "/services", "/solutions", "/work", "/insights", "/about", "/careers", "/contact"];
  const [services, work, insights, careers] = await Promise.all([
    getItems("services"),
    getItems("work"),
    getItems("insights"),
    getItems("careers"),
  ]);
  const detail = [
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
