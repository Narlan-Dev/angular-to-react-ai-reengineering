import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

interface RoutineUploadProps {
  open: boolean;
  type: string;
  onClose: (result?: string) => void;
}

const RoutineUpload: React.FC<RoutineUploadProps> = ({
  open,
  type,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      s;
      const reader = new FileReader();
      reader.onload = () => {
        const dataFile = String(reader.result);
        setUploadedFile(dataFile);
        setFileName(file.name);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const validateFields = () => {
    if (!uploadedFile) {
      setError('Arquivo é obrigatório');
      return false;
    }
    setError('');
    return true;
  };

  const handleConfirm = () => {
    if (validateFields()) {
      setLoading(true);
      onClose(uploadedFile);
    } else {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return null; // Only logic component, no UI rendering
};

export default RoutineUpload;
