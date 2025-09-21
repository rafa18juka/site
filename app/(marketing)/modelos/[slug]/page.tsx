import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";

import { MODELS } from "@/data/models";
import { ModelGallery } from "@/components/model/model-gallery";
import { SpecTable } from "@/components/model/spec-table";
import { VariationsCarousel } from "@/components/model/variations-carousel";
import { FloatingCta } from "@/components/model/floating-cta";
import { BRAND } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ModelPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return MODELS.map((model) => ({ slug: model.slug }));
}

export function generateMetadata({ params }: ModelPageProps): Metadata {
  const model = MODELS.find((item) => item.slug === params.slug);
  if (!model) return {};

  const url = `${BRAND.seo.siteUrl}/modelos/${model.slug}`;

  return {
    title: `${model.nome} sob medida`,
    description: model.descricao,
    alternates: { canonical: url },
    openGraph: {
      title: `${model.nome} sob medida | ${BRAND.name}`,
      description: model.descricao,
      url,
      images: model.imagens.map((image) => ({
        url: `${BRAND.seo.siteUrl}${image.url}`,
        width: image.width ?? 1200,
        height: image.height ?? 900,
        alt: image.alt ?? model.nome
      }))
    }
  };
}

export default function ModelDetailPage({ params }: ModelPageProps) {
  const model = MODELS.find((item) => item.slug === params.slug);
  if (!model) notFound();

  const leadLink = "https://linktr.ee/ralph_couch";

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: model.nome,
    image: model.imagens.map((image) => `${BRAND.seo.siteUrl}${image.url}`),
    description: model.descricao,
    brand: {
      "@type": "Organization",
      name: BRAND.name
    },
    url: `${BRAND.seo.siteUrl}/modelos/${model.slug}`
  };

  return (
    <div className="container space-y-12 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <FloatingCta href={leadLink} />
      <nav className="flex items-center gap-2 text-xs text-brand-charcoal/60">
        <Link href="/modelos" className="underline">
          Modelos
        </Link>
        <span>/</span>
        <span>{model.nome}</span>
      </nav>
      <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
        <ModelGallery images={model.imagens} details={model.detalhes ?? []} name={model.nome} />
        <div className="space-y-6">
          <div className="space-y-3 rounded-3xl border border-brand-charcoal/10 bg-white/90 p-6 shadow-luxe">
            <Badge variant="glow" className="text-brand-charcoal">{model.categoria.toUpperCase()}</Badge>
            <h1 className="text-4xl font-display text-brand-charcoal">{model.nome}</h1>
            <p className="text-sm text-brand-charcoal/70">{model.descricao}</p>
            <div className="flex flex-wrap gap-2 text-xs text-brand-charcoal/60">
              {model.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-brand-muted/70 px-3 py-1">
                  #{tag}
                </span>
              ))}
            </div>
            <Button size="lg" asChild>
              <Link href={leadLink} target="_blank" rel="noreferrer">
                Quero este modelo
              </Link>
            </Button>
          </div>
          <SpecTable model={model} />
        </div>
      </div>
      <VariationsCarousel model={model} />
      <section className="rounded-3xl border border-brand-charcoal/10 bg-white/90 p-6 shadow-luxe">
        <h2 className="text-xl font-display text-brand-charcoal">Atendimento personalizado</h2>
        <p className="mt-2 text-sm text-brand-charcoal/70">
          Nossa equipe especializada responde em ate 30 minutos uteis. Envie fotos do ambiente, medidas e referencias para receber o projeto com render e orcamento personalizado.
        </p>
        <Button className="mt-4" asChild>
          <Link href={leadLink} target="_blank" rel="noreferrer">
            Falar com um consultor
          </Link>
        </Button>
      </section>
    </div>
  );
}

