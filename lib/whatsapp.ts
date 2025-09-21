import { CTA_WHATSAPP_BASE, SELLERS } from "@/lib/constants";

export type SellerId = (typeof SELLERS)[number]["id"];

export function buildWhatsAppLink({
  seller,
  message,
  utm,
  extraParams
}: {
  seller?: SellerId;
  message?: string;
  utm?: Record<string, string>;
  extraParams?: Record<string, string>;
}) {
  const targetSeller = SELLERS.find((item) => item.id === seller) ?? SELLERS[0];
  const params = new URLSearchParams();

  if (message) {
    params.set("text", message);
  }

  if (utm) {
    Object.entries(utm).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
  }

  if (extraParams) {
    Object.entries(extraParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
  }

  const query = params.toString();
  return `${CTA_WHATSAPP_BASE}/${targetSeller.whatsapp}${query ? `?${query}` : ""}`;
}
