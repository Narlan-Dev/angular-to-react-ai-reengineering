import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

interface ChartModel {
  label: string;
  ctx?: string;
  data: { title: string; value: number }[];
  columns: string[];
}

interface BarChartProps {
  chart: ChartModel;
}

const BarChart: React.FC<BarChartProps> = ({ chart }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (canvasRef.current && chart.data) {
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      chartInstanceRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: chart.data.map((item) => item.title),
          datasets: [
            {
              label: chart.columns[0],
              data: chart.data.map((item) => item.value),
              borderWidth: 1,
            },
          ],
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [chart]);
};
