import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { QUESTION_TYPES } from 'src/app/_constants/questionTypes.constants';
import { QuestionElement } from 'src/app/_models/question';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { QuestionService } from 'src/app/_services/question.service';

interface QuestionSaveProps {
  open?: boolean;
  question?: QuestionElement;
  model: string;
  track?: any;
  onClose: (result?: any) => void;
  questionService: QuestionService;
  authenticationService: AuthenticationService;
}

const QuestionSave: React.FC<QuestionSaveProps> = ({
  open = true,
  question,
  model,
  track,
  onClose,
  questionService,
  authenticationService,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    weight: null as number | null,
    description: '',
  });
  const [questions, setQuestions] = useState<QuestionElement[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const types = [
    QUESTION_TYPES.TEXT,
    QUESTION_TYPES.LONG_TEXT,
    QUESTION_TYPES.SELECT,
    QUESTION_TYPES.NUMBER,
  ];

  useEffect(() => {
    setCurrentUser(authenticationService.currentUserValue);
    fetchedQuestions();
    setIsEdit(!!question);

    if (question) {
      setFormData({
        title: question.title || '',
        type: question.type || '',
        weight: question.weight || null,
        description: question.description || '',
      });
    }

    setLoading(false);
  }, [question]);

  useEffect(() => {
    const weightRequiredTypes = [QUESTION_TYPES.SELECT, QUESTION_TYPES.NUMBER];
    if (weightRequiredTypes.includes(formData.type)) {
      if (!formData.weight) {
        setErrors((prev) => ({ ...prev, weight: 'Peso é obrigatório' }));
      } else {
        setErrors((prev) => ({ ...prev, weight: '' }));
      }
    } else {
      setFormData((prev) => ({ ...prev, weight: null }));
      setErrors((prev) => ({ ...prev, weight: '' }));
    }
  }, [formData.type]);

  const fetchedQuestions = async () => {
    try {
      const response = await questionService.readByUserAndTrack({
        user_id: currentUser?._id,
        track_id: track?._id ?? null,
        model: model,
      });
      if (response.status === 'success') {
        setQuestions(response.data);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro ao buscar perguntas',
        severity: 'error',
      });
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Validação em tempo real
    if (field === 'title' && !value) {
      setErrors((prev) => ({ ...prev, title: 'Título é obrigatório' }));
    } else if (field === 'title') {
      setErrors((prev) => ({ ...prev, title: '' }));
    }

    if (field === 'type' && !value) {
      setErrors((prev) => ({ ...prev, type: 'Tipo é obrigatório' }));
    } else if (field === 'type') {
      setErrors((prev) => ({ ...prev, type: '' }));
    }
  };

  const isWeightInvalid = () => {
    const weightRequiredTypes = [QUESTION_TYPES.SELECT, QUESTION_TYPES.NUMBER];
    return (
      weightRequiredTypes.includes(formData.type) &&
      submitted &&
      !formData.weight
    );
  };

  const validationLimitWeight = () => {
    const totalWeight = questions.reduce((acc: number, q: QuestionElement) => {
      if (q.weight) {
        if (isEdit && q._id === question?._id) {
          return acc;
        }
        acc += q.weight;
      }
      return acc;
    }, 0);

    const currentWeight = formData.weight || 0;
    const weightRequiredTypes = [QUESTION_TYPES.SELECT, QUESTION_TYPES.NUMBER];

    if (weightRequiredTypes.includes(formData.type)) {
      const newTotal = currentWeight + totalWeight;
      return newTotal <= 100;
    }
    return true;
  };

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSubmitted(true);

    const weight = formData.weight;
    const type = formData.type;

    if (
      (type === QUESTION_TYPES.SELECT || type === QUESTION_TYPES.NUMBER) &&
      (weight === null || weight <= 0 || weight > 100)
    ) {
      setSnackbar({
        open: true,
        message: 'O peso fornecido deve estar no intervalo de 1 a 100',
        severity: 'warning',
      });
      setLoading(false);
      return;
    }

    if (!formData.title || !formData.type) {
      if (!formData.type) {
        setSnackbar({
          open: true,
          message: 'Necessário informar o tipo da pergunta',
          severity: 'warning',
        });
      }
      setLoading(false);
      return;
    }

    if (!validationLimitWeight()) {
      setSnackbar({
        open: true,
        message: `A soma dos pesos das perguntas para ${model} não pode ultrapassar 100`,
        severity: 'warning',
      });
      setLoading(false);
      return;
    }

    const questionData: QuestionElement = {
      title: formData.title,
      description: formData.description,
      weight:
        formData.type === QUESTION_TYPES.NUMBER ||
        formData.type === QUESTION_TYPES.SELECT
          ? formData.weight
          : null,
      type: formData.type,
      model: model,
      owner: currentUser,
    };

    try {
      let response;
      if (isEdit) {
        questionData._id = question?._id;
        response = await questionService.update(questionData);
      } else {
        response = await questionService.save(questionData);
      }

      if (response.status === 'success') {
        setSnackbar({
          open: true,
          message: response.message,
          severity: 'success',
        });
        onClose(response.data);
      } else {
        setSnackbar({
          open: true,
          message: response.message,
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro ao salvar pergunta',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return null; // only the logic is provided as per the request
};

export default QuestionSave;
