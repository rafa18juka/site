"use client";

import { MotionConfig, motion } from "framer-motion";
import Image from "next/image";

const highlights = [
  {
    title: "Tecidos signature",
    description: "Linho sofisticado, bouclé, veludo pet friendly e couros ecológicos com proteção anti-manchas.",
    image: "/assets/highlights/tecidos.png"
  },
  {
    title: "Conforto calibrado",
    description: "Densidades mistas, percintas italianas e almofadas em pluma siliconada com capas removíveis.",
    image: "/assets/highlights/conforto.png"
  },
  {
    title: "Medidas & Modularidade",
    description: "Layouts L, U, ilha ou reto. Módulos em medidas exatas, braços e assentos na proporção ideal para o seu ambiente.",
    image: "/assets/highlights/detalhes.png"
  }
];

export function CustomizationSection() {
  return (
    <section id="personalizado" className="bg-brand-muted/60 py-20">
      <div className="container grid gap-12 lg:grid-cols-[1fr,1.2fr]">
        <div className="space-y-6">
          <span className="tag">Sob medida</span>
          <h2 className="text-3xl">Personalização total para o seu projeto</h2>
          <p className="text-brand-charcoal/70">
            Escolha dimensões, densidade, tecidos pet friendly, acabamentos metálicos e acessórios como puffs, mesas de apoio e
            almofadas. Nosso time técnico acompanha a medição e cria 3D personalizado.
          </p>
          <ul className="grid gap-4 text-sm text-brand-charcoal/80">
            <li>• Consultoria com designer de interiores dedicado.</li>
            <li>• Amostras de tecidos enviadas para todo o Brasil.</li>
            <li>• Montagem premium agendada e checklist de entrega.</li>
          </ul>
        </div>
        <MotionConfig transition={{ duration: 0.6, ease: "easeOut" }}>
          <div className="grid gap-6 md:grid-cols-3">
            {highlights.map((highlight, index) => (
              <motion.figure
                key={highlight.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-3xl bg-white shadow-luxe"
              >
                <div className="relative h-40 w-full overflow-hidden">
                  <Image
                    src={highlight.image}
                    alt={highlight.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 30vw"
                  />
                </div>
                <figcaption className="space-y-2 p-4">
                  <h3 className="font-semibold text-brand-charcoal">{highlight.title}</h3>
                  <p className="text-xs text-brand-charcoal/70">{highlight.description}</p>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </MotionConfig>
      </div>
    </section>
  );
}

