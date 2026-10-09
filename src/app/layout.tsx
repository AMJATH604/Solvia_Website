import type { Metadata, Viewport } from "next";
import "@fontsource-variable/outfit";
import "./globals.css";
import { getSettings, safeColor, siteUrl } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const s = await getSettings();
    const title = s?.seoTitle || s?.companyName || "Solvia Technologies";
    let metaBase: URL;
    try {
      metaBase = new URL(siteUrl());
    } catch {
      metaBase = new URL("https://solviatechnologies.in");
    }
    return {
      metadataBase: metaBase,
      title: { default: title, template: `%s — ${s?.brandName || "Solvia"}` },
      description: s?.seoDescription,
      applicationName: s?.brandName,
      openGraph: {
        type: "website",
        siteName: s?.companyName,
        title,
        description: s?.seoDescription,
        images: s?.ogImage ? [{ url: s.ogImage }] : undefined,
      },
      twitter: { card: "summary_large_image", title, description: s?.seoDescription },
      icons: {
        icon: [
          { url: "/favicon.ico", sizes: "any" },
          { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
          { url: "/icon.svg", type: "image/svg+xml" },
          { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        ],
        apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
        shortcut: "/favicon.ico",
      },
    };
  } catch (err) {
    console.error("[Layout] generateMetadata error:", err);
    return {
      title: "Solvia Technologies",
      icons: { icon: "/favicon.ico" },
    };
  }
}

export const viewport: Viewport = {
  themeColor: "#0C1A14",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let accent = "#0EA66E";
  try {
    const s = await getSettings();
    accent = safeColor(s?.accentColor, "#0EA66E");
  } catch (err) {
    console.error("[Layout] RootLayout getSettings error:", err);
  }
  return (
    <html lang="en">
      <head>
        <style>{`:root{--accent:${accent}}`}</style>
      </head>
      <body className="min-h-dvh bg-canvas text-ink">{children}</body>
    </html>
  );
}
