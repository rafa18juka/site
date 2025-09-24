'use strict';

class ChartElement {}
class CategoryScale {}
class LinearScale {}
class BarElement {}
class ArcElement {}
class Tooltip {}
class Legend {}

class Chart {
  constructor(ctx, config) {
    this.ctx = ctx && ctx.canvas ? ctx : ctx.getContext('2d');
    this.canvas = this.ctx.canvas;
    this.config = config;
    this.draw();
  }

  update(newConfig) {
    if (newConfig) {
      this.config = { ...this.config, ...newConfig };
    }
    this.clear();
    this.draw();
  }

  draw() {
    const type = this.config?.type;
    if (type === 'bar') {
      drawBarChart(this.ctx, this.config);
    } else if (type === 'doughnut' || type === 'pie') {
      drawPieChart(this.ctx, this.config);
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  destroy() {
    this.clear();
  }

  static register() {
    // no-op
  }
}

Chart.defaults = {
  color: '#111827',
  font: {
    family: 'Inter, system-ui, sans-serif',
    size: 12
  }
};

function getDataset(config) {
  const datasets = config?.data?.datasets || [];
  return datasets[0] || { data: [] };
}

function drawBarChart(ctx, config) {
  const canvas = ctx.canvas;
  const width = canvas.width;
  const height = canvas.height;
  const labels = config?.data?.labels || [];
  const dataset = getDataset(config);
  const data = dataset.data || [];
  const colors = dataset.backgroundColor || [];
  const maxValue = Math.max(...data, 1);
  const padding = 24;
  const barWidth = (width - padding * 2) / Math.max(data.length, 1) * 0.6;

  ctx.save();
  ctx.fillStyle = '#f3f4f6';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = Chart.defaults.color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  data.forEach((value, index) => {
    const x = padding + (index + 0.5) * ((width - padding * 2) / Math.max(data.length, 1));
    const barHeight = ((height - padding * 2) * value) / maxValue;
    const y = height - padding - barHeight;
    const color = colors[index % colors.length] || '#1d4ed8';

    ctx.fillStyle = color;
    ctx.fillRect(x - barWidth / 2, y, barWidth, barHeight);

    ctx.fillStyle = Chart.defaults.color;
    ctx.fillText(labels[index] ?? '', x, height - padding + 4);
  });
  ctx.restore();
}

function drawPieChart(ctx, config) {
  const canvas = ctx.canvas;
  const width = canvas.width;
  const height = canvas.height;
  const dataset = getDataset(config);
  const data = dataset.data || [];
  const colors = dataset.backgroundColor || [];
  const total = data.reduce((acc, value) => acc + value, 0) || 1;
  const radius = Math.min(width, height) / 2 - 12;
  const centerX = width / 2;
  const centerY = height / 2;

  ctx.save();
  ctx.fillStyle = '#f3f4f6';
  ctx.fillRect(0, 0, width, height);
  let startAngle = -Math.PI / 2;
  data.forEach((value, index) => {
    const sliceAngle = (value / total) * Math.PI * 2;
    const color = colors[index % colors.length] || '#2563eb';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.fillStyle = color;
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
    ctx.closePath();
    ctx.fill();
    startAngle += sliceAngle;
  });
  ctx.restore();
}

module.exports = {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart,
  ChartElement,
  Legend,
  LinearScale,
  Tooltip
};
