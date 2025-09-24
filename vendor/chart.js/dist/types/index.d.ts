export declare class ChartElement {}
export declare class CategoryScale {}
export declare class LinearScale {}
export declare class BarElement {}
export declare class ArcElement {}
export declare class Tooltip {}
export declare class Legend {}

export interface ChartDataset {
  data: number[];
  backgroundColor?: string[];
}

export interface ChartData {
  labels?: string[];
  datasets?: ChartDataset[];
}

export interface ChartConfiguration {
  type: string;
  data: ChartData;
  options?: Record<string, unknown>;
}

export declare class Chart {
  static defaults: {
    color: string;
    font: {
      family: string;
      size: number;
    };
  };
  static register(..._items: unknown[]): void;
  constructor(ctx: CanvasRenderingContext2D | HTMLCanvasElement, config: ChartConfiguration);
  update(config?: Partial<ChartConfiguration>): void;
  destroy(): void;
}
