"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MODELS } from "@/data/models";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const formats = [
  { label: "Todos", value: "" },
  { label: "Ilha", value: "ilha" },
  { label: "Chaise", value: "chaise" },
  { label: "L", value: "L" },
  { label: "Canto", value: "canto" }
];

export function FeaturedModels() {
  const [activeFormat, setActiveFormat] = useState("");

  const filtered = useMemo(() => {
    const items = MODELS.filter((model) => model.destaque);
    if (!activeFormat) return items;
    return items.filter((model) => model.formatos.includes(activeFormat));
  }, [activeFormat]);

  return (
    <section id="modelos" className="container space-y-10 py-16">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="space-y-4">
          <span className="tag">Modelos em destaque</span>
          <h2 className="text-3xl">Sofás premium prontos para personalizar</h2>
          <p className="max-w-2xl text-brand-charcoal/70">
            Explore formatos em ilha, chaise, canto e módulos lineares com tecidos exclusivos, pés metálicos champagne e
            costuras artesanais.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {formats.map((format) => (
            <button
              key={format.value}
              type="button"
              onClick={() => setActiveFormat(format.value)}
              className={
                "chip" + (activeFormat === format.value ? " border-brand-champagne bg-white text-brand-charcoal" : "")
              }
            >
              {format.label}
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFormat}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
        >
          {filtered.map((model) => (
            <article key={model.id} className="group relative overflow-hidden rounded-3xl border border-white/50 bg-white/90 shadow-luxe">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={model.imagens[0]?.url ?? "/assets/placeholder-model.jpg"}
                  alt={model.imagens[0]?.alt ?? model.nome}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-display text-brand-charcoal">{model.nome}</h3>
                  <Badge variant="outline">{model.categoria.toUpperCase()}</Badge>
                </div>
                <p className="text-sm text-brand-charcoal/70 line-clamp-3">{model.descricao}</p>
                <div className="flex flex-wrap gap-2 text-xs text-brand-charcoal/60">
                  {model.formatos.slice(0, 3).map((format) => (
                    <span key={format} className="rounded-full bg-brand-muted/70 px-3 py-1">
                      {format}
                    </span>
                  ))}
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/modelos/${model.slug}`}>Ver detalhes</Link>
                </Button>
              </div>
            </article>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
