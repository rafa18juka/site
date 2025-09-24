# Mustafar Variedades – Controle de Estoque

Aplicação web em Next.js 14 (App Router) para controle de estoque do e-commerce Mustafar Variedades. O sistema é otimizado para operação em dispositivos móveis, utiliza Tailwind CSS com componentes shadcn/ui e integrações diretas com Firebase Auth e Firestore (via SDK client-side). Inclui scanner de código de barras Code128, dashboard com gráficos e geração de etiquetas Zebra (ZPL) prontas para impressão.

## Funcionalidades

- **Autenticação Firebase** com papéis `admin` e `staff`.
- **Proteção de rotas** e controle de acesso com base no papel.
- **Scanner de código de barras** (Code128) usando webcam ou câmera do celular.
- **Dashboard administrativo** com métricas de estoque e histórico de saídas, gráficos em Chart.js.
- **Tabela de estoque editável** com criação, importação/exportação de produtos e geração de etiquetas ZPL 40x25 mm.
- **Transações de baixa** com validação de estoque, histórico em `stockMovements` e prevenção de quantidade negativa.
- **Toast notifications** para feedback rápido e estados de carregamento responsivos.

## Pré-requisitos

- Node.js 18+ (recomendado 20).
- Conta Firebase com Firestore e Authentication habilitados.
- Navegador com suporte à API `BarcodeDetector` (Chrome/Edge modernos; para iOS utilize Safari 17+).

## Configuração do ambiente

1. Instale as dependências:

   ```bash
   npm install
   ```

   > Caso esteja rodando em um ambiente restritivo sem acesso ao registry da npm, garanta o download das dependências antes ou configure um mirror liberado.

2. Copie `.env.example` para `.env.local` e preencha os valores do projeto Firebase:

   ```bash
   cp .env.example .env.local
   ```

   | Variável | Descrição |
   | --- | --- |
   | `NEXT_PUBLIC_FIREBASE_API_KEY` | API Key do projeto |
   | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Auth domain |
   | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ID do projeto |
   | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Bucket de storage |
   | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Sender ID |
   | `NEXT_PUBLIC_FIREBASE_APP_ID` | App ID |

3. Publique as regras do Firestore contidas em `firestore.rules`:

   ```bash
   firebase deploy --only firestore:rules
   ```

   As regras garantem que:

   - `staff` pode ler produtos, registrar saídas e apenas reduzir o estoque.
   - `admin` possui CRUD completo em produtos, categorias, fornecedores e leitura total de movimentos.

## Execução local

```bash
npm run dev
```

A aplicação ficará disponível em `http://localhost:3000`.

### Testando o scanner

- Utilize conexão **HTTPS** (por exemplo `https://localhost:3000` com certificado válido) para liberar a câmera em celulares.
- No desktop, escolha a câmera pelo seletor do scanner. Em celulares, adicione o app ao home screen para experiência quase nativa.
- Para ambientes que não suportam `BarcodeDetector`, informe o SKU manualmente.

## Estrutura de rotas

| Rota | Papel | Descrição |
| --- | --- | --- |
| `/login` | público | Autenticação (e-mail + senha). |
| `/scan` | `staff` e `admin` | Scanner de código de barras e baixa de estoque. |
| `/admin/dashboard` | `admin` | Painel com métricas, gráficos, filtros por categoria e fornecedor. |
| `/admin/estoque` | `admin` | Tabela editável de produtos, importação/exportação JSON, etiquetas ZPL e dados de exemplo. |

## Geração de etiquetas (ZPL)

- Função utilitária `generateZPL` localizada em `lib/zpl.ts` produz etiquetas 40x25 mm (203 dpi) com código de barras **Code128**.
- A visualização HTML no modal ajuda a validar o layout antes de enviar para uma impressora Zebra.
- Baixe o arquivo `.zpl` e envie para a impressora via driver ZebraDesigner ou utilitário equivalente.

## Deploy na Vercel

1. Crie o projeto na Vercel e conecte este repositório.
2. Configure as variáveis de ambiente (`NEXT_PUBLIC_FIREBASE_*`).
3. Defina o build command como `npm run build` e output default (`.next`).
4. Após o deploy, atualize as URLs autorizadas no Firebase (Auth > Configurações > Domínios autorizados).

## Dicas adicionais

- Use a ação “Criar dados de exemplo” em `/admin/estoque` para popular produtos fictícios durante a homologação.
- Exportações JSON podem ser importadas novamente para migração rápida entre ambientes.
- Para evitar erros de câmera em celulares Android, confira se o app está acessando via `https://` e com permissão explícita de câmera.

## Scripts úteis

| Script | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Build para produção |
| `npm run start` | Servidor em modo produção |
| `npm run lint` | Verificação com ESLint |

Boa gestão e que a Força esteja com o seu estoque!
