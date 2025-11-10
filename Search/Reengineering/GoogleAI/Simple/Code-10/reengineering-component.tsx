import React, { useState, useEffect } from 'react';

interface Routine {
  // Defina as propriedades do modelo Routine aqui
}

interface RoutineDetailsProps {
  routine: Routine;
  onClose: () => void;
}

const RoutineDetailsComponent: React.FC<RoutineDetailsProps> = ({
  routine,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleClose = () => {
    onClose();
  };
};
