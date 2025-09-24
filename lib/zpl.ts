import { truncate } from "./utils";

interface GenerateZplParams {
  sku: string;
  name: string;
  unitPrice: number;
  widthMm?: number;
  heightMm?: number;
}

const DEFAULT_WIDTH_MM = 40;
const DEFAULT_HEIGHT_MM = 25;
const DOTS_PER_MM = 8; // 203 dpi ≈ 8 dpmm

export function generateZPL({
  sku,
  name,
  unitPrice,
  widthMm = DEFAULT_WIDTH_MM,
  heightMm = DEFAULT_HEIGHT_MM
}: GenerateZplParams) {
  const width = Math.round(widthMm * DOTS_PER_MM);
  const height = Math.round(heightMm * DOTS_PER_MM);
  const safeName = truncate(name, 24).toUpperCase();
  const price = unitPrice.toFixed(2);

  return `^XA
^PW${width}
^LL${height}
^CF0,32
^FO20,20^FD${safeName}^FS
^CF0,24
^FO20,60^FD$${price}^FS
^FO20,90^BCN,80,Y,N,N
^FD${sku}^FS
^CF0,20
^FO20,180^FD${sku}^FS
^XZ`;
}

export function getZplDimensions(widthMm = DEFAULT_WIDTH_MM, heightMm = DEFAULT_HEIGHT_MM) {
  return {
    width: Math.round(widthMm * DOTS_PER_MM),
    height: Math.round(heightMm * DOTS_PER_MM)
  };
}
