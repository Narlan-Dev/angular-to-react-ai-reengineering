import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

interface ConfirmDialogDualProps {
  open: boolean;
  message: string;
  onClose: (result?: boolean) => void;
}

const ConfirmDialogDual: React.FC<ConfirmDialogDualProps> = ({
  open,
  message,
  onClose,
}) => {
  const handleNoClick = () => {
    onClose(false);
  };

  const handleCancelClick = () => {
    onClose(undefined);
  };

  const handleConfirm = () => {
    onClose(true);
  };

  return null;
};

export default ConfirmDialogDual;
