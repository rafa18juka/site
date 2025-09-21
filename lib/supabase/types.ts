export type Image = {
  id: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
  prioridade?: number;
};

export type ModelVariation = {
  id: string;
  titulo: string;
  descricao?: string;
  imagens: Image[];
};

export type Model = {
  id: string;
  slug: string;
  nome: string;
  categoria: "sofa" | "diva" | "poltrona";
  formatos: string[];
  tecidos: string[];
  cores: string[];
  descricao: string;
  specs: Record<string, string>;
  tags: string[];
  imagens: Image[];
  detalhes?: Image[];
  variacoes: ModelVariation[];
  destaque: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Post = {
  id: string;
  slug: string;
  titulo: string;
  capaUrl?: string;
  conteudo: string;
  tags: string[];
  status: "rascunho" | "publicado";
  createdAt?: string;
  updatedAt?: string;
};

export type PedidoEtapa = {
  id: string;
  status: PedidoStatus;
  titulo: string;
  descricao?: string;
  data?: string;
  concluido: boolean;
};

export type Pedido = {
  id: string;
  pedidoId: string;
  cpfHash: string;
  cliente?: string;
  etapas: PedidoEtapa[];
  notasInternas?: string;
  createdAt: string;
  updatedAt: string;
};

export type PedidoStatus =
  | "recebido"
  | "em-producao"
  | "em-acabamento"
  | "embalado"
  | "pronto-para-envio"
  | "em-transporte"
  | "entregue";

export type Comment = {
  id: string;
  postId: string;
  nome: string;
  mensagem: string;
  aprovado: boolean;
  createdAt?: string;
};
