import { Model } from "@/lib/supabase/types";

interface SpecTableProps {
  model: Model;
}

export function SpecTable({ model }: SpecTableProps) {
  return (
    <div className="rounded-3xl border border-brand-charcoal/10 bg-white/90 p-6 shadow-luxe">
      <h2 className="text-xl font-display text-brand-charcoal">Especificações</h2>
      <dl className="mt-4 grid gap-4 text-sm text-brand-charcoal/80 sm:grid-cols-2">
        {Object.entries(model.specs).map(([key, value]) => (
          <div key={key} className="rounded-2xl bg-brand-muted/60 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-brand-charcoal/70">{key}</dt>
            <dd className="mt-1 text-brand-charcoal">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-6 text-xs text-brand-charcoal/60">
        <p>Tecidos disponíveis: {model.tecidos.join(", ")}</p>
        <p>Cores já produzidas: {model.cores.join(", ")}</p>
      </div>
    </div>
  );
}