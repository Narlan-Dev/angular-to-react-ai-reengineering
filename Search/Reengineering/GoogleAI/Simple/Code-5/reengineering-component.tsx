import React from 'react';

interface ChartModel {}

interface MultipleKpiProps {
  chart: ChartModel;
}

const MultipleKpiComponent: React.FC<MultipleKpiProps> = ({ chart }) => {
  const labels: string[] = [
    'Não atribuídos',
    'Pendentes',
    'Aprovados',
    'Reprovados',
  ];
};
