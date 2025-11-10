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

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [JSON.stringify(chart)]);

  return null;
};

export default BarChart;
