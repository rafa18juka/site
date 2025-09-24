"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { BrowserMultiFormatReader, listVideoInputDevices } from "@zxing/browser";
import { Button } from "@/components/ui/button";

interface BarcodeScannerProps {
  onResult: (value: string) => void;
  paused?: boolean;
}

export function BarcodeScanner({ onResult, paused = false }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [activeDeviceId, setActiveDeviceId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const prepare = async () => {
      try {
        const devices = await listVideoInputDevices();
        if (cancelled) return;
        setCameras(devices);
        const deviceId = devices[0]?.deviceId ?? null;
        setActiveDeviceId((prev) => prev ?? deviceId);
      } catch (err) {
        console.error(err);
        toast.error("Não foi possível listar as câmeras disponíveis");
        setError("Sem acesso à câmera");
      }
    };

    prepare();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!videoRef.current || !activeDeviceId || paused) {
      if (readerRef.current) {
        readerRef.current.reset();
        setReady(false);
      }
      return;
    }

    const reader = new BrowserMultiFormatReader({ formats: ["code_128", "ean_13"] });
    readerRef.current = reader;
    reader
      .decodeFromVideoDevice(activeDeviceId, videoRef.current, (value) => {
        if (value) {
          onResult(value);
        }
      })
      .then(() => setReady(true))
      .catch((err) => {
        console.error("Erro ao iniciar scanner", err);
        setError(err instanceof Error ? err.message : String(err));
        toast.error("Falha ao iniciar o leitor de código de barras");
      });

    return () => {
      reader.reset();
    };
  }, [activeDeviceId, onResult, paused]);

  const changeCamera = (deviceId: string) => {
    if (deviceId === activeDeviceId) return;
    setReady(false);
    setActiveDeviceId(deviceId);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-900/70 p-2 shadow-inner">
        <video
          ref={videoRef}
          className="aspect-video w-full rounded-lg bg-black object-cover"
          muted
          playsInline
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {cameras.map((camera) => (
          <Button
            key={camera.deviceId || camera.label}
            type="button"
            variant={camera.deviceId === activeDeviceId ? "default" : "outline"}
            size="sm"
            onClick={() => changeCamera(camera.deviceId)}
          >
            {camera.label || "Câmera"}
          </Button>
        ))}
        {!cameras.length && (
          <span className="text-sm text-slate-500">Nenhuma câmera detectada</span>
        )}
        <span className="ml-auto text-sm text-slate-500">
          {error ? error : ready ? "Câmera pronta" : "Preparando câmera…"}
        </span>
      </div>
    </div>
  );
}
