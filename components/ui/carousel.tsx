"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";

interface CarouselProps {
  className?: string;
  options?: EmblaOptionsType;
  autoplay?: boolean;
  children: React.ReactNode;
}

export function Carousel({ className, options, autoplay = true, children }: CarouselProps) {
  const plugins = React.useMemo(() => (autoplay ? [Autoplay({ delay: 5000 })] : undefined), [autoplay]);
  const [ref, embla] = useEmblaCarousel({ align: "start", loop: true, ...options }, plugins);

  return (
    <div className={cn("relative", className)}>
      <div className="overflow-hidden" ref={ref}>
        <div className="flex touch-pan-x space-x-4 py-2">{children}</div>
      </div>
      {embla && embla.slideNodes().length > 1 ? (
        <div className="mt-4 flex items-center justify-center gap-2">
          {embla.slideNodes().map((_, index) => (
            <button
              key={index}
              type="button"
              className="h-2 w-6 rounded-full bg-brand-charcoal/20 data-[active=true]:bg-brand-champagne"
              data-active={embla.selectedScrollSnap() === index}
              aria-label={`Ir para slide ${index + 1}`}
              onClick={() => embla.scrollTo(index)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

interface CarouselItemProps {
  className?: string;
  children: React.ReactNode;
}

export function CarouselItem({ className, children }: CarouselItemProps) {
  return <div className={cn("min-w-0 flex-[0_0_100%] md:flex-[0_0_50%]", className)}>{children}</div>;
}




