"use client";

import { useEffect, useId, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";

interface CommentsResponse {
  comments: Array<{
    id: string;
    nome: string;
    mensagem: string;
    createdAt?: string;
  }>;
}

interface CommentsProps {
  slug: string;
  postTitle: string;
}

export function Comments({ slug, postTitle }: CommentsProps) {
  const [comments, setComments] = useState<CommentsResponse["comments"]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const formId = useId();

  useEffect(() => {
    let isActive = true;
    setIsLoading(true);
    setLoadError(null);

    fetch(`/api/comments/${slug}`, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Erro ao carregar comentários");
        }
        return (await response.json()) as CommentsResponse;
      })
      .then((data) => {
        if (!isActive) return;
        setComments(data.comments ?? []);
      })
      .catch(() => {
        if (!isActive) return;
        setLoadError("Não foi possível carregar os comentários agora.");
      })
      .finally(() => {
        if (!isActive) return;
        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [slug]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!nome.trim() || !mensagem.trim()) {
      setFormError("Preencha seu nome e comentário.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`/api/comments/${slug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ nome: nome.trim(), mensagem: mensagem.trim() })
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Não foi possível enviar seu comentário.");
      }

      setSuccessMessage("Recebemos seu comentário! Ele aparecerá após a moderação.");
      setNome("");
      setMensagem("");
    } catch (submissionError) {
      setFormError(
        submissionError instanceof Error ? submissionError.message : "Não foi possível enviar seu comentário."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const statusMessage = useMemo(() => successMessage ?? formError, [formError, successMessage]);

  return (
    <section
      aria-labelledby={`${formId}-comments-title`}
      className="space-y-10 rounded-3xl border border-brand-charcoal/10 bg-white/85 p-6 shadow-luxe sm:p-8"
    >
      <div className="space-y-3">
        <h2 id={`${formId}-comments-title`} className="text-2xl font-semibold text-brand-charcoal">
          Comentários
        </h2>
        <p className="text-sm text-brand-charcoal/70">
          Compartilhe sua experiência ou dúvida sobre “{postTitle}”. Comentários são moderados para manter a comunidade elegante.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`${formId}-nome`}>Nome</Label>
            <Input
              id={`${formId}-nome`}
              name="nome"
              placeholder="Como devemos te chamar?"
              autoComplete="name"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              maxLength={80}
              required
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor={`${formId}-mensagem`}>Comentário</Label>
            <Textarea
              id={`${formId}-mensagem`}
              name="mensagem"
              placeholder="Conte o que achou, deixe sua dúvida ou dica."
              value={mensagem}
              onChange={(event) => setMensagem(event.target.value)}
              maxLength={600}
              required
            />
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-brand-charcoal/60">
            Ao enviar você concorda com nossa política de privacidade e uso responsável dos seus dados.
          </p>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar comentário"}
          </Button>
        </div>
        {statusMessage ? (
          <p className="text-sm" aria-live="polite">
            <span className={successMessage ? "text-emerald-600" : "text-red-600"}>{statusMessage}</span>
          </p>
        ) : null}
      </form>

      <div className="space-y-4" aria-live="polite">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : loadError ? (
          <p className="text-sm text-red-600">{loadError}</p>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <article
              key={comment.id}
              className="space-y-3 rounded-3xl border border-brand-charcoal/10 bg-white/95 p-5 shadow-inner"
            >
              <div className="flex flex-col gap-1 text-sm text-brand-charcoal/70 sm:flex-row sm:items-center sm:justify-between">
                <span className="font-semibold text-brand-charcoal">{comment.nome}</span>
                {comment.createdAt ? (
                  <time dateTime={comment.createdAt} className="text-xs uppercase tracking-wide">
                    {formatDate(comment.createdAt)}
                  </time>
                ) : null}
              </div>
              <p className="text-sm text-brand-charcoal/80 whitespace-pre-line">{comment.mensagem}</p>
            </article>
          ))
        ) : (
          <p className="text-sm text-brand-charcoal/60">Seja o primeiro a comentar este artigo.</p>
        )}
      </div>
    </section>
  );
}