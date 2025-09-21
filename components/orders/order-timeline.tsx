"use client";

import { CheckCircle2, Circle } from "lucide-react";

import { STATUS_LABELS } from "@/components/orders/status-helpers";
import type { PedidoStatus } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

export interface OrderTimelineItem {
  status: PedidoStatus;
  titulo: string;
  descricao?: string;
  concluido: boolean;
  data?: string;
}

interface OrderTimelineProps {
  etapas: OrderTimelineItem[];
}

export function OrderTimeline({ etapas }: OrderTimelineProps) {
  return (
    <ol className="relative space-y-6 border-l border-brand-charcoal/10 pl-6">
      {etapas.map((item, index) => {
        const isLast = index === etapas.length - 1;
        const Icon = item.concluido ? CheckCircle2 : Circle;
        const formattedDate = item.data ? new Date(item.data).toLocaleDateString("pt-BR") : null;

        return (
          <li key={item.status} className="relative">
            <span
              className={cn(
                "absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-white",
                item.concluido ? "text-brand-champagne" : "text-brand-charcoal/40"
              )}
            >
              <Icon className="h-5 w-5" />
            </span>
            <div className={cn("rounded-2xl border p-4", item.concluido ? "border-brand-champagne/60 bg-brand-muted/40" : "border-brand-charcoal/10 bg-white") }>
              <h3 className="font-semibold text-brand-charcoal">{item.titulo || STATUS_LABELS[item.status]}</h3>
              {formattedDate ? <p className="text-xs text-brand-charcoal/60">{formattedDate}</p> : null}
              {item.descricao ? (
                <p className="mt-2 text-sm text-brand-charcoal/70">{item.descricao}</p>
              ) : null}
            </div>
            {!isLast ? <span className="absolute -left-px top-6 h-full w-px bg-brand-charcoal/10" aria-hidden /> : null}
          </li>
        );
      })}
    </ol>
  );
}
