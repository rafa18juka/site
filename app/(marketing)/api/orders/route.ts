import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

import { createOrder, findOrderByPedido, listOrders, hashCpf } from "@/lib/orders";
import type { Pedido } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pedidoId = searchParams.get("pedidoId");
    const cpf = searchParams.get("cpf");

    if (pedidoId && cpf) {
      const pedido = await findOrderByPedido(pedidoId, cpf);
      if (!pedido) {
        return NextResponse.json({ message: "Pedido não encontrado" }, { status: 404 });
      }
      return NextResponse.json(pedido);
    }

    const orders = await listOrders();
    return NextResponse.json(orders);
  } catch (error) {
    console.error("GET /api/orders", error);
    return NextResponse.json({ message: "Erro ao recuperar pedidos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pedidoId, cpf, cliente, etapas = [], notasInternas = "" } = body;

    if (!pedidoId || !cpf) {
      return NextResponse.json({ message: "pedidoId e cpf são obrigatórios" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const pedido: Pedido = {
      id: nanoid(),
      pedidoId,
      cpfHash: hashCpf(cpf),
      cliente,
      etapas,
      notasInternas,
      createdAt: now,
      updatedAt: now
    };

    const created = await createOrder(pedido);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders", error);
    return NextResponse.json({ message: "Erro ao criar pedido" }, { status: 500 });
  }
}
