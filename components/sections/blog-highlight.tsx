import Image from "next/image";
import Link from "next/link";
import { POSTS } from "@/data/posts";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function BlogHighlight() {
  const posts = POSTS.slice(0, 3);

  return (
    <section className="container space-y-10 py-20">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="tag">Blog Ralph Couch</span>
          <h2 className="text-3xl">Inspirações para o seu projeto sob medida</h2>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/blog">Ver todos os artigos</Link>
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <article key={post.id} className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/40 bg-white/90 shadow-luxe">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={post.capaUrl ?? "/assets/blog/placeholder.jpg"}
                alt={post.titulo}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="flex flex-1 flex-col gap-3 p-6">
              <div className="flex items-center gap-3 text-xs text-brand-charcoal/60">
                <span>{formatDate(post.createdAt ?? new Date())}</span>
                <span aria-hidden="true">•</span>
                <span>{post.tags.join(", ")}</span>
              </div>
              <h3 className="text-lg font-semibold text-brand-charcoal">{post.titulo}</h3>
              <Button variant="outline" className="mt-auto w-full" asChild>
                <Link href={`/blog/${post.slug}`}>Ler artigo</Link>
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

