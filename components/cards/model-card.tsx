import Image from "next/image";
import Link from "next/link";
import { Model } from "@/lib/supabase/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ModelCardProps {
  model: Model;
}

export function ModelCard({ model }: ModelCardProps) {
  const cover = model.imagens[0];
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-brand-charcoal/10 bg-white/90 shadow-luxe transition hover:-translate-y-1">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={cover?.url ?? "/assets/placeholder-model.jpg"}
          alt={cover?.alt ?? model.nome}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-display text-brand-charcoal">{model.nome}</h3>
          <Badge variant="outline">{model.categoria.toUpperCase()}</Badge>
        </div>
        <p className="text-sm text-brand-charcoal/70 line-clamp-3">{model.descricao}</p>
        <div className="flex flex-wrap gap-2 text-xs text-brand-charcoal/60">
          {model.formatos.map((format) => (
            <span key={format} className="rounded-full bg-brand-muted/80 px-3 py-1">
              {format}
            </span>
          ))}
        </div>
        <Button variant="outline" className="mt-auto w-full" asChild>
          <Link href={`/modelos/${model.slug}`}>Ver detalhes</Link>
        </Button>
      </div>
    </article>
  );
}