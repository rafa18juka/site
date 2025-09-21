import { BRAND } from "@/lib/constants";
import type { DefaultSeoProps, NextSeoProps } from "next-seo";

export const defaultSEO: DefaultSeoProps = {
  titleTemplate: `%s | ${BRAND.name}`,
  defaultTitle: `${BRAND.name} â€“ SofÃ¡s sob medida` as const,
  description: BRAND.seo.defaultDescription,
  canonical: BRAND.seo.siteUrl,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: BRAND.seo.siteUrl,
    siteName: BRAND.name,
    images: [
      {
        url: `${BRAND.seo.siteUrl}/assets/opengraph.jpg`,
        width: 1200,
        height: 630,
        alt: `${BRAND.name} â€“ SofÃ¡s sob medida`
      }
    ]
  },
  twitter: {
    handle: "@ralph_couch",
    site: "@ralph_couch",
    cardType: "summary_large_image"
  },
  additionalMetaTags: [
    {
      name: "keywords",
      content: BRAND.seo.keywords.join(", ")
    }
  ]
};

export function productSEO({
  name,
  description,
  images,
  slug
}: {
  name: string;
  description: string;
  images: string[];
  slug: string;
}): NextSeoProps {
  const url = `${BRAND.seo.siteUrl}/modelos/${slug}`;
  return {
    title: `${name} sob medida` as const,
    description,
    canonical: url,
    openGraph: {
      type: "product",
      url,
      title: `${name} â€“ Ralph Couch`,
      description,
      images: images.map((imageUrl) => ({
        url: imageUrl,
        alt: `${name} Ralph Couch`,
        width: 1200,
        height: 900
      }))
    },
  };
}
