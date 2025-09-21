"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function CtaBanner() {
  return (
    <section className="py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-brand-champagne/30 bg-[url('/assets/hero-living.jpg')] bg-cover bg-center px-8 py-12 text-white shadow-luxe"
        >
          <div className="absolute inset-0 bg-black/60" aria-hidden />
          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl space-y-3">
              <span className="uppercase tracking-widest text-xs text-brand-champagne">Atendimento signature</span>
              <h2 className="text-3xl font-display">Vamos desenhar o sofá perfeito para o seu espaço</h2>
              <p className="text-sm text-white/70">
                Envie plantas, referências e preferências de conforto. Nossa equipe retorna em até 30 minutos dentro do horário
                comercial.
              </p>
            </div>
            <Button size="lg" className="bg-brand-champagne text-brand-charcoal" asChild>
              <Link href="https://linktr.ee/ralph_couch" target="_blank" rel="noreferrer">
                Falar com especialista
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
