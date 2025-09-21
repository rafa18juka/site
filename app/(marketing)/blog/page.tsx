import type { Metadata } from "next";
import { BlogList } from "@/components/sections/blog-list";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Blog Ralph Couch",
  description: "Dicas de tecidos, formatos e cuidados para sofás sob medida Ralph Couch.",
  alternates: {
    canonical: `${BRAND.seo.siteUrl}/blog`
  }
};

export default function BlogPage() {
  return <BlogList />;
}