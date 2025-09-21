"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="hero-grid absolute inset-0" aria-hidden />
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/assets/hero.mp4"
        poster="/assets/hero-living.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden
      />
      <div className="relative z-10 bg-hero-overlay">
        <div className="container flex min-h-[calc(100vh-72px)] flex-col justify-end pb-24 pt-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl space-y-6 text-white"
          >
            <span className="tag bg-white/20 text-white">Luxo feito para o seu espaço</span>
            <h1 className="text-4xl font-display text-white/80 sm:text-5xl">Sofás sob medida com conforto assinatura</h1>
            <p className="text-base text-white/80">
              Cada Ralph Couch nasce do seu ambiente: densidade precisa, tecidos pet friendly e acabamentos artesanais.
              Projetamos, fabricamos e entregamos com acompanhamento em cada etapa.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button size="lg" asChild>
                <Link href="https://linktr.ee/ralph_couch" target="_blank" rel="noreferrer">
                  Fazer meu projeto
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="#modelos">Ver modelos</Link>
              </Button>
            </div>
            <div className="flex flex-col gap-4 pt-4 text-sm sm:flex-row sm:items-center sm:gap-6">
              <div>
                <p className="font-semibold">+10 mil projetos entregues</p>
                <p className="text-white/70">Avaliações 5 estrelas certificadas</p>
              </div>
              <div className="flex items-center">
                <Image
                  src="/assets/mercado-lider.png"
                  alt="Mercado Líder Gold"
                  width={300}
                  height={190}
                  className="h-24 w-auto sm:h-30 lg:h-32"
                />
              </div>
              <Link href="/garantia" className="flex items-center" aria-label="Ver detalhes da garantia Ralph Couch">
                <Image
                  src="/assets/mercado-certificado.png"
                  alt="Certificação de Segurança"
                  width={300}
                  height={190}
                  className="h-24 w-auto sm:h-30 lg:h-32"
                />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


