import { FEATURED_COPY } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Clock, Sparkles } from "lucide-react";

const icons = [Clock, Sparkles, ShieldCheck];

export function WhySection() {
  return (
    <section className="container py-20">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="tag">Por que Ralph Couch?</span>
        <h2 className="text-3xl">Excelência artesanal do briefing à entrega</h2>
        <p className="max-w-2xl text-brand-charcoal/70">
          Fabricamos em São Paulo com processos próprios e acompanhamento diário das etapas. Cada peça é validada em checklist
          de qualidade antes da entrega agendada.
        </p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {FEATURED_COPY.map((item, index) => {
          const Icon = icons[index] ?? Sparkles;
          return (
            <Card key={item.title} className="border-brand-charcoal/5">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-muted/80 text-brand-champagne">
                  <Icon className="h-6 w-6" />
                </div>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{item.description}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}