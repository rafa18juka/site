"use client";

import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface EditableTableProps {
  products: Product[];
  categories: string[];
  suppliers: string[];
  onChange: (id: string, changes: Partial<Product>) => Promise<void>;
  onDelete: (ids: string[]) => Promise<void>;
  onCreate: () => void;
  onGenerateLabels: (products: Product[], quantity: number) => void;
  onExport: () => void;
  onImport: (file: File) => Promise<void>;
  onSeed: () => void;
}

export function EditableTable({
  products,
  categories,
  suppliers,
  onChange,
  onDelete,
  onCreate,
  onGenerateLabels,
  onExport,
  onImport,
  onSeed
}: EditableTableProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Partial<Product>>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleSelection = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleDraftChange = (id: string, field: keyof Product, value: string | number) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const commitChanges = async (id: string) => {
    const draft = drafts[id];
    if (!draft) return;
    setSaving(id);
    await onChange(id, draft);
    setDrafts((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
    setSaving(null);
  };

  const selectedProducts = products.filter((product) => selected.includes(product.id));

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await onImport(file);
    }
    event.target.value = "";
  };

  const handleGenerateLabels = () => {
    if (!selectedProducts.length) return;
    const quantity = Number(window.prompt("Quantas etiquetas gerar por item?", "1")) || 1;
    if (quantity <= 0) return;
    onGenerateLabels(selectedProducts, quantity);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={onCreate}>Novo produto</Button>
        <Button
          variant="outline"
          onClick={() => onDelete(selected)}
          disabled={!selected.length}
        >
          Excluir selecionados
        </Button>
        <Button variant="outline" onClick={handleGenerateLabels} disabled={!selected.length}>
          Gerar etiquetas
        </Button>
        <Button variant="outline" onClick={onExport}>
          Exportar JSON
        </Button>
        <Button variant="outline" onClick={handleImportClick}>
          Importar JSON
        </Button>
        <Button variant="ghost" onClick={onSeed}>
          Criar dados de exemplo
        </Button>
        <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleFileChange} />
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-3">
                <input
                  type="checkbox"
                  checked={selected.length === products.length && products.length > 0}
                  onChange={(event) =>
                    setSelected(event.target.checked ? products.map((product) => product.id) : [])
                  }
                />
              </th>
              <th className="px-3 py-3">Nome</th>
              <th className="px-3 py-3">SKU</th>
              <th className="px-3 py-3">Preço unitário</th>
              <th className="px-3 py-3">Categoria</th>
              <th className="px-3 py-3">Fornecedor</th>
              <th className="px-3 py-3">Quantidade</th>
              <th className="px-3 py-3">Valor total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white text-sm">
            {products.map((product) => {
              const draft = drafts[product.id] ?? {};
              const merged = { ...product, ...draft };
              return (
                <tr key={product.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={selected.includes(product.id)}
                      onChange={() => toggleSelection(product.id)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      value={merged.name}
                      onChange={(event) => handleDraftChange(product.id, "name", event.target.value)}
                      onBlur={() => commitChanges(product.id)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      value={merged.sku}
                      onChange={(event) => handleDraftChange(product.id, "sku", event.target.value)}
                      onBlur={() => commitChanges(product.id)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={merged.unitPrice}
                      onChange={(event) =>
                        handleDraftChange(product.id, "unitPrice", Number(event.target.value))
                      }
                      onBlur={() => commitChanges(product.id)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Select
                      value={merged.category ?? ""}
                      onChange={(event) => handleDraftChange(product.id, "category", event.target.value)}
                      onBlur={() => commitChanges(product.id)}
                    >
                      <option value="">Sem categoria</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </Select>
                  </td>
                  <td className="px-3 py-2">
                    <Select
                      value={merged.supplier ?? ""}
                      onChange={(event) => handleDraftChange(product.id, "supplier", event.target.value)}
                      onBlur={() => commitChanges(product.id)}
                    >
                      <option value="">Sem fornecedor</option>
                      {suppliers.map((supplier) => (
                        <option key={supplier} value={supplier}>
                          {supplier}
                        </option>
                      ))}
                    </Select>
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      min="0"
                      value={merged.quantity}
                      onChange={(event) => handleDraftChange(product.id, "quantity", Number(event.target.value))}
                      onBlur={() => commitChanges(product.id)}
                    />
                  </td>
                  <td className="px-3 py-2 text-right font-semibold">
                    {saving === product.id ? "Salvando…" : formatCurrency(product.totalValue)}
                  </td>
                </tr>
              );
            })}
            {!products.length && (
              <tr>
                <td colSpan={8} className="px-3 py-6 text-center text-slate-500">
                  Nenhum produto cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedProducts.length > 0 && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {selectedProducts.length} produto(s) selecionado(s).
        </div>
      )}
    </div>
  );
}
