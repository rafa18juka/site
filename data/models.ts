import { nanoid } from "nanoid";
import type { Model } from "@/lib/supabase/types";

const defaultSpecs = {
  Estrutura: "Madeira de reflorestamento tratada",
  Espumas: "Densidade progressiva com manta hipersoft",
  Tecidos: "Linho premium, suede, boucle, couro ecologico",
  Garantia: "3 anos de estrutura"
};

const createModel = (model: Omit<Model, "id" | "createdAt" | "updatedAt">): Model => ({
  id: nanoid(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...model
});

const buildModelImages = (
  slug: string,
  count: number,
  {
    altBase,
    width = 1600,
    height = 1200,
    extension = "webp"
  }: {
    altBase?: string;
    width?: number;
    height?: number;
    extension?: string;
  } = {}
) =>
  Array.from({ length: count }, (_, index) => {
    const suffix = String(index + 1).padStart(2, "0");
    return {
      id: nanoid(),
      url: `/assets/modelos/${slug}/${suffix}.${extension}`,
      alt: `${altBase ?? `Modelo ${slug}`} - imagem ${suffix}`,
      width,
      height,
      ...(index === 0 ? { prioridade: 1 } : {})
    };
  });

const buildDetailImages = (
  slug: string,
  count: number,
  {
    altBase,
    width = 800,
    height = 800,
    extension = "webp"
  }: {
    altBase?: string;
    width?: number;
    height?: number;
    extension?: string;
  } = {}
) =>
  Array.from({ length: count }, (_, index) => {
    const suffix = String(index + 1).padStart(2, "0");
    const base = altBase ?? `Detalhe ${slug}`;
    return {
      id: nanoid(),
      url: `/assets/modelos/${slug}/detalhe${suffix}.${extension}`,
      alt: `${base} ${suffix}`,
      width,
      height
    };
  });

export const MODELS: Model[] = [
  createModel({
    slug: "turquia",
    nome: "Turquia",
    categoria: "sofa",
    formatos: ["reto", "chaise"],
    tecidos: ["linho", "boucle",],
    cores: ["off-white", "cinza", "areia"],
    descricao:
      "Sofa modular com encosos moveis, design moderno e sofisticado.",
    specs: {
      ...defaultSpecs,
      Profundidade: "1,00 m",
      Altura: "0,40 m",
      Modulos: "1,80 m | 1,00 m | chaise 1,60 m"
    },
    tags: ["modular", "encosto movel", "moderno"],
    destaque: true,
    imagens: buildModelImages("turquia", 7, { altBase: "Sofa Turquia", width: 1600, height: 1200 }),
    detalhes: buildDetailImages("turquia", 3, { altBase: "Sofa Turquia", width: 1600, height: 1200 }),
    variacoes: []
  }),
  createModel({
    slug: "madri",
    nome: "Madri",
    categoria: "sofa",
    formatos: ["reto"],
    tecidos: ["linho", "suede", "boucle","veludo"],
    cores: ["areia", "grafite", "champagne"],
    descricao:
      "Sofá moderno com almofadas de encosto e lombar destacáveis",
    specs: {
      ...defaultSpecs,
      Profundidade: "0,95 m",
      Altura: "0,40 m",
      Modulos: "2.16 m"
    },
    tags: ["Confortavel", "estiloso"],
    destaque: true,
    imagens: buildModelImages("madri", 7, { altBase: "Sofa Madri", width: 1600, height: 1200 }),
    detalhes: buildDetailImages("madri", 3, { altBase: "Sofa Madri", width: 1600, height: 1200 }),
    variacoes: []
  }),
  createModel({
    slug: "veneza",
    nome: "Veneza",
    categoria: "sofa",
    formatos: ["canto", "l" ,"ilha"],
    tecidos: ["veludo", "linho", "suede"],
    cores: ["carvalho", "off-white", "marinho", "terracota"],
    descricao:
      "Sofá moderno com linhas retas e design versátil para qualquer ambiente.",
    specs: {
      ...defaultSpecs,
      Profundidade: "0,9 m",
      Altura: "0,45 m",
      Modulos: "2,35 m x 2,40 m"
    },
    tags: ["canto", "metal" ,"ilha"],
    destaque: false,
    imagens: buildModelImages("veneza", 7, { altBase: "Sofa Veneza", width: 1600, height: 1200 }),
    detalhes: buildDetailImages("veneza", 3, { altBase: "Sofa Veneza", width: 1600, height: 1200 }),
    variacoes: []
  }),
  createModel({
    slug: "valencia",
    nome: "Valencia",
    categoria: "sofa",
    formatos: ["ilha", "reto" ,"chaise"],
    tecidos: ["linho", "suede", "boucle"],
    cores: ["off-white", "caramelo","cinza"],
    descricao:
      "Sofá prático e elegante, combina com ambientes amplos ou compactos.",
    specs: {
      ...defaultSpecs,
      Profundidade: "0,9 m",
      Altura: "0,40 m",
      Modulos: "2,35 m x chaise 1,65 m"
    },
    tags: ["caise", "reto"],
    destaque: true,
    imagens: buildModelImages("valencia", 7, { altBase: "Sofa Valencia", width: 1600, height: 1200 }),
    detalhes: buildDetailImages("valencia", 3, { altBase: "Sofa Valencia", width: 1600, height: 1200 }),
    variacoes: []
  }),
  createModel({
    slug: "roma",
    nome: "Roma",
    categoria: "sofa",
    formatos: ["reto", "chaise"],
    tecidos: ["linho", "veludo"],
    cores: ["cinza", "taupe","off-white"],
    descricao:
      "Design italiano com cantos chanfrados, triplo jogo de almofadas",
    specs: {
      ...defaultSpecs,
      Profundidade: "1,10 m",
      Altura: "0,40 m",
      Modulos: "1,9 m"
    },
    tags: ["italiano", "soft"],
    destaque: false,
    imagens: buildModelImages("roma", 7, { altBase: "Sofa Roma", width: 1600, height: 1200 }),
    detalhes: buildDetailImages("roma", 3, { altBase: "Sofa Roma", width: 1600, height: 1200 }),
    variacoes: []
  }),
  createModel({
    slug: "ravenna",
    nome: "Ravenna",
    categoria: "sofa",
    formatos: ["canto", "l" ,"chaise"],
    tecidos: ["linho", "suede" ,"couro ecologico"],
    cores: ["grafite", "areia", "cinza"],
    descricao:
      "Sofá neutro e sofisticado, combina facilmente com qualquer estilo.",
    specs: {
      ...defaultSpecs,
      Profundidade: "0,9 m",
      Altura: "0,44 m",
      Modulos: "2,85 x chaise 1,3m"
    },
    tags: ["home theater", "chaise dupla"],
    destaque: false,
    imagens: buildModelImages("ravenna", 7, { altBase: "Sofa Ravenna", width: 1600, height: 1200 }),
    detalhes: buildDetailImages("ravenna", 3, { altBase: "Sofa Ravenna", width: 1600, height: 1200 }),
    variacoes: []
  }),
  createModel({
    slug: "dubai",
    nome: "Dubai",
    categoria: "sofa",
    formatos: ["reto"],
    tecidos: ["sarja"],
    cores: ["amarelo", "grafite", "preto","vermelho"],
    descricao:
      "Sofá macio com estrutura dos assentos em fibra, sofá bem profundo.",
    specs: {
      ...defaultSpecs,
      Profundidade: "1,20 m",
      Altura: "0,35 m",
      Modulos: "2,40 m"
    },
    tags: ["soft", "sarja"],
    destaque: true,
    imagens: buildModelImages("dubai", 7, { altBase: "Sofa Dubai", width: 1600, height: 1200 }),
    detalhes: buildDetailImages("dubai", 3, { altBase: "Sofa Dubai", width: 1600, height: 1200 }),
    variacoes: []
  }),
  createModel({
    slug: "brooklin",
    nome: "Brooklin",
    categoria: "sofa",
    formatos: ["l", "chaise" ,"canto"],
    tecidos: ["boucle", "linho","veludo","couro ecologico"],
    cores: ["creme", "areia", "neve"],
    descricao:
      "Modelo elegante, conforto envolvente em um design discreto e sofisticado.",
    specs: {
      ...defaultSpecs,
      Profundidade: "0,90m",
      Altura: "0,40 m",
      Modulos: "2,20 m x 3,30 m"
    },
    tags: ["canto", "sofisticado"],
    destaque: true,
    imagens: buildModelImages("brooklin", 7, { altBase: "Sofa Brooklin", width: 1600, height: 1200 }),
    detalhes: buildDetailImages("brooklin", 3, { altBase: "Sofa Brooklin", width: 1600, height: 1200 }),
    variacoes: []
  }),
  createModel({
    slug: "amsterda",
    nome: "Amsterda",
    categoria: "sofa",
    formatos: ["reto", "l"],
    tecidos: ["linho", "veludo"],
    cores: ["antracito", "off-white" ,"verde"],
    descricao:
      "Sofá compacto com design bem luxuoso, almofadas de fibra bem macias",
    specs: {
      ...defaultSpecs,
      Profundidade: "0,9 m",
      Altura: "0,45m",
      Modulos: "2,20 m"
    },
    tags: ["moderno", "base alta"],
    destaque: false,
    imagens: buildModelImages("amsterda", 7, { altBase: "Sofa Amsterda", width: 1600, height: 1200 }),
    detalhes: buildDetailImages("amsterda", 3, { altBase: "Sofa Amsterda", width: 1600, height: 1200 }),
    variacoes: []
  }),
  createModel({
    slug: "sofa-ilha",
    nome: "Sofa Ilha",
    categoria: "sofa",
    formatos: ["ilha"],
    tecidos: ["linho", "boucle"],
    cores: ["off-white", "terracota"],
    descricao:
      "Sofa ilha com encostos moveis de duplo acesso e modulos reversiveis. Ideal para lofts abertos.",
    specs: {
      ...defaultSpecs,
      Profundidade: "1,60 m",
      Altura: "0,43 m",
      Modulos: "1,00 m x 1,60 m"
    },
    tags: ["ilha", "reversivel"],
    destaque: true,
    imagens: buildModelImages("sofa-ilha", 7, { altBase: "Sofa Ilha", width: 1600, height: 1200 }),
    detalhes: buildDetailImages("sofa-ilha", 3, { altBase: "Sofa Ilha", width: 1600, height: 1200 }),
    variacoes: []
  }),
  createModel({
    slug: "ruscky",
    nome: "Ruscky",
    categoria: "sofa",
    formatos: ["reto" ,"ilha"],
    tecidos: ["veludo", "linho"],
    cores: ["caramelo", "chumbo"],
    descricao:
      "Modelo pratico e versatil, em ilha comencosto fixo conforto firme e visual marcante.",
    specs: {
      ...defaultSpecs,
      Profundidade: "1,6 m",
      Altura: "0,45 m",
      Modulos: "2,30 m"
    },
    tags: ["ilha", "statement"],
    destaque: false,
    imagens: buildModelImages("ruscky", 7, { altBase: "Sofa Ruscky", width: 1600, height: 1200 }),
    detalhes: buildDetailImages("ruscky", 3, { altBase: "Sofa Ruscky", width: 1600, height: 1200 }),
    variacoes: []
  }),
  createModel({
    slug: "milao",
    nome: "Milao",
    categoria: "sofa",
    formatos: ["l", "canto"],
    tecidos: ["linho", "boucle","sarja"],
    cores: ["areia", "noz","aul"],
    descricao:
      "Modulos com assentos soltos e almofadas em pluma siliconada.",
    specs: {
      ...defaultSpecs,
      Profundidade: "1,00 m",
      Altura: "0,45 m",
      Modulos: "3,5 m x chaise 1,6 m"
    },
    tags: ["lombar", "pluma"],
    destaque: false,
    imagens: buildModelImages("milao", 7, { altBase: "Sofa Milao", width: 1600, height: 1200 }),
    detalhes: buildDetailImages("milao", 3, { altBase: "Sofa Milao", width: 1600, height: 1200 }),
    variacoes: []
  }),
  createModel({
    slug: "noruega",
    nome: "Noruega",
    categoria: "sofa",
    formatos: ["reto" ,"canto","ilha","L"],
    tecidos: ["la", "linho","veludo"],
    cores: ["off-white", "cinza claro"],
    descricao:
      "Design marcante, costuras sobresalentes e dupla almofada, campeão de vendas",
    specs: {
      ...defaultSpecs,
      Profundidade: "0,90 m",
      Altura: "0,45 m",
      Modulos: "2,20 m x 2,35"
    },
    tags: ["escandinavo", "madeira","canto","moderno"],
    destaque: false,
    imagens: buildModelImages("noruega", 7, { altBase: "Sofa Noruega", width: 1600, height: 1200 }),
    detalhes: buildDetailImages("noruega", 3, { altBase: "Sofa Noruega", width: 1600, height: 1200 }),
    variacoes: []
  }),
  createModel({
    slug: "paris",
    nome: "Paris",
    categoria: "sofa",
    formatos: ["chaise", "reto","canto"],
    tecidos: ["linho", "veludo"],
    cores: ["champagne", "cinza perola","azul"],
    descricao:"Sofa com cantos arredondados, bem compacto e elegante.",
    specs: {
      ...defaultSpecs,
      Profundidade: "0,85 m",
      Altura: "0,40 m",
      Modulos: "2,50 m + chaise 1,60 m"
    },
    tags: ["arredondado", "compacto"],
    destaque: false,
    imagens: buildModelImages("paris", 7, { altBase: "Sofa Paris", width: 1600, height: 1200 }),
    detalhes: buildDetailImages("paris", 3, { altBase: "Sofa Paris", width: 1600, height: 1200 }),
    variacoes: []
  }),
  createModel({
    slug: "boston",
    nome: "Boston",
    categoria: "sofa",
    formatos: ["reto", "l","ilha"],
    tecidos: ["linho", "sarja"],
    cores: ["cinza carvao", "areia"],
    descricao:
      "Visual moderno com design simples mas elegante.",
    specs: {
      ...defaultSpecs,
      Profundidade: "1,05 m",
      Altura: "0,40 m",
      Modulos: "2,50 m"
    },
    tags: ["confortavel", "moderno"],
    destaque: false,
    imagens: buildModelImages("boston", 7, { altBase: "Sofa Boston", width: 1600, height: 1200 }),
    detalhes: buildDetailImages("boston", 3, { altBase: "Sofa Boston", width: 1600, height: 1200 }),
    variacoes: []
  }),
  createModel({
    slug: "vottorio",
    nome: "Vottorio",
    categoria: "sofa",
    formatos: ["reto", "chaise"],
    tecidos: ["linho", "veludo"],
    cores: ["camel", "cinza"],
    descricao:
      "Costuras detalhes de costura nos assentos esse modelo esbanja elegancia ",
    specs: {
      ...defaultSpecs,
      Profundidade: "0,9m",
      Altura: "0,45 m",
      Modulos: "2,90 m"
    },
    tags: ["pesponto", "metal"],
    destaque: false,
    imagens: buildModelImages("vottorio", 7, { altBase: "Sofa Vottorio", width: 1600, height: 1200 }),
    detalhes: buildDetailImages("vottorio", 3, { altBase: "Sofa Vottorio", width: 1600, height: 1200 }),
    variacoes: []
  }),
  createModel({
    slug: "grecia",
    nome: "Grecia",
    categoria: "sofa",
    formatos: ["reto"],
    tecidos: ["linho", "suede"],
    cores: ["fendi", "areia","off white"],
    descricao:
      "Design luxuoso, com almofadas de encosto dupla e um destque para os rolinhos acompanhando o design.",
    specs: {
      ...defaultSpecs,
      Profundidade: "0,9 m",
      Altura: "0,45 m",
      Modulos: "2,90 m"
    },
    tags: ["estiloso", "elegante"],
    destaque: false,
    imagens: buildModelImages("grecia", 7, { altBase: "Sofa Grecia", width: 1600, height: 1200 }),
    detalhes: buildDetailImages("grecia", 3, { altBase: "Sofa Grecia", width: 1600, height: 1200 }),
    variacoes: []
  }),
  // Divas
  createModel({
    slug: "diva-luxemburgo",
    nome: "Diva Luxemburgo",
    categoria: "diva",
    formatos: ["reto"],
    tecidos: ["veludo", "linho"],
    cores: ["champagne", "preto"],
    descricao: "Diva com roletes laterais e base metalica minimalista.",
    specs: {
      ...defaultSpecs,
      Comprimento: "1,80 m",
      Altura: "0,40 m",
      Profundidade: "0,80 m"
    },
    tags: ["escultural", "metal"],
    destaque: true,
    imagens: buildModelImages("luxemburgo", 7, { altBase: "Diva Luxemburgo", width: 1400, height: 1000 }),
    detalhes: buildDetailImages("luxemburgo", 3, { altBase: "Diva Luxemburgo", width: 1400, height: 1000 }),
    variacoes: []
  }),
  createModel({
    slug: "diva-monaco",
    nome: "Diva Monaco",
    categoria: "diva",
    formatos: ["reto"],
    tecidos: ["boucle", "linho"],
    cores: ["off-white", "grafite"],
    descricao: "Diva contemporanea com encosto arredondado e pes em madeira macica.",
    specs: {
      ...defaultSpecs,
      Comprimento: "1,90 m",
      Altura: "0,40 m",
      Profundidade: "0,70 m"
    },
    tags: ["assimetrico", "boucle"],
    destaque: false,
    imagens: buildModelImages("monaco", 7, { altBase: "Diva Monaco", width: 1400, height: 1000 }),
    detalhes: buildDetailImages("monaco", 3, { altBase: "Diva Monaco", width: 1400, height: 1000 }),
    variacoes: []
  }),
  createModel({
    slug: "diva-cizar",
    nome: "Diva Cizar",
    categoria: "diva",
    formatos: ["reto"],
    tecidos: ["veludo", "linho"],
    cores: ["esmeralda", "chumbo"],
    descricao: "Diva clasico e muito versátil, pode ser utilizado para diversas finalidades.",
    specs: {
      ...defaultSpecs,
      Comprimento: "1,7m",
      Altura: "0,40 m",
      Profundidade: "0,70 m"
    },
    tags: ["escritorio", "diva"],
    destaque: false,
    imagens: buildModelImages("cizar", 7, { altBase: "Diva Cizar", width: 1400, height: 1000 }),
    detalhes: buildDetailImages("cizar", 3, { altBase: "Diva Cizar", width: 1400, height: 1000 }),
    variacoes: []
  }),
  // Poltronas
  createModel({
    slug: "poltrona-dila",
    nome: "Poltrona Dila",
    categoria: "poltrona",
    formatos: ["fixa"],
    tecidos: ["boucle", "linho"],
    cores: ["off-white", "cinza"],
    descricao: "Poltrona elegante com braços de madeira maçica",
    specs: {
      Estrutura: "braços em eucalipto",
      Giro: "fixo",
      Altura: "0,78 m",
      Largura: "0,86 m"
    },
    tags: ["fixa", "boucle"],
    destaque: true,
    imagens: buildModelImages("poltrona-dila", 7, { altBase: "Poltrona Dila", width: 1200, height: 1200 }),
    detalhes: buildDetailImages("poltrona-dila", 3, { altBase: "Poltrona Dila", width: 1200, height: 1200 }),
    variacoes: []
  }),
  createModel({
    slug: "poltrona-cleo",
    nome: "Poltrona Cleo",
    categoria: "poltrona",
    formatos: ["fixa"],
    tecidos: ["veludo", "linho"],
    cores: ["caramelo", "esmeralda"],
    descricao: "Poltrona com bracos organicos e pesponto aparente.",
    specs: {
      Estrutura: "Madeira de reflorestamento",
      Altura: "0,82 m",
      Largura: "0,78 m",
      Profundidade: "0,85 m"
    },
    tags: ["organico", "pesponto"],
    destaque: false,
    imagens: buildModelImages("poltrona-cleo", 7, { altBase: "Poltrona Cleo", width: 1200, height: 1200 }),
    detalhes: buildDetailImages("poltrona-cleo", 3, { altBase: "Poltrona Cleo", width: 1200, height: 1200 }),
    variacoes: []
  }),
  createModel({
    slug: "poltrona-valentina",
    nome: "Poltrona Valentina",
    categoria: "poltrona",
    formatos: ["giro", "fixa"],
    tecidos: ["linho", "veludo"],
    cores: ["preto", "areia"],
    descricao: "Assento concavo com apoio lombar destacado e pes metalicos champagne.",
    specs: {
      Estrutura: "Aco carbono com pintura champagne",
      Altura: "0,84 m",
      Largura: "0,80 m",
      Profundidade: "0,85 m"
    },
    tags: ["metal", "assinatura"],
    destaque: false,
    imagens: buildModelImages("poltrona-valentina", 7, { altBase: "Poltrona Valentina", width: 1200, height: 1200 }),
    detalhes: buildDetailImages("poltrona-valentina", 3, { altBase: "Poltrona Valentina", width: 1200, height: 1200 }),
    variacoes: []
  }),
  createModel({
    slug: "poltrona-bell",
    nome: "Poltrona Bell",
    categoria: "poltrona",
    formatos: ["fixa"],
    tecidos: ["boucle", "linho"],
    cores: ["gelo", "areia"],
    descricao: "Poltrona concha com costuras geometricas e base demadeira .",
    specs: {
      Estrutura: "Elegante e confiavel",
      Altura: "0,80 m",
      Largura: "0,75 m",
      Profundidade: "0,82 m"
    },
    tags: ["concha", "geometrico"],
    destaque: false,
    imagens: buildModelImages("poltrona-bell", 7, { altBase: "Poltrona Bell", width: 1200, height: 1200 }),
    detalhes: buildDetailImages("poltrona-bell", 3, { altBase: "Poltrona Bell", width: 1200, height: 1200 }),
    variacoes: []
  }),
  createModel({
    slug: "poltrona-mona",
    nome: "Poltrona Mona",
    categoria: "poltrona",
    formatos: ["fixa"],
    tecidos: ["linho", "veludo"],
    cores: ["champagne", "cinza claro"],
    descricao: "Poltrona com base giratoria em inox champagne e encosto abracante.",
    specs: {
      Estrutura: "Base giratoria em inox",
      Altura: "0,86 m",
      Largura: "0,82 m",
      Profundidade: "0,85 m"
    },
    tags: ["giratoria", "inox"],
    destaque: false,
    imagens: buildModelImages("poltrona-mona", 7, { altBase: "Poltrona Mona", width: 1200, height: 1200 }),
    detalhes: buildDetailImages("poltrona-mona", 3, { altBase: "Poltrona Mona", width: 1200, height: 1200 }),
    variacoes: []
  })
];

export const MODEL_FILTERS = {
  categoria: [
    { value: "sofa", label: "Sofas" },
    { value: "diva", label: "Divas" },
    { value: "poltrona", label: "Poltronas" }
  ],
  formatos: ["reto", "chaise", "l", "canto", "ilha", "giro"],
  tecidos: ["linho", "boucle", "veludo", "suede", "la", "sarja", "couro ecologico"],
  cores: ["off-white", "cinza", "areia", "champagne", "caramelo", "grafite", "preto", "esmeralda"],
  tamanhos: ["compacto", "medio", "grande"]
};


