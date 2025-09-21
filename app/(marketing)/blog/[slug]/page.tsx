import type { Metadata } from "next";
import Image from "next/image";
import Script from "next/script";
import { notFound } from "next/navigation";

import { Comments } from "@/components/blog/comments";
import { POSTS } from "@/data/posts";
import { BRAND } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

type BlogPostPageProps = {
  params: {
    slug: string;
  };
};

const PUBLISHED_POSTS = POSTS.filter((post) => post.status === "publicado");

function getPost(slug: string) {
  return PUBLISHED_POSTS.find((post) => post.slug === slug);
}

function getDescription(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);
}

export function generateStaticParams() {
  return PUBLISHED_POSTS.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: BlogPostPageProps): Metadata {
  const post = getPost(params.slug);

  if (!post) {
    return {
      title: "Conteúdo não encontrado"
    };
  }

  const description = getDescription(post.conteudo);
  const canonical = `${BRAND.seo.siteUrl}/blog/${post.slug}`;
  const imageUrl = post.capaUrl ? `${BRAND.seo.siteUrl}${post.capaUrl}` : `${BRAND.seo.siteUrl}/assets/opengraph.jpg`;

  return {
    title: post.titulo,
    description,
    alternates: {
      canonical
    },
    keywords: post.tags,
    openGraph: {
      type: "article",
      url: canonical,
      title: post.titulo,
      description,
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt ?? post.createdAt,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 800,
          alt: post.titulo
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: post.titulo,
      description,
      images: [imageUrl]
    }
  } satisfies Metadata;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPost(params.slug);

  if (!post) {
    notFound();
  }

  const description = getDescription(post.conteudo);
  const publishedAt = post.createdAt ?? new Date().toISOString();
  const updatedAt = post.updatedAt ?? post.createdAt ?? publishedAt;
  const coverImage = post.capaUrl ?? "/assets/blog/placeholder.jpg";
  const canonical = `${BRAND.seo.siteUrl}/blog/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.titulo,
    description,
    datePublished: publishedAt,
    dateModified: updatedAt,
    image: [`${BRAND.seo.siteUrl}${coverImage}`],
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical
    },
    author: {
      "@type": "Organization",
      name: BRAND.name
    },
    publisher: {
      "@type": "Organization",
      name: BRAND.name,
      logo: {
        "@type": "ImageObject",
        url: `${BRAND.seo.siteUrl}/assets/logo.png`
      }
    }
  } as const;

  return (
    <article className="container space-y-16 py-16">
      <Script id={`blogpost-jsonld-${post.slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="space-y-6 text-center">
        <span className="tag inline-block">Blog Ralph Couch</span>
        <h1 className="text-4xl md:text-5xl">{post.titulo}</h1>
        <div className="flex flex-col items-center justify-center gap-2 text-sm text-brand-charcoal/60 sm:flex-row">
          <span>Publicado em {formatDate(publishedAt)}</span>
          <span className="hidden sm:inline" aria-hidden>
            •
          </span>
          <span>Atualizado em {formatDate(updatedAt)}</span>
        </div>
      </header>

      <div className="overflow-hidden rounded-3xl border border-white/50 shadow-luxe">
        <Image
          src={coverImage}
          alt={post.titulo}
          width={1200}
          height={800}
          className="h-full w-full object-cover"
          sizes="(max-width: 768px) 100vw, 960px"
          priority
        />
      </div>

      <div className="mx-auto max-w-3xl space-y-10 text-left">
        <div
          className="space-y-6 text-base text-brand-charcoal/80 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-brand-charcoal [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-brand-charcoal [&_p]:leading-relaxed [&_strong]:text-brand-charcoal"
          dangerouslySetInnerHTML={{ __html: post.conteudo }}
        />
        <Comments slug={post.slug} postTitle={post.titulo} />
      </div>
    </article>
  );
}
