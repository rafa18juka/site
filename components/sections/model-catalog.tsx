"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { ReadonlyURLSearchParams } from "next/navigation";
import { MODELS, MODEL_FILTERS } from "@/data/models";
import { ModelCard } from "@/components/cards/model-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, slugify } from "@/lib/utils";

interface Filters {
  categoria?: string;
  formato?: string;
  tecido?: string;
  cor?: string;
  busca?: string;
}

const filterKeys: (keyof Filters)[] = ["categoria", "formato", "tecido", "cor"];

function getInitialFilters(searchParams: URLSearchParams | ReadonlyURLSearchParams): Filters {
  const filters: Filters = {};
  filterKeys.forEach((key) => {
    const value = searchParams.get(key);
    if (value) filters[key] = value;
  });
  const busca = searchParams.get("busca");
  if (busca) filters.busca = busca;
  return filters;
}

export function ModelCatalog() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filters, setFilters] = useState<Filters>(() => getInitialFilters(searchParams));
  const paramsString = searchParams.toString();

  useEffect(() => {
    const nextFilters = getInitialFilters(searchParams);
    setFilters((prev) => {
      const hasChanged = filterKeys.some((key) => prev[key] !== nextFilters[key]) || prev.busca !== nextFilters.busca;
      return hasChanged ? nextFilters : prev;
    });
  }, [paramsString]);

  const filteredModels = useMemo(() => {
    return MODELS.filter((model) => {
      if (filters.categoria && model.categoria !== filters.categoria) return false;
      if (filters.formato && !model.formatos.map(slugify).includes(slugify(filters.formato))) return false;
      if (filters.tecido && !model.tecidos.map(slugify).includes(slugify(filters.tecido))) return false;
      if (filters.cor && !model.cores.map(slugify).includes(slugify(filters.cor))) return false;
      if (filters.busca) {
        const term = filters.busca.toLowerCase();
        const haystack = [model.nome, model.descricao, ...model.tags].join(" ").toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });
  }, [filters]);

  const handleFilter = (key: keyof Filters, value?: string) => {
    const updated = { ...filters, [key]: filters[key] === value ? undefined : value };
    if (!value) {
      delete updated[key];
    }
    setFilters(updated);
    const params = new URLSearchParams();
    Object.entries(updated).forEach(([paramKey, paramValue]) => {
      if (paramValue) params.set(paramKey, paramValue);
    });
    const query = params.toString();
    router.replace(query ? `/modelos?${query}` : '/modelos');
  };

  const clearFilters = () => {
    setFilters({});
    router.replace("/modelos");
  };

  return (
    <section className="container space-y-10 py-20">
      <div className="grid gap-10 lg:grid-cols-[320px,1fr]">
        <aside className="space-y-8 rounded-3xl border border-brand-charcoal/10 bg-white/90 p-6 shadow-luxe">
          <div className="space-y-3">
            <h2 className="text-xl font-display text-brand-charcoal">Filtrar modelos</h2>
            <Input
              placeholder="Buscar por nome, tag ou descrição"
              value={filters.busca ?? ""}
              onChange={(event) => handleFilter("busca", event.target.value)}
            />
            <Button variant="ghost" className="w-full justify-center" onClick={() => handleFilter("busca")}>Limpar busca</Button>
          </div>
          <FilterGroup
            title="Categoria"
            options={MODEL_FILTERS.categoria}
            value={filters.categoria}
            onSelect={(value) => handleFilter("categoria", value)}
          />
          <FilterGroup
            title="Formato"
            options={MODEL_FILTERS.formatos.map((value) => ({ value, label: value.toUpperCase() }))}
            value={filters.formato}
            onSelect={(value) => handleFilter("formato", value)}
          />
          <FilterGroup
            title="Tecidos"
            options={MODEL_FILTERS.tecidos.map((value) => ({ value, label: value }))}
            value={filters.tecido}
            onSelect={(value) => handleFilter("tecido", value)}
          />
          <FilterGroup
            title="Cores"
            options={MODEL_FILTERS.cores.map((value) => ({ value, label: value }))}
            value={filters.cor}
            onSelect={(value) => handleFilter("cor", value)}
          />
          <Button variant="outline" className="w-full" onClick={clearFilters}>Limpar filtros</Button>
        </aside>
        <div className="space-y-6">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="tag">Catálogo completo</span>
              <h1 className="text-3xl">Modelos Ralph Couch</h1>
            </div>
            <p className="text-sm text-brand-charcoal/70">{filteredModels.length} resultados</p>
          </header>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredModels.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface FilterGroupProps {
  title: string;
  options: { value: string; label: string }[];
  value?: string;
  onSelect: (value?: string) => void;
}

function FilterGroup({ title, options, value, onSelect }: FilterGroupProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-charcoal/70">{title}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={cn(
              "chip text-xs",
              value === option.value && "border-brand-champagne bg-white text-brand-charcoal shadow-luxe"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}


