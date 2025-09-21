"use client";

import { useMemo, useState } from "react";

import { OrderTimeline } from "@/components/orders/order-timeline";
import { STATUS_LABELS, STATUS_DESCRIPTIONS, STATUS_ORDER } from "@/components/orders/status-helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Pedido } from "@/lib/supabase/types";

export default function RastreioPage() {
  const [pedidoId, setPedidoId] = useState("");
  const [cpf, setCpf] = useState("");
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setPedido(null);

    try {
      const params = new URLSearchParams({ pedidoId: pedidoId.trim(), cpf: cpf.trim() });
      const response = await fetch(`/api/orders?${params.toString()}`);
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.message ?? "Não encontramos esse pedido. Confira os dados e tente novamente.");
      }
      const data = (await response.json()) as Pedido;
      setPedido(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao consultar o pedido");
    } finally {
      setIsLoading(false);
    }
  };

  const etapas = useMemo(() => {
    if (!pedido) return [];
    return STATUS_ORDER.map((status) => {
      const etapa = pedido.etapas.find((step) => step.status === status);
      return {
        status,
        titulo: etapa?.titulo ?? STATUS_LABELS[status],
        descricao: etapa?.descricao ?? STATUS_DESCRIPTIONS[status],
        concluido: etapa?.concluido ?? false,
        data: etapa?.data
      };
    });
  }, [pedido]);

  return (
    <main className="bg-brand-muted/40">
      <div className="container space-y-12 py-20">
        <header className="max-w-3xl space-y-4">
          <span className="tag">Rastreio de pedido</span>
          <h1 className="text-4xl font-display text-brand-charcoal">Acompanhe o seu Ralph Couch</h1>
          <p className="text-brand-charcoal/70">
            Informe o número do pedido e o CPF usados na compra para acompanhar cada etapa: da fabricação à entrega.
          </p>
        </header>

        <section className="rounded-3xl bg-white/95 p-8 shadow-luxe">
          <form className="grid gap-6 md:grid-cols-[1.2fr,1.2fr,auto]" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="pedidoId">Número do pedido</Label>
              <Input
                id="pedidoId"
                value={pedidoId}
                onChange={(event) => setPedidoId(event.target.value)}
                placeholder="Ex.: RC-2024-001"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF cadastrado</Label>
              <Input
                id="cpf"
                value={cpf}
                onChange={(event) => setCpf(event.target.value)}
                placeholder="Somente números"
                required
              />
            </div>
            <Button type="submit" size="lg" className="self-end" disabled={isLoading}>
              {isLoading ? "Consultando..." : "Rastrear"}
            </Button>
          </form>
          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        </section>

        {pedido ? (
          <section className="space-y-6 rounded-3xl bg-white/95 p-8 shadow-luxe">
            <div className="space-y-1">
              <h2 className="text-2xl font-display text-brand-charcoal">Pedido {pedido.pedidoId}</h2>
              {pedido.cliente ? (
                <p className="text-sm text-brand-charcoal/70">Cliente: {pedido.cliente}</p>
              ) : null}
            </div>
            <OrderTimeline etapas={etapas} />
          </section>
        ) : null}
      </div>
    </main>
  );
}
