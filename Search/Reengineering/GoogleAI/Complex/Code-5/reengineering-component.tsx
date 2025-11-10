import React, { useState } from 'react';

interface RoutineUploadProps {
  type: string;
  onClose: (fileData?: string) => void;
}

const RoutineUpload: React.FC<RoutineUploadProps> = ({ type, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [fileData, setFileData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const dataUrl = String(reader.result);
        setFileData(dataUrl);
        setError(null);
      };
    }
  };

  const handleConfirm = () => {
    if (!fileData) {
      setError('É necessário selecionar um arquivo.');
      return;
    }
    setLoading(true);
    onClose(fileData);
  };

  const handleCancel = () => {
    onClose();
  };
};
