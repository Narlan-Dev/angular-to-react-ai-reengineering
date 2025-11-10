import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { Routine } from 'src/app/_models/routine';

interface RoutineDetailsProps {
  open: boolean;
  routine: Routine;
  onClose: () => void;
}

const RoutineDetails: React.FC<RoutineDetailsProps> = ({
  open,
  routine,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [routine]);

  const handleNoClick = () => {
    onClose();
  };

  return null;
};

export default RoutineDetails;
