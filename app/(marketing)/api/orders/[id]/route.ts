import { NextResponse } from "next/server";

import { listOrders, updateOrder } from "@/lib/orders";

export const dynamic = "force-dynamic";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { id } = params;
    const orders = await listOrders();
    const existing = orders.find((order) => order.id === id);

    if (!existing) {
      return NextResponse.json({ message: "Pedido não encontrado" }, { status: 404 });
    }

    const updated = await updateOrder({ ...existing, ...body, id, updatedAt: new Date().toISOString() });
    return NextResponse.json(updated);
  } catch (error) {
    console.error(`PUT /api/orders/${params.id}`, error);
    return NextResponse.json({ message: "Erro ao atualizar pedido" }, { status: 500 });
  }
}
