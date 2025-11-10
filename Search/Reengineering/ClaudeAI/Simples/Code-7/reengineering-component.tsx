import React, { useEffect } from 'react';
import ChartModel from '../../models/Chart.model';

interface TablesProps {
  chart: ChartModel;
}

const Tables: React.FC<TablesProps> = ({ chart }) => {
  useEffect(() => {
    // Lógica de atualização quando chart muda
  }, [chart]);

  return null;
};

export default Tables;
