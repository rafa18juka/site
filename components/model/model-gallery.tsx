"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import type { Image as ModelImage } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

interface ModelGalleryProps {
  images: ModelImage[];
  details?: ModelImage[];
  name: string;
}

const placeholder: ModelImage = {
  id: "placeholder",
  url: "/assets/placeholder-model.jpg",
  alt: "Modelo Ralph Couch",
  width: 1200,
  height: 900
};

export function ModelGallery({ images, details = [], name }: ModelGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [detailPreview, setDetailPreview] = useState<ModelImage | null>(null);
  const [lens, setLens] = useState<{ visible: boolean; x: number; y: number; backgroundX: number; backgroundY: number }>(
    {
      visible: false,
      x: 0,
      y: 0,
      backgroundX: 50,
      backgroundY: 50
    }
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const baseImage = images[activeIndex] ?? placeholder;
  const displayImage = detailPreview ?? baseImage;

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const backgroundX = (x / rect.width) * 100;
    const backgroundY = (y / rect.height) * 100;
    setLens({ visible: true, x, y, backgroundX, backgroundY });
  };

  const handlePointerLeave = () => {
    setLens((lens) => ({ ...lens, visible: false }));
  };

  const handleThumbClick = (index: number) => {
    setActiveIndex(index);
    setDetailPreview(null);
  };

  const handleDetailClick = (image: ModelImage) => {
    setDetailPreview((current) => (current?.url === image.url ? null : image));
  };

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-3xl border border-brand-charcoal/10 bg-white"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <Image
          src={displayImage.url}
          alt={displayImage.alt ?? name}
          width={displayImage.width ?? 1600}
          height={displayImage.height ?? 1200}
          className="h-full w-full object-cover"
          priority
        />
        {lens.visible ? (
          <div
            className="pointer-events-none absolute h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-white/10 shadow-luxe"
            style={{
              top: lens.y,
              left: lens.x,
              backgroundImage: `url(${displayImage.url})`,
              backgroundSize: "200%",
              backgroundPosition: `${lens.backgroundX}% ${lens.backgroundY}%`
            }}
          />
        ) : null}
      </div>
      <div className="flex flex-wrap gap-3 pb-2 md:flex-nowrap md:overflow-x-auto">
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => handleThumbClick(index)}
            className={cn(
              "relative h-24 w-24 shrink-0 overflow-hidden rounded-3xl border-2 transition",
              detailPreview ? "opacity-70" : "",
              activeIndex === index && !detailPreview
                ? "border-brand-champagne shadow-luxe"
                : "border-transparent opacity-80 hover:opacity-100"
            )}
            aria-label={`Ver variação ${index + 1}`}
          >
            <Image src={image.url} alt={image.alt ?? name} fill className="object-cover" sizes="96px" />
          </button>
        ))}
      </div>
      {details.length ? (
        <div className="flex flex-wrap gap-2">
          {details.slice(0, 5).map((image, index) => (
            <button
              key={`detail-${image.id ?? `${image.url}-${index}`}`}
              type="button"
              onClick={() => handleDetailClick(image)}
              className={cn(
                "h-14 w-14 overflow-hidden rounded-full border transition",
                detailPreview?.url === image.url
                  ? "border-brand-champagne shadow-luxe"
                  : "border-brand-champagne/50 hover:border-brand-champagne"
              )}
              aria-label={`Ver detalhe ${index + 1}`}
            >
              <Image src={image.url} alt={image.alt ?? name} width={56} height={56} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
