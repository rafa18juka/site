"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface FloatingCtaProps {
  href: string;
}

export function FloatingCta({ href }: FloatingCtaProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4">
      <div className="pointer-events-auto w-full max-w-md">
        <Button
          size="lg"
          className={`w-full rounded-full bg-brand-champagne text-brand-charcoal shadow-luxe transition ${visible ? "opacity-100" : "opacity-0"}`}
          asChild
        >
          <Link href={href}>Quero este modelo</Link>
        </Button>
      </div>
    </div>
  );
}