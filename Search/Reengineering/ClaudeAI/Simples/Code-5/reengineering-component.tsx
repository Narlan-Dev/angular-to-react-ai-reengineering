import React from 'react';
import ChartModel from '../../models/Chart.model';

interface MultipleKpiProps {
  chart: ChartModel;
}

const MultipleKpi: React.FC<MultipleKpiProps> = ({ chart }) => {
  const labels = ['Não atribuídos', 'Pendentes', 'Aprovados', 'Reprovados'];

  return null;
};

export default MultipleKpi;
