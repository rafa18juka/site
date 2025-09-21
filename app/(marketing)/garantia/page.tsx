import type { Metadata } from "next";

import { WarrantyForm } from "@/components/sections/warranty-form";

export const metadata: Metadata = {
  title: "Garantia Ralph Couch",
  description:
    "Conheça o certificado de garantia Ralph Couch: cobertura, exclusões e como solicitar assistência especializada.",
  alternates: {
    canonical: "/garantia"
  }
};

export default function GarantiaPage() {
  return (
    <main className="bg-brand-muted/40">
      <div className="container space-y-16 py-20">
        <header className="max-w-3xl space-y-4">
          <span className="tag">Garantia Ralph Couch</span>
          <h1 className="text-4xl font-display text-brand-charcoal">Certificado de Garantia — Ralph Couch</h1>
          <p className="text-brand-charcoal/70">
            Obrigado por escolher a Ralph Couch. Cada sofá é fabricado sob medida, com controle de qualidade em todas as etapas.
            Este certificado descreve sua cobertura contratual e como acionar a garantia.
          </p>
        </header>

        <section className="space-y-12">
          <article className="space-y-6 rounded-3xl bg-white/90 p-8 shadow-luxe">
            <h2 className="text-2xl font-display text-brand-charcoal">1) Prazo e escopo da cobertura</h2>
            <div className="space-y-4 text-brand-charcoal/80">
              <p>
                <strong className="text-brand-charcoal">Estrutura</strong> (base, travessas, chassi de madeira/metal): 3 anos de garantia contra defeitos de fabricação.
              </p>
              <p>
                <strong className="text-brand-charcoal">Demais componentes</strong> (espumas, percintas/molas, costuras, zíperes, mecanismos de abertura/reclino e regulagens):
                1 ano contra defeitos de fabricação.
              </p>
              <div className="rounded-2xl bg-brand-muted/60 p-4 text-sm">
                <p className="font-semibold text-brand-charcoal">Transporte (frete) quando houver necessidade de assistência na fábrica:</p>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  <li>
                    <strong className="text-brand-charcoal">Até 3 meses da entrega:</strong> a Ralph Couch arca com o frete de ida e volta após validação do defeito coberto.
                  </li>
                  <li>
                    <strong className="text-brand-charcoal">Após 3 meses:</strong> o envio até a fábrica e a devolução ficam por conta do cliente (pode ser carreto próprio,
                    transportadora ou outra modalidade à escolha do cliente).
                  </li>
                </ul>
              </div>
            </div>
          </article>

          <article className="space-y-4 rounded-3xl bg-white/90 p-8 shadow-luxe">
            <h2 className="text-2xl font-display text-brand-charcoal">2) O que esta garantia cobre</h2>
            <p className="text-brand-charcoal/80">Defeitos de fabricação que comprometam o uso normal do produto, por exemplo:</p>
            <ul className="list-disc space-y-2 pl-5 text-brand-charcoal/80">
              <li>Quebra de estrutura sem indício de mau uso;</li>
              <li>Mecanismos com falha de fabricação;</li>
              <li>Espumas com colapso anormal (fora do comportamento esperado de acomodação);</li>
              <li>Costuras que se abram por vício de fabricação.</li>
            </ul>
          </article>

          <article className="space-y-4 rounded-3xl bg-white/90 p-8 shadow-luxe">
            <h2 className="text-2xl font-display text-brand-charcoal">3) O que não é coberto (exclusões usuais do setor)</h2>
            <ul className="list-disc space-y-2 pl-5 text-brand-charcoal/80">
              <li>
                Desgaste natural de uso e variações estéticas não caracterizadas como defeito, como formação de bolinhas (pilling),
                vincos, acomodação de espuma e fibra, variações de tonalidade, desbotamento por luz/sol e manchas por líquidos,
                calor, produtos químicos ou abrasivos.
              </li>
              <li>Enrugamentos por uso, escorregamento do tecido e marcas de pressão.</li>
              <li>Danos por mau uso, impacto, umidade, fungos, animais de estimação, cortes, perfurações ou queimaduras.</li>
              <li>Alterações, reparos ou lavagem por terceiros não autorizados.</li>
              <li>Remoção/violação de etiquetas de identificação.</li>
              <li>Instalação e/ou transporte inadequados realizados por terceiros.</li>
            </ul>
          </article>

          <article className="space-y-6 rounded-3xl bg-white/90 p-8 shadow-luxe">
            <h2 className="text-2xl font-display text-brand-charcoal">4) Como acionar a garantia (passo a passo)</h2>
            <ol className="list-decimal space-y-3 pl-5 text-brand-charcoal/80">
              <li>Localize sua Nota Fiscal e número do pedido.</li>
              <li>
                Registre a solicitação pelo nosso canal oficial (site/WhatsApp/e-mail), anexando fotos/vídeos que evidenciem o
                ponto reclamado e uma breve descrição do uso/ocorrência.
              </li>
              <li>
                Nossa equipe técnica fará uma triagem em até 5 dias úteis; se necessário, poderá solicitar imagens adicionais,
                visita técnica ou o envio do produto/peça para análise.
              </li>
              <li>
                <strong className="text-brand-charcoal">Validação e solução:</strong> sendo constatado defeito coberto, a Ralph Couch realizará reparo ou substituição do
                componente/peça (ou do produto, quando aplicável) dentro de prazo razoável.
              </li>
            </ol>
            <div className="rounded-2xl bg-brand-muted/60 p-4 text-sm">
              <p className="font-semibold text-brand-charcoal">Logística:</p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  <strong className="text-brand-charcoal">Até 3 meses da entrega:</strong> frete por nossa conta (ida/volta).
                </li>
                <li>
                  <strong className="text-brand-charcoal">Após 3 meses:</strong> frete por conta do cliente (ida/volta).
                </li>
                <li>
                  Se a análise constatar ausência de defeito de fabricação ou exclusão de garantia, o retorno ocorrerá por conta do
                  cliente com orçamento prévio.
                </li>
              </ul>
            </div>
          </article>

          <article className="space-y-4 rounded-3xl bg-white/90 p-8 shadow-luxe">
            <h2 className="text-2xl font-display text-brand-charcoal">5) Condições gerais</h2>
            <ul className="list-disc space-y-2 pl-5 text-brand-charcoal/80">
              <li>A garantia não se renova após reparo/substituição; os prazos contam da data de entrega do produto.</li>
              <li>Este certificado é intransferível e válido exclusivamente para o primeiro comprador, com nota fiscal.</li>
              <li>Produtos em mostruário seguem condições informadas na venda.</li>
              <li>
                Diferenças normais entre amostras e produto final (ex.: sentido do fio, lote de tingimento, toque do tecido) não
                caracterizam defeito.
              </li>
            </ul>
          </article>

          <article className="space-y-4 rounded-3xl bg-white/90 p-8 shadow-luxe">
            <h2 className="text-2xl font-display text-brand-charcoal">6) Cuidados e manutenção recomendados</h2>
            <ul className="list-disc space-y-2 pl-5 text-brand-charcoal/80">
              <li>Aspirar periodicamente; limpeza leve com pano macio umedecido e sabão neutro (evitar solventes/abrasivos).</li>
              <li>Evitar sol direto e calor excessivo.</li>
              <li>Girar almofadas e não se sentar sobre braços/encostos.</li>
              <li>
                Seguir instruções específicas do tecido escolhido (alguns têm maior propensão a pilling; uso de removedores de
                pilling é cosmético e não configura vício do produto).
              </li>
            </ul>
          </article>

          <article className="space-y-4 rounded-3xl bg-white/90 p-8 shadow-luxe">
            <h2 className="text-2xl font-display text-brand-charcoal">7) Produtos de outros fabricantes (revenda)</h2>
            <p className="text-brand-charcoal/80">
              Para itens comercializados pela Ralph Couch que não são de fabricação própria, aplica-se a garantia contratual do
              respectivo fabricante por 3 (três) meses, contados da data de entrega/compra, conforme políticas do próprio fabricante.
            </p>
            <ul className="list-disc space-y-2 pl-5 text-brand-charcoal/80">
              <li>
                <strong className="text-brand-charcoal">Acionamento:</strong> mediante solicitação do cliente, informaremos o número do SAC e/ou canal oficial do fabricante
                responsável pelo produto, para abertura do chamado diretamente com ele.
              </li>
              <li>
                <strong className="text-brand-charcoal">Atendimento e logística:</strong> prazos, diagnósticos, fretes, peças e reparos são definidos e executados pelo fabricante
                ou sua rede autorizada, mediante nota fiscal.
              </li>
              <li>
                <strong className="text-brand-charcoal">Escopo:</strong> coberturas e exclusões seguem o termo do fabricante. A Ralph Couch presta apoio informativo, mas não realiza
                reparos nem assume custos/logística desses produtos de terceiros.
              </li>
            </ul>
          </article>
        </section>

        <section className="rounded-3xl bg-white/95 p-8 shadow-luxe">
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="tag">Solicitar garantia</span>
              <h2 className="text-3xl font-display text-brand-charcoal">Acione nossa equipe técnica</h2>
              <p className="text-brand-charcoal/70">
                Preencha os dados abaixo e encaminhe o chamado diretamente para nossa vendedora Letícia pelo WhatsApp.
              </p>
            </div>
            <WarrantyForm />
          </div>
        </section>
      </div>
    </main>
  );
}
