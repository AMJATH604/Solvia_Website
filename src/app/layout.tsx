import type { Metadata, Viewport } from "next";
import "@fontsource-variable/outfit";
import "./globals.css";
import { getSettings, safeColor, siteUrl } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const title = s.seoTitle || s.companyName || "Solvia Technologies";
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: title, template: `%s — ${s.brandName || "Solvia"}` },
    description: s.seoDescription,
    applicationName: s.brandName,
    openGraph: {
      type: "website",
      siteName: s.companyName,
      title,
      description: s.seoDescription,
      images: s.ogImage ? [{ url: s.ogImage }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description: s.seoDescription },
    icons: { icon: "/icon.svg" },
  };
}

export const viewport: Viewport = {
  themeColor: "#0C1A14",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  const accent = safeColor(s.accentColor);
  return (
    <html lang="en">
      <head>
        <style>{`:root{--accent:${accent}}`}</style>
      </head>
      <body className="min-h-dvh bg-canvas text-ink">{children}</body>
    </html>
  );
}
