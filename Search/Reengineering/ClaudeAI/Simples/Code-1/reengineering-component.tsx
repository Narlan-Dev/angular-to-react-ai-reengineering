import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  message: string;
  onClose: (result?: boolean) => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  message,
  onClose,
}) => {
  const handleCancel = () => {
    onClose();
  };

  const handleConfirm = () => {
    onClose(true);
  };

  return null; // Substitua por JSX conforme o template Angular original
};

export default ConfirmDialog;
