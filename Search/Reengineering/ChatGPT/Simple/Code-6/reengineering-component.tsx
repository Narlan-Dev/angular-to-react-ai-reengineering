import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ChartModel from '../../models/Chart.model';

// Registra o plugin ChartDataLabels
Chart.register(ChartDataLabels);

interface PieChartProps {
  chart: ChartModel;
}

const PieChart: React.FC<PieChartProps> = ({ chart }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    if (chart && chart.data && canvasRef.current) {
      chartInstanceRef.current = new Chart(canvasRef.current, {
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
              formatter: (value: number) => `${value}%`,
            },
          },
        },
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [JSON.stringify(chart)]);

  return null;
};

export default PieChart;
