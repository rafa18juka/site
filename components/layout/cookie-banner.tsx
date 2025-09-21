"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "ralph-couch-cookie-consent";

export function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const consent = window.localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setOpen(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    window.localStorage.setItem(STORAGE_KEY, "accepted");
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="fixed inset-x-0 bottom-6 z-50 px-4"
        >
          <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-3xl border border-brand-charcoal/10 bg-white/95 p-6 shadow-luxe backdrop-blur">
            <div>
              <p className="font-semibold text-brand-charcoal">Privacidade e cookies</p>
              <p className="text-sm text-brand-charcoal/80">
                Utilizamos cookies para personalizar sua experiência, analisar o tráfego e lembrar suas preferências.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Continuar sem aceitar
              </Button>
              <Button onClick={handleAccept}>Aceitar cookies</Button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}