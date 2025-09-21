"use client";

import { useEffect, useMemo, useState } from "react";

import { STATUS_DESCRIPTIONS, STATUS_LABELS, STATUS_ORDER } from "@/components/orders/status-helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Pedido, PedidoStatus } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "rc-admin-auth";
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "ralphadmin";

interface EditablePedido extends Pedido {}

const safeId = () => (globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2));

const createEmptyStep = (orderId: string, status: PedidoStatus) => ({
  id: `${orderId}-${status}`,
  status,
  titulo: STATUS_LABELS[status],
  descricao: STATUS_DESCRIPTIONS[status],
  concluido: status === "recebido",
  data: status === "recebido" ? new Date().toISOString() : undefined
});

const normalizeOrder = (order: Pedido): EditablePedido => ({
  ...order,
  etapas: STATUS_ORDER.map((status) => order.etapas.find((step) => step.status === status) ?? createEmptyStep(order.id, status))
});

export default function AdminRastreioPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  const [orders, setOrders] = useState<EditablePedido[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [isCreating, setIsCreating] = useState(false);
  const [newPedidoId, setNewPedidoId] = useState("");
  const [newCpf, setNewCpf] = useState("");
  const [newCliente, setNewCliente] = useState("");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (stored && stored === ADMIN_PASSWORD) {
      setAuthenticated(true);
    }
  }, []);

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password.trim() === ADMIN_PASSWORD) {
      setAuthenticated(true);
      localStorage.setItem(STORAGE_KEY, ADMIN_PASSWORD);
      setAuthError(null);
    } else {
      setAuthError("Senha incorreta");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthenticated(false);
    setPassword("");
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/orders");
      if (!response.ok) throw new Error("Erro ao carregar pedidos");
      const data = (await response.json()) as Pedido[];
      const normalized = data.map(normalizeOrder);
      setOrders(normalized);
      if (normalized.length && !selectedOrderId) {
        setSelectedOrderId(normalized[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar pedidos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchOrders();
    }
  }, [authenticated]);

  const selectedOrder = useMemo(
    () => orders.find((order) => order.id === selectedOrderId) ?? null,
    [orders, selectedOrderId]
  );

  useEffect(() => {
    if (!selectedOrder && orders.length) {
      setSelectedOrderId(orders[0].id);
    }
  }, [orders, selectedOrder]);

  const toggleStep = (status: PedidoStatus) => {
    if (!selectedOrder) return;
    setOrders((prev) =>
      prev.map((order) =>
        order.id === selectedOrder.id
          ? {
              ...order,
              updatedAt: new Date().toISOString(),
              etapas: order.etapas.map((step) =>
                step.status === status
                  ? {
                      ...step,
                      concluido: !step.concluido,
                      data: !step.concluido ? new Date().toISOString() : undefined
                    }
                  : step
              )
            }
          : order
      )
    );
  };

  const updateStepDescription = (status: PedidoStatus, value: string) => {
    if (!selectedOrder) return;
    setOrders((prev) =>
      prev.map((order) =>
        order.id === selectedOrder.id
          ? {
              ...order,
              etapas: order.etapas.map((step) => (step.status === status ? { ...step, descricao: value } : step))
            }
          : order
      )
    );
  };

  const handleSave = async () => {
    if (!selectedOrder) return;
    setSavingId(selectedOrder.id);
    setMessage(null);
    setError(null);
    try {
      const response = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedOrder)
      });
      if (!response.ok) throw new Error("Não foi possível salvar as alterações");
      const updated = (await response.json()) as Pedido;
      setOrders((prev) => prev.map((item) => (item.id === updated.id ? normalizeOrder(updated) : item)));
      setMessage("Alterações salvas com sucesso.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar alterações");
    } finally {
      setSavingId(null);
    }
  };

  const handleCreateOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);
    try {
      const etapas = STATUS_ORDER.map((status) => ({
        ...createEmptyStep(safeId(), status),
        concluido: status === "recebido",
        data: status === "recebido" ? new Date().toISOString() : undefined
      }));

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pedidoId: newPedidoId.trim(),
          cpf: newCpf.trim(),
          cliente: newCliente.trim() || undefined,
          etapas
        })
      });
      if (!response.ok) throw new Error("Não foi possível cadastrar o pedido");
      setNewPedidoId("");
      setNewCpf("");
      setNewCliente("");
      setIsCreating(false);
      setMessage("Pedido cadastrado com sucesso.");
      await fetchOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar pedido");
    } finally {
      setIsLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-muted/40 p-6">
        <div className="w-full max-w-md space-y-6 rounded-3xl bg-white/95 p-8 shadow-luxe">
          <h1 className="text-2xl font-display text-brand-charcoal">Painel interno</h1>
          <p className="text-sm text-brand-charcoal/70">Informe a senha para gerenciar os pedidos.</p>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label htmlFor="admin-password" className="text-sm font-semibold text-brand-charcoal/80">
                Senha do painel
              </label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              {authError ? <p className="text-xs text-red-600">{authError}</p> : null}
            </div>
            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>
          <p className="text-xs text-brand-charcoal/50">
            Dica: defina a variável NEXT_PUBLIC_ADMIN_PASSWORD para personalizar a senha.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-brand-muted/40 min-h-screen">
      <div className="container space-y-8 py-16">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-2">
            <span className="tag">Painel interno</span>
            <h1 className="text-4xl font-display text-brand-charcoal">Atualizar status dos pedidos</h1>
            <p className="text-brand-charcoal/70 max-w-2xl">
              Escolha um pedido na lista, atualize as etapas concluídas e cadastre novos pedidos conforme necessário. Pedidos com mais de 150 dias são removidos automaticamente.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchOrders}>
              Recarregar
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </header>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {message ? <p className="text-sm text-green-700">{message}</p> : null}

        <section className="rounded-3xl bg-white/95 p-6 shadow-luxe">
          <button
            className="text-sm font-semibold text-brand-champagne hover:underline"
            onClick={() => setIsCreating((state) => !state)}
          >
            {isCreating ? "Cancelar cadastro" : "Cadastrar novo pedido"}
          </button>
          {isCreating ? (
            <form className="mt-6 grid gap-4 md:grid-cols-3" onSubmit={handleCreateOrder}>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-brand-charcoal/80" htmlFor="new-pedido-id">
                  Número do pedido
                </label>
                <Input
                  id="new-pedido-id"
                  value={newPedidoId}
                  onChange={(event) => setNewPedidoId(event.target.value)}
                  placeholder="Ex.: RC-2024-120"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-brand-charcoal/80" htmlFor="new-cpf">
                  CPF do cliente
                </label>
                <Input
                  id="new-cpf"
                  value={newCpf}
                  onChange={(event) => setNewCpf(event.target.value)}
                  placeholder="Somente números"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-brand-charcoal/80" htmlFor="new-cliente">
                  Nome do cliente (opcional)
                </label>
                <Input
                  id="new-cliente"
                  value={newCliente}
                  onChange={(event) => setNewCliente(event.target.value)}
                  placeholder="Ex.: Ana Souza"
                />
              </div>
              <div className="md:col-span-3 flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Cadastrando..." : "Cadastrar pedido"}
                </Button>
              </div>
            </form>
          ) : null}
        </section>

        <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
          <aside className="space-y-4 rounded-3xl bg-white/95 p-4 shadow-luxe">
            <h2 className="text-sm font-semibold text-brand-charcoal/70">Pedidos ({orders.length})</h2>
            <div className="max-h-[60vh] space-y-2 overflow-y-auto pr-1">
              {orders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  className={cn(
                    "w-full rounded-2xl border p-3 text-left text-sm",
                    order.id === selectedOrderId
                      ? "border-brand-champagne bg-brand-muted/40 text-brand-charcoal"
                      : "border-brand-charcoal/10 bg-white text-brand-charcoal/70 hover:border-brand-champagne/60"
                  )}
                >
                  <div className="font-semibold">{order.pedidoId}</div>
                  {order.cliente ? <div className="text-xs">{order.cliente}</div> : null}
                  <div className="text-[10px] uppercase tracking-wide text-brand-charcoal/50">
                    Atualizado em {new Date(order.updatedAt).toLocaleDateString("pt-BR")}
                  </div>
                </button>
              ))}
              {!orders.length ? <p className="text-xs text-brand-charcoal/60">Nenhum pedido cadastrado.</p> : null}
            </div>
          </aside>

          <section className="space-y-6 rounded-3xl bg-white/95 p-6 shadow-luxe">
            {selectedOrder ? (
              <>
                <header className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-2xl font-display text-brand-charcoal">Pedido {selectedOrder.pedidoId}</h2>
                    {selectedOrder.cliente ? (
                      <p className="text-sm text-brand-charcoal/60">Cliente: {selectedOrder.cliente}</p>
                    ) : null}
                  </div>
                  <p className="text-xs text-brand-charcoal/50">
                    Última atualização {new Date(selectedOrder.updatedAt).toLocaleString("pt-BR")}
                  </p>
                </header>

                <div className="space-y-4">
                  {selectedOrder.etapas.map((step) => (
                    <div
                      key={step.id}
                      className={cn(
                        "rounded-2xl border p-4",
                        step.concluido ? "border-brand-champagne/70 bg-brand-muted/40" : "border-brand-charcoal/10"
                      )}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-brand-charcoal">{step.titulo || STATUS_LABELS[step.status]}</p>
                          {step.data ? (
                            <p className="text-xs text-brand-charcoal/60">
                              Concluído em {new Date(step.data).toLocaleDateString("pt-BR")}
                            </p>
                          ) : null}
                        </div>
                        <label className="flex items-center gap-2 text-sm text-brand-charcoal/70">
                          <input
                            type="checkbox"
                            checked={step.concluido}
                            onChange={() => toggleStep(step.status)}
                            className="h-4 w-4 rounded border-brand-charcoal/40 text-brand-champagne focus:ring-brand-champagne"
                          />
                          Concluído
                        </label>
                      </div>
                      <Textarea
                        className="mt-3"
                        placeholder="Observações internas"
                        value={step.descricao ?? ""}
                        onChange={(event) => updateStepDescription(step.status, event.target.value)}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={savingId === selectedOrder.id}>
                    {savingId === selectedOrder.id ? "Salvando..." : "Salvar alterações"}
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-sm text-brand-charcoal/60">Selecione um pedido para visualizar os detalhes.</p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
