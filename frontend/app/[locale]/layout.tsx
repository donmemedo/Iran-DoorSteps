import type { Metadata, Viewport } from "next";
import { Vazirmatn, Sora } from "next/font/google";
import { notFound } from "next/navigation";

import "../globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { getDict, isRtl, locales, type Locale } from "@/lib/i18n";

const vazir = Vazirmatn({ subsets: ["arabic", "latin"], variable: "--font-body", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--font-display-en", display: "swap" });

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f5f2" },
    { media: "(prefers-color-scheme: dark)", color: "#07070b" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = getDict(locale as Locale);
  return {
    title: { default: `${t.brand} — ${t.tagline}`, template: `%s · ${t.brand}` },
    description: t.hero.lead,
    applicationName: t.brand,
    manifest: "/manifest.webmanifest",
    appleWebApp: { capable: true, title: t.brand, statusBarStyle: "black-translucent" },
    openGraph: { title: `${t.brand} — ${t.tagline}`, description: t.hero.lead, type: "website" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!locales.includes(raw as Locale)) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);
  const rtl = isRtl(locale);

  return (
    <html
      lang={locale}
      dir={rtl ? "rtl" : "ltr"}
      suppressHydrationWarning
      className={`${vazir.variable} ${sora.variable}`}
      style={{ ["--font-heading" as string]: rtl ? "var(--font-body)" : "var(--font-display-en)" }}
    >
      <head>
        <noscript>
          {/* without JS the reveal animations never run — keep the content visible */}
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="noise relative min-h-dvh antialiased">
        <ThemeProvider>
          <Header locale={locale} t={t} />
          <main className="relative z-10 pt-20">{children}</main>
          <Footer locale={locale} t={t} />
        </ThemeProvider>
      </body>
    </html>
  );
}
