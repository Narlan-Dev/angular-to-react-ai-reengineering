import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import ChartModel from '../../models/Chart.model';

interface LineChartProps {
  chart: ChartModel;
}

const LineChart: React.FC<LineChartProps> = ({ chart }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    if (chart && chart.data && canvasRef.current) {
      chartInstanceRef.current = new Chart(canvasRef.current, {
        type: 'line',
        data: {
          labels: chart.data.map((item: any) => item.title),
          datasets: [
            {
              label: chart.columns[0],
              data: chart.data.map((item: any) => item.value),
              fill: true,
              borderColor: '#2196f3',
              backgroundColor: '#2196f3',
              borderWidth: 1,
            },
          ],
        },
        options: {
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

export default LineChart;
