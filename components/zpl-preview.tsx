"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface ZplPreviewProps {
  zpl: string;
  sku: string;
  name: string;
  unitPrice: number;
  widthMm?: number;
  heightMm?: number;
  fileName?: string;
  note?: string;
}

export function ZPLPreview({
  zpl,
  sku,
  name,
  unitPrice,
  widthMm = 40,
  heightMm = 25,
  fileName,
  note
}: ZplPreviewProps) {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const scale = 4; // preview scale
  const previewWidth = Math.round(widthMm * scale);
  const previewHeight = Math.round(heightMm * scale);

  useEffect(() => {
    const blob = new Blob([zpl], { type: "text/plain" });
    const objectUrl = URL.createObjectURL(blob);
    setDownloadUrl(objectUrl);
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [zpl]);

  const lines = useMemo(() => zpl.split("\n"), [zpl]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="card space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Pré-visualização</h3>
          <p className="text-sm text-slate-500">Escala aproximada para etiqueta 40 x 25 mm.</p>
        </div>
        <div
          className="relative rounded-lg border border-dashed border-slate-300 bg-white p-3"
          style={{ width: previewWidth, height: previewHeight }}
        >
          <div className="flex h-full flex-col justify-between">
            <div className="text-xs font-semibold uppercase text-slate-700">{name}</div>
            <div className="text-xs text-slate-500">{formatCurrency(unitPrice)}</div>
            <div className="flex flex-1 items-center justify-center">
              <div className="h-16 w-full bg-[repeating-linear-gradient(90deg,#0f172a, #0f172a_2px,transparent_2px,transparent_4px)]" />
            </div>
            <div className="text-center text-xs font-mono tracking-widest text-slate-700">{sku}</div>
          </div>
        </div>
        {note ? <p className="text-xs text-slate-500">{note}</p> : null}
        {downloadUrl ? (
          <Button asChild>
            <a href={downloadUrl} download={`${fileName ?? sku}.zpl`}>
              Baixar .zpl
            </a>
          </Button>
        ) : null}
      </div>
      <div className="card space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Código ZPL</h3>
          <p className="text-sm text-slate-500">Copie ou ajuste conforme necessário.</p>
        </div>
        <pre className="max-h-80 overflow-auto rounded-lg bg-slate-900/90 p-4 text-xs text-emerald-200">
          <code>{lines.join("\n")}</code>
        </pre>
      </div>
    </div>
  );
}
