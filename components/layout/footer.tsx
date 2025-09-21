import Link from "next/link";
import Image from "next/image";
import { BRAND } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer id="contato" className="bg-brand-charcoal text-white">
      <div className="container grid gap-10 py-14 lg:grid-cols-4">
        <div className="space-y-4">
          <Image src="/assets/logo-mark.svg" alt="Ralph Couch" width={64} height={64} />
          <p className="text-sm text-white/70">Sofás sob medida, módulos, canto, L, ilha, chaise; impermeabilização e capas.</p>
          <Image src="/assets/ml-rodape.png" alt="Certificação Ralph Couch" width={240} height={100} className="h-20 w-auto" />
        </div>
        <div className="space-y-3 text-sm">
          <h3 className="font-display text-lg">Contato</h3>
          <p>Showroom: {BRAND.showroom.address}</p>
          <p>CNPJ: {BRAND.cnpj}</p>
          <p>
            Instagram: <Link href="https://www.instagram.com/ralph_couch/" target="_blank" rel="noreferrer" className="underline text-white">@ralph_couch</Link>
          </p>
          <p>
            WhatsApp vendas: <Link href="https://linktr.ee/ralph_couch" target="_blank" rel="noreferrer" className="underline">(11) 94890-1487</Link>
          </p>
        </div>
        <div className="space-y-3 text-sm">
          <h3 className="font-display text-lg">Atendimento</h3>
          <p>Leticia – (11) 94890-1487</p>
          <p>Nayara – (11) 94582-0800</p>
          <p>Nathalia – (11) 91531-7702</p>
          <Link href="https://linktr.ee/ralph_couch" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-white shadow-luxe">
            Falar agora
          </Link>
        </div>
        <div className="space-y-3 text-sm">
          <h3 className="font-display text-lg">Horários</h3>
          <p>Segunda a sexta: 9h às 18h</p>
          <p>Sábados: 9h às 14h</p>
        </div>
      </div>
      <Separator className="border-none bg-white/10" />
      <div className="container flex flex-col items-center justify-between gap-4 py-6 text-xs text-white/60 md:flex-row">
        <p>© {new Date().getFullYear()} {BRAND.name}. Todos os direitos reservados.</p>
        <div className="flex gap-4">
          <Link href="/politica-de-privacidade" className="hover:text-white">Privacidade</Link>
          <Link href="/sitemap.xml" className="hover:text-white">Sitemap</Link>
        </div>
      </div>
    </footer>
  );
}

