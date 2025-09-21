"use client";

import { ChangeEvent, FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { buildWhatsAppLink } from "@/lib/whatsapp";

interface FormState {
  buyer: string;
  product: string;
  orderNumber: string;
  receivedAt: string;
  description: string;
}

const INITIAL_STATE: FormState = {
  buyer: "",
  product: "",
  orderNumber: "",
  receivedAt: "",
  description: ""
};

export function WarrantyForm() {
  const [formState, setFormState] = useState<FormState>(INITIAL_STATE);
  const [isSending, setIsSending] = useState(false);

  const updateField = <K extends keyof FormState>(key: K) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormState((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSending(true);

    const { buyer, product, orderNumber, receivedAt, description } = formState;

    const formattedDate = receivedAt ? new Date(receivedAt).toLocaleDateString("pt-BR") : "Data não informada";

    const message = [
      "Olá, Letícia! Gostaria de abrir um chamado de garantia Ralph Couch.",
      "",
      `• Cliente: ${buyer || "Não informado"}`,
      `• Produto: ${product || "Não informado"}`,
      `• Nº do pedido: ${orderNumber || "Não informado"}`,
      `• Recebido em: ${formattedDate}`,
      "",
      "Descrição do ocorrido:",
      description || "(sem descrição)"
    ].join("\n");

    const link = buildWhatsAppLink({ seller: "leticia", message });

    window.open(link, "_blank");
    setFormState(INITIAL_STATE);
    setIsSending(false);
  };

  return (
    <form className="grid gap-6" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="buyer">Nome completo do comprador</Label>
          <Input
            id="buyer"
            value={formState.buyer}
            onChange={updateField("buyer")}
            placeholder="Informe como está na Nota Fiscal"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="product">Nome do produto</Label>
          <Input
            id="product"
            value={formState.product}
            onChange={updateField("product")}
            placeholder="Ex.: Sofá Veneza 3 lugares"
            required
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="order">Número do pedido</Label>
          <Input
            id="order"
            value={formState.orderNumber}
            onChange={updateField("orderNumber")}
            placeholder="Informe o código do seu pedido"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="receivedAt">Data de recebimento</Label>
          <Input
            id="receivedAt"
            type="date"
            value={formState.receivedAt}
            onChange={updateField("receivedAt")}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Descreva o ocorrido</Label>
        <Textarea
          id="description"
          value={formState.description}
          onChange={updateField("description")}
          placeholder="Conte como o produto está sendo utilizado e o que aconteceu"
          rows={6}
          required
        />
      </div>
      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSending}>
        {isSending ? "Abrindo chamado..." : "Enviar via WhatsApp"}
      </Button>
    </form>
  );
}

