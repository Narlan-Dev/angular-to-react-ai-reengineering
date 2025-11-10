import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';

interface ResponseData {
  type: string;
}

interface Props {
  open: boolean;
  onClose: (data?: any) => void;
  responseData: ResponseData;
}

const RoutineUpload: React.FC<Props> = ({ open, onClose, responseData }) => {
  const [loading, setLoading] = useState(false);
  const [uploadAssignment, setUploadAssignment] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'error' | 'success';
  }>({ open: false, message: '', severity: 'success' });

  // Manipula mudança de arquivo
  const onAssignmentModelFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        const dataFile = String(reader.result);
        setUploadAssignment(dataFile);
        setError(null);
      };
    }
  };

  // Validação dos campos
  const validateFields = () => {
    if (!uploadAssignment) {
      setError('Arquivo é obrigatório');
      return false;
    }
    setError(null);
    return true;
  };

  // Confirmação do upload
  const onConfirm = () => {
    if (validateFields()) {
      setLoading(true);
      onClose(uploadAssignment);
    } else {
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Selecione um arquivo para upload',
        severity: 'error',
      });
    }
  };

  // Cancelamento
  const onCancel = () => {
    onClose();
  };

  return null; // Substitua por JSX conforme o template Angular original
};

export default RoutineUpload;
