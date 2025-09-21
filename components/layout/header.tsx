"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sofa, Square, Compass, Newspaper, Search, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SELLERS } from "@/lib/constants";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const links = [
  { label: "Sob medida", href: "#personalizado", icon: Compass },
  { label: "Blog", href: "/blog", icon: Newspaper },
  { label: "Rastreio", href: "/rastreio", icon: Search },
  { label: "Contato", href: "#contato", icon: Square }
];

const modelLinks = [
  {
    title: "Sofás",
    description: "Formatos L, canto, ilha e chaise para o seu projeto.",
    href: "/modelos?categoria=sofa"
  },
  {
    title: "Divãs",
    description: "Peças escultóricas para lounges e closets.",
    href: "/modelos?categoria=diva"
  },
  {
    title: "Poltronas",
    description: "Assentos de apoio com giro, concha e bases metálicas.",
    href: "/modelos?categoria=poltrona"
  }
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modelsOpen, setModelsOpen] = useState(false);
  const modelsButtonRef = useRef<HTMLButtonElement>(null);
  const modelsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setModelsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!modelsOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        !modelsButtonRef.current?.contains(target) &&
        !modelsMenuRef.current?.contains(target)
      ) {
        setModelsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setModelsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [modelsOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all",
        scrolled ? "bg-white/90 backdrop-blur-xl shadow-luxe" : "bg-transparent"
      )}
    >
      <div className="container flex h-[var(--header-height)] items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-3 text-lg font-display">
          <Image
            src="/assets/logo.svg"
            alt="Ralph Couch logotipo"
            width={120}
            height={48}
            priority
            className="h-10 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">
          <div className="relative">
            <button
              ref={modelsButtonRef}
              type="button"
              className={cn(
                "flex items-center gap-2 rounded-2xl px-3 py-2 text-brand-charcoal/90 transition hover:text-brand-charcoal",
                modelsOpen && "bg-brand-charcoal text-white shadow-sm"
              )}
              onClick={() => setModelsOpen((state) => !state)}
              aria-haspopup="true"
              aria-expanded={modelsOpen}
            >
              <Sofa className="h-4 w-4" />
              Modelos
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  modelsOpen && "rotate-180"
                )}
              />
            </button>
            <AnimatePresence>
              {modelsOpen ? (
                <motion.div
                  ref={modelsMenuRef}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-1/2 z-10 mt-3 w-[480px] -translate-x-1/2 rounded-3xl border border-white/30 bg-white/95 p-6 shadow-luxe"
                >
                  <div className="grid gap-4">
                    {modelLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex gap-3 rounded-2xl p-3 transition hover:bg-brand-muted/40"
                        onClick={() => setModelsOpen(false)}
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-muted/80 text-brand-charcoal">
                          <Sofa className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-base font-semibold text-brand-charcoal">{item.title}</p>
                          <p className="text-sm text-brand-charcoal/70">{item.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          {links.map((link) => {
            const isHashLink = link.href.startsWith("#");
            const resolvedHref = isHashLink && pathname !== "/" ? `/#${link.href.slice(1)}` : link.href;
            const matchesRoute = !isHashLink && (
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(`${link.href}/`))
            );
            return (
              <Link
                key={link.href}
                href={resolvedHref}
                className={cn(
                  "rounded-2xl px-3 py-2 transition",
                  matchesRoute ? "bg-brand-charcoal text-white" : "text-brand-charcoal/80 hover:text-brand-charcoal"
                )}
                aria-current={matchesRoute ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button size="lg" asChild>
            <Link href={buildWhatsAppLink({ seller: "leticia", message: "Quero meu projeto Ralph Couch" })}>
              Fazer meu projeto
            </Link>
          </Button>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileOpen((state) => !state)}
          aria-label="Abrir menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-brand-charcoal/10 bg-white/95 backdrop-blur-lg lg:hidden"
          >
            <div className="container flex flex-col gap-6 py-6">
              <div className="grid gap-4">
                {modelLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-start gap-3 rounded-2xl bg-brand-muted/60 p-3"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Sofa className="mt-1 h-5 w-5 text-brand-champagne" />
                    <div>
                      <p className="font-semibold text-brand-charcoal">{item.title}</p>
                      <p className="text-sm text-brand-charcoal/70">{item.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="grid gap-2">
                {links.map((link) => {
                  const Icon = link.icon;
                  const isHashLink = link.href.startsWith("#");
                  const resolvedHref = isHashLink && pathname !== "/" ? `/#${link.href.slice(1)}` : link.href;
                  return (
                    <Link
                      key={link.href}
                      href={resolvedHref}
                      className="flex items-center gap-3 rounded-2xl px-3 py-2 text-brand-charcoal"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
              <Button size="lg" asChild>
                <Link
                  href={buildWhatsAppLink({ seller: "leticia", message: "Quero meu projeto Ralph Couch" })}
                  onClick={() => setMobileOpen(false)}
                >
                  Falar no WhatsApp
                </Link>
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
