"use client";

import { useEffect, useMemo, useState } from "react";
import { format, startOfDay, startOfMonth, startOfWeek, startOfYear, subDays } from "date-fns";
import { toast } from "sonner";

import { BarChart } from "@/components/charts/bar-chart";
import { PieChart } from "@/components/charts/pie-chart";
import { ProtectedRoute } from "@/components/protected-route";
import { RoleGate } from "@/components/role-gate";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ensureFirebase } from "@/lib/firebase-client";
import type { Product, StockMovement } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { StatsCard } from "@/components/stats-card";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <RoleGate allow={["admin"]}>
        <DashboardContent />
      </RoleGate>
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [supplierFilter, setSupplierFilter] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const bundle = await ensureFirebase();
        const { firestore } = bundle;
        const productsSnapshot = await firestore.getDocs(firestore.collection(bundle.db, "products"));
        const loadedProducts: Product[] = productsSnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
        setProducts(loadedProducts);
        const movementsSnapshot = await firestore.getDocs(firestore.collection(bundle.db, "stockMovements"));
        const loadedMovements: StockMovement[] = movementsSnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
        setMovements(loadedMovements);
      } catch (error) {
        console.error(error);
        toast.error("Falha ao carregar dados do Firestore");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const categories = useMemo(() => {
    const unique = new Set(products.map((product) => product.category).filter(Boolean) as string[]);
    return Array.from(unique);
  }, [products]);

  const suppliers = useMemo(() => {
    const unique = new Set(products.map((product) => product.supplier).filter(Boolean) as string[]);
    return Array.from(unique);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchCategory = categoryFilter ? product.category === categoryFilter : true;
      const matchSupplier = supplierFilter ? product.supplier === supplierFilter : true;
      return matchCategory && matchSupplier;
    });
  }, [products, categoryFilter, supplierFilter]);

  const productMap = useMemo(() => {
    return new Map(filteredProducts.map((product) => [product.id, product]));
  }, [filteredProducts]);

  const filteredMovements = useMemo(() => {
    if (!categoryFilter && !supplierFilter) return movements;
    return movements.filter((movement) => {
      const product = productMap.get(movement.productId);
      return Boolean(product);
    });
  }, [movements, productMap, categoryFilter, supplierFilter]);

  const totalItems = filteredProducts.reduce((acc, product) => acc + (product.quantity ?? 0), 0);
  const totalValue = filteredProducts.reduce((acc, product) => acc + (product.totalValue ?? 0), 0);

  const valueByCategory = filteredProducts.reduce<Record<string, number>>((acc, product) => {
    const key = product.category ?? "Sem categoria";
    acc[key] = (acc[key] ?? 0) + (product.totalValue ?? 0);
    return acc;
  }, {});

  const valueBySupplier = filteredProducts.reduce<Record<string, number>>((acc, product) => {
    const key = product.supplier ?? "Sem fornecedor";
    acc[key] = (acc[key] ?? 0) + (product.totalValue ?? 0);
    return acc;
  }, {});

  const now = new Date();
  const thresholds = {
    today: startOfDay(now).getTime(),
    week: startOfWeek(now).getTime(),
    month: startOfMonth(now).getTime(),
    year: startOfYear(now).getTime()
  };

  const movementsWithProducts = filteredMovements.filter((movement) => movement.type === "out").map((movement) => ({
    ...movement,
    product: productMap.get(movement.productId)
  }));

  const windowStats = (start: number) => {
    const relevant = movementsWithProducts.filter((movement) => movement.timestamp >= start);
    const totalQty = relevant.reduce((acc, movement) => acc + movement.qty, 0);
    const totalVal = relevant.reduce((acc, movement) => {
      const unitPrice = movement.product?.unitPrice ?? 0;
      return acc + unitPrice * movement.qty;
    }, 0);
    return { totalQty, totalVal };
  };

  const todayStats = windowStats(thresholds.today);
  const weekStats = windowStats(thresholds.week);
  const monthStats = windowStats(thresholds.month);
  const yearStats = windowStats(thresholds.year);

  const last30Days = Array.from({ length: 30 }).map((_, index) => {
    const date = startOfDay(subDays(now, 29 - index));
    const dayStart = date.getTime();
    const dayEnd = startOfDay(subDays(now, 28 - index)).getTime();
    const dayMovements = movementsWithProducts.filter(
      (movement) => movement.timestamp >= dayStart && movement.timestamp < dayEnd
    );
    const totalQty = dayMovements.reduce((acc, movement) => acc + movement.qty, 0);
    return {
      label: format(date, "dd/MM"),
      value: totalQty
    };
  });

  const pieCategoryData = {
    labels: Object.keys(valueByCategory),
    values: Object.values(valueByCategory)
  };

  const pieSupplierData = {
    labels: Object.keys(valueBySupplier),
    values: Object.values(valueBySupplier)
  };

  const barData = {
    labels: last30Days.map((item) => item.label),
    values: last30Days.map((item) => item.value)
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard de Estoque</h1>
          <p className="text-sm text-slate-500">
            Visão geral do estoque atual, valor em prateleira e histórico de saídas.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option value="">Todas as categorias</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
          <Select value={supplierFilter} onChange={(event) => setSupplierFilter(event.target.value)}>
            <option value="">Todos os fornecedores</option>
            {suppliers.map((supplier) => (
              <option key={supplier} value={supplier}>
                {supplier}
              </option>
            ))}
          </Select>
          <Button variant="ghost" onClick={() => { setCategoryFilter(""); setSupplierFilter(""); }}>
            Limpar filtros
          </Button>
        </div>
      </header>

      {loading ? (
        <div className="flex min-h-[200px] items-center justify-center text-slate-500">Carregando métricas…</div>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatsCard label="Itens em estoque" value={totalItems.toLocaleString("pt-BR")} />
            <StatsCard label="Valor em estoque" value={formatCurrency(totalValue)} />
            <StatsCard
              label="Saídas hoje"
              value={`${todayStats.totalQty} itens`}
              description={formatCurrency(todayStats.totalVal)}
            />
            <StatsCard
              label="Saídas na semana"
              value={`${weekStats.totalQty} itens`}
              description={formatCurrency(weekStats.totalVal)}
            />
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatsCard
              label="Saídas no mês"
              value={`${monthStats.totalQty} itens`}
              description={formatCurrency(monthStats.totalVal)}
            />
            <StatsCard
              label="Saídas no ano"
              value={`${yearStats.totalQty} itens`}
              description={formatCurrency(yearStats.totalVal)}
            />
            <div className="card">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Valor por categoria</h3>
              <PieChart labels={pieCategoryData.labels} values={pieCategoryData.values} />
            </div>
            <div className="card">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Valor por fornecedor</h3>
              <PieChart labels={pieSupplierData.labels} values={pieSupplierData.values} />
            </div>
          </section>

          <section className="grid gap-4">
            <div className="card">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Saídas por dia (últimos 30 dias)
              </h3>
              <BarChart labels={barData.labels} values={barData.values} />
            </div>
          </section>
        </>
      )}
    </div>
  );
}
