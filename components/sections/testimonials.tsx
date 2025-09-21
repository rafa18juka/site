import { REVIEWS } from "@/data/reviews";
import { Carousel, CarouselItem } from "@/components/ui/carousel";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

export function TestimonialsSection() {
  return (
    <section className="container space-y-10 py-20">
      <div className="space-y-4 text-center">
        <span className="tag">Experiências reais</span>
        <h2 className="text-3xl">Clientes encantados com conforto e prazo</h2>
        <p className="mx-auto max-w-2xl text-brand-charcoal/70">
          Somos Mercado Líder Gold e acumulamos avaliações 5 estrelas pela atenção, projeto personalizado e entrega no prazo.
        </p>
      </div>
      <Carousel className="" options={{ align: "start" }}>
        {REVIEWS.map((review) => (
          <CarouselItem key={review.name} className="pr-4 md:flex-[0_0_45%]">
            <div className="flex h-full flex-col gap-4 rounded-3xl border border-brand-charcoal/10 bg-white/90 p-6 shadow-luxe">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{review.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-brand-charcoal">{review.name}</p>
                  <p className="text-xs text-brand-charcoal/60">Há {review.weeksAgo} semanas</p>
                </div>
              </div>
              <div className="flex gap-1 text-brand-champagne">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-brand-charcoal/80">{review.text}</p>
            </div>
          </CarouselItem>
        ))}
      </Carousel>
    </section>
  );
}