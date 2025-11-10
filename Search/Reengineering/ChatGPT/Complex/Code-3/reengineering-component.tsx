import React, { useEffect, useState } from 'react';
import { QUESTION_TYPES } from 'src/app/_constants/questionTypes.constants';
import { QuestionElement } from 'src/app/_models/question';
import { QuestionService } from 'src/app/_services/question.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';

// Substitua Angular Material Dialog por MUI Dialog ou outro modal
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';

// Comentário: Substituí ToastrService por Snackbar do MUI

interface ResponseData {
  question?: QuestionElement;
  model: string;
  track?: any;
}

interface Props {
  open: boolean;
  onClose: (data?: any) => void;
  responseData: ResponseData;
  questionService: QuestionService;
  authenticationService: AuthenticationService;
}

const types = [
  QUESTION_TYPES.TEXT,
  QUESTION_TYPES.LONG_TEXT,
  QUESTION_TYPES.SELECT,
  QUESTION_TYPES.NUMBER,
];

const QuestionSave: React.FC<Props> = ({
  open,
  onClose,
  responseData,
  questionService,
  authenticationService,
}) => {
  const [questionForm, setQuestionForm] = useState({
    title: '',
    type: '',
    weight: null as number | null,
    description: '',
  });
  const [questions, setQuestions] = useState<QuestionElement[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning';
  }>({ open: false, message: '', severity: 'success' });
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Inicialização
  useEffect(() => {
    setCurrentUser(authenticationService.currentUserValue);
    setIsEdit(!!responseData?.question);

    // Preenche o formulário se for edição
    if (responseData?.question) {
      setQuestionForm({
        title: responseData.question.title,
        type: responseData.question.type,
        weight: responseData.question.weight ?? null,
        description: responseData.question.description ?? '',
      });
    } else {
      setQuestionForm({
        title: '',
        type: '',
        weight: null,
        description: '',
      });
    }
    // Busca perguntas existentes
    fetchedQuestions();
    // eslint-disable-next-line
  }, [responseData]);

  // Busca perguntas do usuário e track
  const fetchedQuestions = () => {
    questionService
      .readByUserAndTrack({
        user_id: authenticationService.currentUserValue._id,
        track_id: responseData?.track?._id ?? null,
        model: responseData.model,
      })
      .then((response: any) => {
        if (response.status === 'success') {
          setQuestions(response.data);
        }
      })
      .catch((error: any) => {
        setSnackbar({ open: true, message: error, severity: 'error' });
      });
  };

  // Validação do campo weight
  const isWeightInvalid = () => {
    return (
      (questionForm.type === QUESTION_TYPES.SELECT ||
        questionForm.type === QUESTION_TYPES.NUMBER) &&
      submitted &&
      (questionForm.weight === null || questionForm.weight === undefined)
    );
  };

  // Validação do limite de peso
  const validationLimitWeight = () => {
    const totalWeight = questions.reduce(
      (acc: number, question: QuestionElement) => {
        if (question.weight) {
          if (
            isEdit &&
            responseData.question &&
            question._id === responseData.question._id
          ) {
            return acc;
          }
          acc += question.weight;
        }
        return acc;
      },
      0
    );
    const currentWeight = questionForm.weight || 0;

    if (
      questionForm.type === QUESTION_TYPES.SELECT ||
      questionForm.type === QUESTION_TYPES.NUMBER
    ) {
      const newTotal = currentWeight + totalWeight;
      if (newTotal > 100) {
        return false;
      }
      return true;
    }
    return true;
  };

  // Manipulação de campos do formulário
  const handleChange = (field: string, value: any) => {
    setQuestionForm((prev) => ({
      ...prev,
      [field]: value,
      // Limpa o peso se o tipo mudar para TEXT/LONG_TEXT
      ...(field === 'type' &&
      value !== QUESTION_TYPES.SELECT &&
      value !== QUESTION_TYPES.NUMBER
        ? { weight: null }
        : {}),
    }));
  };

  // Submissão do formulário
  const handleSubmit = async () => {
    setLoading(true);
    setSubmitted(true);

    const { title, type, weight, description } = questionForm;

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

    if (!title || !type) {
      setSnackbar({
        open: true,
        message: 'Necessário informar o título e o tipo da pergunta',
        severity: 'warning',
      });
      setLoading(false);
      return;
    }

    if (!validationLimitWeight()) {
      setSnackbar({
        open: true,
        message: `A soma dos pesos das perguntas para ${responseData.model} não pode ultrapassar 100`,
        severity: 'warning',
      });
      setLoading(false);
      return;
    }

    const question: QuestionElement = {
      title,
      description,
      weight:
        type === QUESTION_TYPES.NUMBER || type === QUESTION_TYPES.SELECT
          ? weight
          : null,
      type,
      model: responseData.model,
      owner: currentUser,
    };

    try {
      let response;
      if (isEdit && responseData.question) {
        question['_id'] = responseData.question._id;
        response = await questionService.update(question);
      } else {
        response = await questionService.save(question);
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
    } catch (error: any) {
      setSnackbar({ open: true, message: error, severity: 'error' });
    }
    setLoading(false);
  };

  // Fechar o diálogo
  const handleClose = () => {
    onClose();
  };

  return null;
};

export default QuestionSave;
