import { Model } from "@/lib/supabase/types";
import { Carousel, CarouselItem } from "@/components/ui/carousel";
import Image from "next/image";

interface VariationsCarouselProps {
  model: Model;
}

export function VariationsCarousel({ model }: VariationsCarouselProps) {
  if (!model.variacoes?.length) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-display text-brand-charcoal">Como ele já foi feito</h2>
      <Carousel options={{ align: "start" }}>
        {model.variacoes.map((variation) => (
          <CarouselItem key={variation.id} className="pr-4 md:flex-[0_0_40%]">
            <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-brand-charcoal/10 bg-white/90 shadow-luxe">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={variation.imagens[0]?.url ?? "/assets/placeholder-model.jpg"}
                  alt={variation.imagens[0]?.alt ?? variation.titulo}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
              <div className="space-y-2 p-4">
                <p className="font-semibold text-brand-charcoal">{variation.titulo}</p>
                {variation.descricao ? (
                  <p className="text-sm text-brand-charcoal/70">{variation.descricao}</p>
                ) : null}
              </div>
            </div>
          </CarouselItem>
        ))}
      </Carousel>
    </div>
  );
}