import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import ChartModel from '../../models/Chart.model';

interface BarChartProps {
  chart: ChartModel;
}

const BarChart: React.FC<BarChartProps> = ({ chart }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    if (chart && chart.data && canvasRef.current) {
      // Gera o gráfico usando Chart.js
      chartInstanceRef.current = new Chart(canvasRef.current, {
        type: 'bar',
        data: {
          labels: chart.data.map((item: any) => item.title),
          datasets: [
            {
              label: chart.columns[0],
              data: chart.data.map((item: any) => item.value),
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

    // Cleanup ao desmontar
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
    // Dependência profunda para detectar mudanças em chart.data
  }, [JSON.stringify(chart)]);

  return null; // Substitua por JSX conforme o template Angular original
};

export default BarChart;
