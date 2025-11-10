import React, { useEffect, useState, useRef, useCallback } from 'react';
import { QUESTION_MODEL } from 'src/app/_constants/questionModel.constants';
import { QuestionElement } from 'src/app/_models/question';
import { QuestionService } from 'src/app/_services/question.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';

interface Props {
  model?: string;
  questionService: QuestionService;
  authenticationService: AuthenticationService;
}

const displayedColumns = [
  'title',
  'description',
  'weight',
  'type',
  'button_edit',
  'button_exclude',
];

const QuestionManager: React.FC<Props> = ({
  model = QUESTION_MODEL.SUBMISSION || QUESTION_MODEL.REVIEWER,
  questionService,
  authenticationService,
}) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [track, setTrack] = useState<any>(null);
  const [questions, setQuestions] = useState<QuestionElement[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [filter, setFilter] = useState<string>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState<keyof QuestionElement>('title');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] =
    useState<QuestionElement | null>(null);

  // Simula ActivatedRoute e track
  useEffect(() => {
    setCurrentUser(authenticationService.currentUserValue);
    // Simule a obtenção do track via rota, se necessário
    // setTrack(...);
    fetchQuestions();
    // eslint-disable-next-line
  }, []);

  const fetchQuestions = useCallback(() => {
    setLoading(true);
    const query = {
      user_id: currentUser?._id,
      track_id: track?._id ?? null,
      model,
    };
    questionService
      .readByUserAndTrack(query)
      .then((response: any) => {
        if (response.status === 'success') {
          setQuestions(response.data);
        } else {
          setQuestions([]);
        }
        setLoading(false);
      })
      .catch((error: any) => {
        setSnackbar({ open: true, message: error, severity: 'error' });
        setLoading(false);
      });
  }, [currentUser, track, model, questionService]);

  // Filtro
  const filteredQuestions = questions.filter((q) =>
    Object.values(q)
      .join(' ')
      .toLowerCase()
      .includes(filter.trim().toLowerCase())
  );

  // Ordenação
  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginação
  const paginatedQuestions = sortedQuestions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Editar pergunta
  const handleEditQuestion = (question: QuestionElement) => {
    setSelectedQuestion(question);
    setEditDialogOpen(true);
  };

  // Excluir pergunta
  const handleRemoveQuestion = (question: QuestionElement) => {
    setSelectedQuestion(question);
    setRemoveDialogOpen(true);
  };

  const confirmRemoveQuestion = () => {
    if (!selectedQuestion) return;
    setLoading(true);
    questionService
      .remove(selectedQuestion)
      .then((response: any) => {
        if (response.status === 'success') {
          setSnackbar({
            open: true,
            message: response.message,
            severity: 'success',
          });
          fetchQuestions();
        } else {
          setSnackbar({
            open: true,
            message: response.message,
            severity: 'error',
          });
        }
        setLoading(false);
      })
      .catch((error: any) => {
        setSnackbar({ open: true, message: error, severity: 'error' });
        setLoading(false);
      });
    setRemoveDialogOpen(false);
  };

  // Diálogo de edição (substitua pelo seu componente de edição)
  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    fetchQuestions();
  };

  // Diálogo de exclusão
  const handleRemoveDialogClose = () => {
    setRemoveDialogOpen(false);
  };

  // Renderização visual (substitua pelo seu template JSX)
  return null;
};

export default QuestionManager;
