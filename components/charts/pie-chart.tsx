"use client";

import { useEffect, useRef } from "react";
import type { Chart, ChartConfiguration } from "chart.js";

import { getChartJs } from "@/lib/chart";

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
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const ChartJS = getChartJs();

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const config: ChartConfiguration = {
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
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#475569",
              usePointStyle: true
            }
          }
        }
      }
    };

    chartRef.current = new ChartJS(context, config);

    return () => {
      chartRef.current?.destroy();
    };
  }, [labels, values, colors]);

  return (
    <div className="card">
      <div className="aspect-square">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
