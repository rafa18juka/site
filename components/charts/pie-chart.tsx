"use client";

import { useEffect, useRef } from "react";

import { Chart } from "chart.js";

interface PieChartProps {
  labels: string[];
  values: number[];
  colors?: string[];
}

const DEFAULT_COLORS = ["#0f172a", "#1e293b", "#334155", "#475569", "#64748b", "#94a3b8"];

export function PieChart({ labels, values, colors = DEFAULT_COLORS }: PieChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const context = canvasRef.current.getContext("2d");
    if (!context) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(context, {
      type: "doughnut",
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
      <canvas ref={canvasRef} width={320} height={240} />
    </div>
  );
}
