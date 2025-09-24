import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip
} from "chart.js";

let registered = false;

export function getChartJs() {
  if (!registered && typeof ChartJS.register === "function") {
    const maybeRegisterables = (ChartJS as unknown as { registerables?: unknown[] }).registerables;
    if (Array.isArray(maybeRegisterables) && maybeRegisterables.length) {
      ChartJS.register(...maybeRegisterables);
    } else {
      const items = [ArcElement, BarElement, CategoryScale, LinearScale, Legend, Tooltip].filter(Boolean);
      if (items.length) {
        ChartJS.register(...items);
      }
    }
    registered = true;
  }
  return ChartJS;
}
