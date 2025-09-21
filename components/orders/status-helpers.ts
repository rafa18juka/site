import type { PedidoStatus } from "@/lib/supabase/types";

export const STATUS_ORDER: PedidoStatus[] = [
  "recebido",
  "em-producao",
  "em-acabamento",
  "embalado",
  "pronto-para-envio",
  "em-transporte",
  "entregue"
];

export const STATUS_LABELS: Record<PedidoStatus, string> = {
  recebido: "Pedido recebido",
  "em-producao": "Em produção",
  "em-acabamento": "Acabamento",
  embalado: "Embalado",
  "pronto-para-envio": "Pronto para envio",
  "em-transporte": "Em transporte",
  entregue: "Entregue"
};

export const STATUS_DESCRIPTIONS: Partial<Record<PedidoStatus, string>> = {
  recebido: "Pagamentos e dados confirmados.",
  "em-producao": "Estrutura do sofá em produção.",
  "em-acabamento": "Tecidos e acabamentos em execução.",
  embalado: "Produto embalado e protegido.",
  "pronto-para-envio": "Aguardando agendamento da coleta.",
  "em-transporte": "Em deslocamento para o endereço informado.",
  entregue: "Produto entregue ao cliente." 
};
