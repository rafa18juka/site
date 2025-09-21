import { promises as fs } from "fs";
import path from "path";
import { createHash } from "crypto";

import type { Pedido } from "@/lib/supabase/types";

const DATA_FILE = path.join(process.cwd(), "data", "orders.json");

async function ensureDataFile(): Promise<void> {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, "[]", "utf-8");
  }
}

export async function readOrders(): Promise<Pedido[]> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  const orders = JSON.parse(raw.replace(/^\uFEFF/, "")) as Pedido[];
  const cleaned = pruneOldOrders(orders);
  if (cleaned.removed) {
    await writeOrders(cleaned.orders);
    return cleaned.orders;
  }
  return orders;
}

function pruneOldOrders(orders: Pedido[]): { orders: Pedido[]; removed: boolean } {
  const ONE_DAY = 24 * 60 * 60 * 1000;
  const cutoff = Date.now() - 150 * ONE_DAY;
  const filtered = orders.filter((order) => {
    const created = order.createdAt ? new Date(order.createdAt).getTime() : Date.now();
    return created >= cutoff;
  });
  return { orders: filtered, removed: filtered.length !== orders.length };
}

export async function writeOrders(orders: Pedido[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(orders, null, 2), "utf-8");
}

export function hashCpf(value: string): string {
  return createHash("sha256").update(value.replace(/\D/g, ""), "utf8").digest("hex");
}

export async function findOrderByPedido(pedidoId: string, cpf: string): Promise<Pedido | null> {
  const orders = await readOrders();
  const cpfHash = hashCpf(cpf);
  return orders.find((order) => order.pedidoId === pedidoId && order.cpfHash === cpfHash) ?? null;
}

export async function listOrders(): Promise<Pedido[]> {
  return readOrders();
}

export async function updateOrder(updated: Pedido): Promise<Pedido> {
  const orders = await readOrders();
  const index = orders.findIndex((order) => order.id === updated.id);
  if (index === -1) {
    orders.push(updated);
  } else {
    orders[index] = updated;
  }
  await writeOrders(orders);
  return updated;
}

export async function createOrder(order: Pedido): Promise<Pedido> {
  const orders = await readOrders();
  orders.push(order);
  await writeOrders(orders);
  return order;
}
