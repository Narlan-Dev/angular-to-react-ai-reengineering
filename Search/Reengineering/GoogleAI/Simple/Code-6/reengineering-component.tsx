import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Registrar o plugin globalmente para o Chart.js
Chart.register(ChartDataLabels);

interface ChartModel {
  label: string;
  ctx?: string;
  data: number[];
  columns?: string[];
}

interface PieChartProps {
  chart: ChartModel;
}

const PieChart: React.FC<PieChartProps> = ({ chart }) => {
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
        type: 'doughnut',
        data: {
          datasets: [
            {
              data: chart.data,
              backgroundColor: [
                'rgb(211, 211, 211)',
                'rgb(255, 205, 86)',
                'rgb(54, 162, 235)',
                'rgb(255, 99, 132)',
              ],
            },
          ],
          labels: chart.columns ?? [
            'Não atribuída',
            'Pendente',
            'Aprovada',
            'Reprovada',
          ],
        },
        options: {
          plugins: {
            datalabels: {
              formatter: (value) => {
                return value + '%';
              },
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
