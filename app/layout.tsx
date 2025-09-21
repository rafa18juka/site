import "@/app/globals.css";

import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { PropsWithChildren } from "react";
import { Providers } from "@/components/layout/providers";
import { BRAND } from "@/lib/constants";

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display"
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.seo.siteUrl),
  title: {
    default: `${BRAND.name} – Sofás sob medida`,
    template: `%s | ${BRAND.name}`
  },
  description: BRAND.seo.defaultDescription,
  applicationName: BRAND.name,
  authors: [{ name: BRAND.name }],
  keywords: [...BRAND.seo.keywords],
  alternates: {
    canonical: BRAND.seo.siteUrl
  },
  openGraph: {
    title: `${BRAND.name} – Sofás sob medida`,
    description: BRAND.seo.defaultDescription,
    url: BRAND.seo.siteUrl,
    siteName: BRAND.name,
    images: [
      {
        url: `${BRAND.seo.siteUrl}/assets/opengraph.jpg`,
        width: 1200,
        height: 630
      }
    ],
    locale: "pt_BR",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    creator: "@ralph_couch"
  },
  icons: {
    icon: "/favicon.ico"
  }
};

export const viewport: Viewport = {
  themeColor: "#f9f6f1"
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

