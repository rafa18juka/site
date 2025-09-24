"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { EditableTable } from "@/components/editable-table";
import { ProtectedRoute } from "@/components/protected-route";
import { RoleGate } from "@/components/role-gate";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { ZPLPreview } from "@/components/zpl-preview";
import { ensureFirebase } from "@/lib/firebase-client";
import type { Product } from "@/lib/types";
import { generateZPL } from "@/lib/zpl";

const newProductSchema = z.object({
  name: z.string().min(2, "Informe o nome do produto"),
  sku: z.string().min(3, "Informe um SKU válido"),
  unitPrice: z.coerce.number().min(0, "Preço inválido"),
  quantity: z.coerce.number().min(0, "Quantidade inválida"),
  category: z.string().optional(),
  supplier: z.string().optional()
});

type NewProductValues = z.infer<typeof newProductSchema>;

export default function InventoryPage() {
  return (
    <ProtectedRoute>
      <RoleGate allow={["admin"]}>
        <InventoryContent />
      </RoleGate>
    </ProtectedRoute>
  );
}

function InventoryContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [suppliers, setSuppliers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [newProductOpen, setNewProductOpen] = useState(false);
  const [labelPreview, setLabelPreview] = useState<{
    zpl: string;
    sku: string;
    name: string;
    unitPrice: number;
    count: number;
    quantity: number;
  } | null>(null);

  const form = useForm<NewProductValues>({
    resolver: zodResolver(newProductSchema),
    defaultValues: {
      name: "",
      sku: "",
      unitPrice: 0,
      quantity: 0,
      category: "",
      supplier: ""
    }
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const bundle = await ensureFirebase();
        const { firestore } = bundle;
        const productsSnapshot = await firestore.getDocs(firestore.collection(bundle.db, "products"));
        const loaded: Product[] = productsSnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
        setProducts(loaded);
        const uniqueCategories = Array.from(
          new Set(loaded.map((product) => product.category).filter(Boolean) as string[])
        );
        const uniqueSuppliers = Array.from(
          new Set(loaded.map((product) => product.supplier).filter(Boolean) as string[])
        );
        setCategories(uniqueCategories);
        setSuppliers(uniqueSuppliers);
      } catch (error) {
        console.error(error);
        toast.error("Não foi possível carregar o estoque");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const updateLists = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    setCategories(
      Array.from(new Set(updatedProducts.map((product) => product.category).filter(Boolean) as string[]))
    );
    setSuppliers(
      Array.from(new Set(updatedProducts.map((product) => product.supplier).filter(Boolean) as string[]))
    );
  };

  const handleUpdateProduct = async (id: string, changes: Partial<Product>) => {
    const current = products.find((product) => product.id === id);
    if (!current) return;
    const unitPrice =
      typeof changes.unitPrice === "number" ? Math.max(0, changes.unitPrice) : current.unitPrice;
    const quantity = typeof changes.quantity === "number" ? Math.max(0, changes.quantity) : current.quantity;
    const updated: Product = {
      ...current,
      ...changes,
      unitPrice,
      quantity,
      totalValue: Number((quantity * unitPrice).toFixed(2))
    };

    try {
      const bundle = await ensureFirebase();
      const { firestore } = bundle;
      const productRef = firestore.doc(bundle.db, "products", id);
      await firestore.updateDoc(productRef, {
        name: updated.name,
        sku: updated.sku,
        unitPrice: updated.unitPrice,
        quantity: updated.quantity,
        totalValue: updated.totalValue,
        category: updated.category ?? null,
        supplier: updated.supplier ?? null
      });
      updateLists(products.map((product) => (product.id === id ? updated : product)));
      toast.success("Produto atualizado");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar produto");
    }
  };

  const handleDeleteProducts = async (ids: string[]) => {
    if (!ids.length) return;
    if (!confirm("Excluir produtos selecionados?")) return;
    try {
      const bundle = await ensureFirebase();
      const { firestore } = bundle;
      await Promise.all(
        ids.map((id) => firestore.deleteDoc(firestore.doc(bundle.db, "products", id)))
      );
      updateLists(products.filter((product) => !ids.includes(product.id)));
      toast.success("Produtos excluídos");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir produtos");
    }
  };

  const handleCreateProduct = form.handleSubmit(async (values) => {
    try {
      const bundle = await ensureFirebase();
      const { firestore } = bundle;
      const skuQuery = await firestore.getDocs(
        firestore.query(firestore.collection(bundle.db, "products"), firestore.where("sku", "==", values.sku))
      );
      if (!skuQuery.empty) {
        toast.error("Já existe um produto com este SKU");
        return;
      }
      const totalValue = Number((values.quantity * values.unitPrice).toFixed(2));
      const productData = {
        name: values.name,
        sku: values.sku,
        unitPrice: values.unitPrice,
        quantity: values.quantity,
        totalValue,
        category: values.category || null,
        supplier: values.supplier || null
      };
      const docRef = await firestore.addDoc(firestore.collection(bundle.db, "products"), productData);
      updateLists([...products, { id: docRef.id, ...productData } as Product]);
      toast.success("Produto criado");
      form.reset();
      setNewProductOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar produto");
    }
  });

  const handleGenerateLabels = (selected: Product[], quantity: number) => {
    if (!selected.length) return;
    const zplBlocks = selected
      .map((product) =>
        Array.from({ length: quantity })
          .map(() => generateZPL({ sku: product.sku, name: product.name, unitPrice: product.unitPrice }))
          .join("\n")
      )
      .join("\n");
    const first = selected[0];
    setLabelPreview({
      zpl: zplBlocks,
      sku: first.sku,
      name: first.name,
      unitPrice: first.unitPrice,
      count: selected.length,
      quantity
    });
  };

  const handleExport = () => {
    const payload = JSON.stringify(products, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "products.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!Array.isArray(data)) {
        toast.error("Formato inválido de arquivo");
        return;
      }
      const bundle = await ensureFirebase();
      const { firestore } = bundle;
      const updatedProducts = [...products];
      for (const item of data) {
        if (!item.sku || !item.name) continue;
        const querySnapshot = await firestore.getDocs(
          firestore.query(firestore.collection(bundle.db, "products"), firestore.where("sku", "==", item.sku))
        );
        const docData = {
          name: item.name,
          sku: item.sku,
          unitPrice: Number(item.unitPrice ?? 0),
          quantity: Number(item.quantity ?? 0),
          totalValue: Number(((item.quantity ?? 0) * (item.unitPrice ?? 0)).toFixed(2)),
          category: item.category || null,
          supplier: item.supplier || null
        };
        if (!querySnapshot.empty) {
          const docRef = querySnapshot.docs[0].ref;
          await firestore.updateDoc(docRef, docData);
          const id = querySnapshot.docs[0].id;
          const existingIndex = updatedProducts.findIndex((product) => product.id === id);
          if (existingIndex >= 0) {
            updatedProducts[existingIndex] = { id, ...docData } as Product;
          }
        } else {
          const docRef = await firestore.addDoc(firestore.collection(bundle.db, "products"), docData);
          updatedProducts.push({ id: docRef.id, ...docData } as Product);
        }
      }
      updateLists(updatedProducts);
      toast.success("Importação concluída");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao importar arquivo");
    }
  };

  const handleSeed = async () => {
    try {
      const bundle = await ensureFirebase();
      const { firestore } = bundle;
      const examples = [
        {
          name: "Sabonete Lava Jato",
          sku: "SKU-0001",
          unitPrice: 12.9,
          quantity: 50,
          category: "Higiene",
          supplier: "Império das Espumas"
        },
        {
          name: "Copo Térmico Mustafar",
          sku: "SKU-0002",
          unitPrice: 39.9,
          quantity: 20,
          category: "Utilidades",
          supplier: "Galactic Cups"
        },
        {
          name: "Cabo USB Jedi",
          sku: "SKU-0003",
          unitPrice: 19.9,
          quantity: 80,
          category: "Eletrônicos",
          supplier: "Conselho Tech"
        }
      ];
      const created: Product[] = [];
      for (const item of examples) {
        const totalValue = Number((item.unitPrice * item.quantity).toFixed(2));
        const docRef = await firestore.addDoc(firestore.collection(bundle.db, "products"), {
          ...item,
          totalValue
        });
        created.push({ id: docRef.id, ...item, totalValue });
      }
      updateLists([...products, ...created]);
      toast.success("Dados de exemplo criados");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar dados de exemplo");
    }
  };

  const infoText = useMemo(() => {
    if (!products.length) return "Sem produtos cadastrados ainda.";
    return `${products.length} produtos cadastrados.`;
  }, [products.length]);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Gestão de Estoque</h1>
        <p className="text-sm text-slate-500">
          Cadastre novos produtos, atualize informações em linha e gere etiquetas prontas para impressão Zebra.
        </p>
        <span className="text-xs uppercase tracking-wide text-slate-400">{infoText}</span>
      </header>

      {loading ? (
        <div className="flex min-h-[200px] items-center justify-center text-slate-500">Carregando produtos…</div>
      ) : (
        <EditableTable
          products={products}
          categories={categories}
          suppliers={suppliers}
          onChange={handleUpdateProduct}
          onDelete={handleDeleteProducts}
          onCreate={() => setNewProductOpen(true)}
          onGenerateLabels={handleGenerateLabels}
          onExport={handleExport}
          onImport={handleImport}
          onSeed={handleSeed}
        />
      )}

      <Dialog open={newProductOpen} onOpenChange={setNewProductOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo produto</DialogTitle>
            <DialogDescription>Preencha os dados básicos do produto. O SKU deve ser único.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateProduct} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" {...form.register("name")} />
              {form.formState.errors.name ? (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" {...form.register("sku")} />
              {form.formState.errors.sku ? (
                <p className="text-sm text-red-500">{form.formState.errors.sku.message}</p>
              ) : null}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="unitPrice">Preço unitário</Label>
                <Input id="unitPrice" type="number" step="0.01" min="0" {...form.register("unitPrice")} />
                {form.formState.errors.unitPrice ? (
                  <p className="text-sm text-red-500">{form.formState.errors.unitPrice.message}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantidade</Label>
                <Input id="quantity" type="number" min="0" {...form.register("quantity")} />
                {form.formState.errors.quantity ? (
                  <p className="text-sm text-red-500">{form.formState.errors.quantity.message}</p>
                ) : null}
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select id="category" value={form.watch("category") ?? ""} onChange={(event) => form.setValue("category", event.target.value)}>
                  <option value="">Sem categoria</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier">Fornecedor</Label>
                <Select id="supplier" value={form.watch("supplier") ?? ""} onChange={(event) => form.setValue("supplier", event.target.value)}>
                  <option value="">Sem fornecedor</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier} value={supplier}>
                      {supplier}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setNewProductOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar produto</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(labelPreview)} onOpenChange={(open) => !open && setLabelPreview(null)}>
        <DialogContent className="max-w-3xl">
          {labelPreview ? (
            <div className="space-y-4">
              <DialogHeader>
                <DialogTitle>Etiquetas geradas</DialogTitle>
                <DialogDescription>
                  Pré-visualização da primeira etiqueta. O arquivo conterá {labelPreview.count} produto(s) com {labelPreview.quantity}{" "}
                  etiqueta(s) cada.
                </DialogDescription>
              </DialogHeader>
              <ZPLPreview
                zpl={labelPreview.zpl}
                sku={labelPreview.sku}
                name={labelPreview.name}
                unitPrice={labelPreview.unitPrice}
                fileName={`labels-${labelPreview.sku}`}
                note="Use drivers Zebra compatíveis com ZPL e impressão em 203 dpi."
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
