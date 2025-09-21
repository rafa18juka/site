import { Metadata } from "next";
import { Suspense } from "react";
import { ModelCatalog } from "@/components/sections/model-catalog";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Catálogo de sofás sob medida",
  description: "Explore sofás, divãs e poltronas sob medida Ralph Couch com filtros por formato, tecido e acabamento.",
  alternates: {
    canonical: `${BRAND.seo.siteUrl}/modelos`
  }
};

export default function ModelosPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Carregando catalogo...</div>}>
      <ModelCatalog />
    </Suspense>
  );
}

