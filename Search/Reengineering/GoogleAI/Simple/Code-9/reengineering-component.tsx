import React from 'react';

interface ConfirmDialogDualProps {
  message: string;
  onClose: (result?: boolean) => void;
}

const ConfirmDialogDual: React.FC<ConfirmDialogDualProps> = ({
  message,
  onClose,
}) => {
  const handleConfirm = () => {
    onClose(true);
  };

  const handleNoClick = () => {
    onClose(false);
  };

  const handleCancelClick = () => {
    onClose(undefined);
  };
};
