"use client";

import { useEffect, useRef } from "react";
import type { Chart, ChartConfiguration } from "chart.js";

import { getChartJs } from "@/lib/chart";

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
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const ChartJS = getChartJs();

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const config: ChartConfiguration = {
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
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: {
              color: "#475569"
            },
            grid: {
              display: false
            }
          },
          y: {
            ticks: {
              color: "#475569"
            },
            grid: {
              color: "rgba(148, 163, 184, 0.2)"
            }
          }
        },
        plugins: {
          legend: {
            display: false
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
      <div className="aspect-[16/9]">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
