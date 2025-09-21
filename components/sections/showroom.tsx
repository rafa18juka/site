import Link from "next/link";
import Image from "next/image";
import { BRAND } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function ShowroomSection() {
  return (
    <section className="bg-white py-20">
      <div className="container grid gap-10 lg:grid-cols-[1.2fr,1fr]">
        <div className="space-y-6">
          <span className="tag">Visite o showroom</span>
          <h2 className="text-3xl">Experimente o toque e conforto pessoalmente</h2>
          <p className="text-brand-charcoal/70">
            Nosso espaço no Tatuapé foi desenhado para você vivenciar cada densidade, tecido e configuração. Agende uma visita
            com nossas especialistas e traga a planta do seu ambiente.
          </p>
          <div className="rounded-3xl border border-brand-charcoal/10 bg-brand-muted/60 p-6">
            <p className="text-sm font-semibold text-brand-charcoal">Endereço</p>
            <p className="text-sm text-brand-charcoal/70">{BRAND.showroom.address}</p>
            <Link href={BRAND.showroom.mapsUrl} className="mt-3 inline-flex items-center text-sm underline">
              Ver no Google Maps
            </Link>
          </div>
          <Button size="lg" asChild>
            <Link href="https://linktr.ee/ralph_couch" target="_blank" rel="noreferrer">Agendar visita</Link>
          </Button>
        </div>
        <div className="overflow-hidden rounded-3xl shadow-luxe">
          <iframe
            title="Mapa Ralph Couch"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.42411504745!2d-46.56567462468077!3d-23.588325778781038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5d47adb0a26f%3A0x19ef0d9dc8646f09!2sRua%20Vale%20Formoso%2C%2053%20-%20Tatuap%C3%A9%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2003410-030!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
            width="100%"
            height="360"
            loading="lazy"
            className="h-full w-full"
            style={{ border: 0 }}
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
