import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

import { COMMENTS } from "@/data/comments";
import { getSupabaseServiceRole } from "@/lib/supabase/server";

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;
  try {
    const supabase = getSupabaseServiceRole();
    const { data, error } = await supabase
      .from("comments")
      .select("id, postSlug, nome, mensagem, aprovado, createdAt")
      .eq("postSlug", slug)
      .eq("aprovado", true)
      .order("createdAt", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ comments: data ?? [] });
  } catch (_error) {
    const comments = COMMENTS.filter((comment) => comment.postSlug === slug && comment.aprovado);
    return NextResponse.json({ comments });
  }
}

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const body = await request.json();
  const nome = (body?.nome ?? "").toString().trim();
  const mensagem = (body?.mensagem ?? "").toString().trim();

  if (!nome || !mensagem) {
    return NextResponse.json({ error: "Preencha nome e mensagem." }, { status: 422 });
  }

  try {
    const supabase = getSupabaseServiceRole();
    const payload = {
      id: nanoid(),
      postSlug: slug,
      nome,
      mensagem,
      aprovado: false,
      createdAt: new Date().toISOString()
    };
    const { error } = await supabase.from("comments").insert(payload);
    if (error) throw error;
    return NextResponse.json({ success: true, comment: payload });
  } catch (_error) {
    return NextResponse.json(
      { error: "Serviço indisponível no momento. Tente novamente mais tarde." },
      { status: 503 }
    );
  }
}