import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  TextField,
  Button,
  Dialog,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { QuestionElement } from 'src/app/_models/question';
import { QuestionService } from 'src/app/_services/question.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { QUESTION_MODEL } from './../../_constants/questionModel.constants';
import QuestionSave from '../question-save/question-save.component';
import ConfirmDialog from 'src/app/_shared/confirm-dialog/confirm-dialog.component';

interface QuestionManagerProps {
  model?: string;
  questionService: QuestionService;
  authenticationService: AuthenticationService;
}

const QuestionManager: React.FC<QuestionManagerProps> = ({
  model = QUESTION_MODEL.SUBMISSION || QUESTION_MODEL.REVIEWER,
  questionService,
  authenticationService,
}) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [track, setTrack] = useState<any>(null);
  const [questions, setQuestions] = useState<QuestionElement[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [filteredQuestions, setFilteredQuestions] = useState<QuestionElement[]>(
    []
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState<keyof QuestionElement>('title');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [filterValue, setFilterValue] = useState('');
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
  const [selectedQuestion, setSelectedQuestion] =
    useState<QuestionElement | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const params = useParams();

  const displayedColumns = [
    { id: 'title', label: 'Título' },
    { id: 'description', label: 'Descrição' },
    { id: 'weight', label: 'Peso' },
    { id: 'type', label: 'Tipo' },
    { id: 'actions', label: 'Ações' },
  ];

  useEffect(() => {
    setCurrentUser(authenticationService.currentUserValue);
    const trackParam = params.track;
    if (trackParam) {
      setTrack(JSON.parse(trackParam));
    }
    fetchQuestions();
  }, []);

  useEffect(() => {
    applyFilterQuestion(filterValue);
  }, [filterValue, questions]);

  const fetchQuestions = async () => {
    setLoading(true);
    const query = {
      user_id: currentUser?._id,
      track_id: track?._id ?? null,
      model: model,
    };

    try {
      const response = await questionService.readByUserAndTrack(query);
      if (response.status === 'success') {
        setQuestions(response.data);
        setFilteredQuestions(response.data);
      } else {
        setQuestions([]);
        setFilteredQuestions([]);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro ao buscar perguntas',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilterQuestion = (filterValue: string) => {
    if (!filterValue.trim()) {
      setFilteredQuestions(questions);
    } else {
      const filtered = questions.filter((question) =>
        Object.values(question).some((value) =>
          String(value).toLowerCase().includes(filterValue.toLowerCase())
        )
      );
      setFilteredQuestions(filtered);
    }
  };

  const handleRequestSort = (property: keyof QuestionElement) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedQuestions = React.useMemo(() => {
    return [...filteredQuestions].sort((a, b) => {
      const aValue = a[orderBy] || '';
      const bValue = b[orderBy] || '';

      if (order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [filteredQuestions, order, orderBy]);

  const paginatedQuestions = sortedQuestions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const navigateToEditQuestion = (question: QuestionElement) => {
    setSelectedQuestion(question);
    setOpenSaveDialog(true);
  };

  const openQuestionSaveDialog = () => {
    setSelectedQuestion(null);
    setOpenSaveDialog(true);
  };

  const handleSaveDialogClose = () => {
    setOpenSaveDialog(false);
    setSelectedQuestion(null);
    fetchQuestions();
  };

  const openRemoveQuestionDialog = (question: QuestionElement) => {
    setSelectedQuestion(question);
    setOpenRemoveDialog(true);
  };

  const handleRemoveDialogClose = async (confirmed?: boolean) => {
    if (confirmed && selectedQuestion) {
      try {
        const response = await questionService.remove(selectedQuestion);
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
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Erro ao remover pergunta',
          severity: 'error',
        });
      }
    }
    setOpenRemoveDialog(false);
    setSelectedQuestion(null);
  };

  const refreshComponent = (): Promise<QuestionElement[]> => {
    return new Promise<QuestionElement[]>((resolve) => {
      fetchQuestions().then(() => {
        resolve(questions);
      });
    });
  };

  return null; /* The component UI is omitted as per instruction to focus on core logic */
};

export default QuestionManager;
