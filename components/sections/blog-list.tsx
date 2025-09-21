import Link from "next/link";
import Image from "next/image";
import { POSTS } from "@/data/posts";
import { formatDate } from "@/lib/utils";

export function BlogList() {
  const posts = POSTS.filter((post) => post.status === "publicado");
  return (
    <section className="container space-y-10 py-20">
      <div className="space-y-3 text-center">
        <span className="tag">Blog Ralph Couch</span>
        <h1 className="text-3xl">Inspirações, manutenção e tendências</h1>
        <p className="mx-auto max-w-2xl text-brand-charcoal/70">
          Conteúdo criado por nosso time de especialistas com dicas sobre tecidos, conforto, formatos e decoração.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <article key={post.id} className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/40 bg-white/90 shadow-luxe">
            <div className="relative aspect-[16/10] w-full">
              <Image
                src={post.capaUrl ?? "/assets/blog/placeholder.jpg"}
                alt={post.titulo}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="flex flex-1 flex-col gap-3 p-6">
              <div className="text-xs text-brand-charcoal/60">{formatDate(post.createdAt ?? new Date())}</div>
              <h2 className="text-xl font-semibold text-brand-charcoal">{post.titulo}</h2>
              <div className="flex flex-wrap gap-2 text-xs text-brand-charcoal/60">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-brand-muted/70 px-3 py-1">
                    #{tag}
                  </span>
                ))}
              </div>
              <Link href={`/blog/${post.slug}`} className="mt-auto inline-flex text-sm font-semibold text-brand-charcoal underline">
                Ler artigo
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
