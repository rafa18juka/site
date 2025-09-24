"use client";

import { useEffect, useRef } from "react";

import { Chart } from "chart.js";

interface BarChartProps {
  labels: string[];
  values: number[];
  colors?: string[];
}

const BAR_COLORS = ["#0f172a", "#1e293b", "#334155", "#475569", "#64748b", "#94a3b8"];

export function BarChart({ labels, values, colors = BAR_COLORS }: BarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors
          }
        ]
      },
      options: {}
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, [labels, values, colors]);

  return (
    <div className="card">
      <canvas ref={canvasRef} width={480} height={260} />
    </div>
  );
}
