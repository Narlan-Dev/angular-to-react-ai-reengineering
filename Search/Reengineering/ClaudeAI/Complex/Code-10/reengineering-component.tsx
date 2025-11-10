import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  Box,
  Typography,
} from '@mui/material';
import { Visibility, Download, Email } from '@mui/icons-material';
import { SubmissionService } from './../../_services/submission.service';
import { SubmissionElement } from 'src/app/_models/submissions';
import SubmissionDetails from '../submission-details/submission-details.component';
import ConfirmDialog from 'src/app/_shared/confirm-dialog/confirm-dialog.component';

interface ReviewStatusProps {
  submissionService: SubmissionService;
}

const ReviewStatus: React.FC<ReviewStatusProps> = ({ submissionService }) => {
  const [loading, setLoading] = useState(false);
  const [statusReview, setStatusReview] = useState<boolean>(false);
  const [track, setTrack] = useState<any>(null);
  const [submissions, setSubmissions] = useState<SubmissionElement[]>([]);
  const [downloading, setDownloading] = useState(false);
  const [tablePage, setTablePage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState<keyof SubmissionElement>('title');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [filterValue, setFilterValue] = useState('');
  const [filteredSubmissions, setFilteredSubmissions] = useState<
    SubmissionElement[]
  >([]);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<SubmissionElement | null>(null);
  const [confirmDialogData, setConfirmDialogData] = useState<{
    message: string;
    action: () => void;
  } | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const navigate = useNavigate();
  const params = useParams();

  const displayedColumns = [
    { id: 'counter', label: 'Contador' },
    { id: 'title', label: 'Título' },
    { id: 'knowledge_area', label: 'Área de Conhecimento' },
    { id: 'authors', label: 'Autores' },
    { id: 'reviewers', label: 'Revisores' },
    { id: 'actions', label: 'Ações' },
  ];

  useEffect(() => {
    const status = params.statusReview;
    const trackParam = params.track;

    if (status && trackParam) {
      setStatusReview(JSON.parse(status));
      setTrack(JSON.parse(trackParam));
    }

    fetchSubmissionStatusEvent();
  }, [params]);

  useEffect(() => {
    applyFilter(filterValue);
  }, [filterValue, submissions]);

  const fetchSubmissionStatusEvent = async () => {
    if (!track) return;

    setLoading(true);
    try {
      const result = await submissionService.readByStatusTrack(
        track,
        statusReview
      );
      setLoading(false);
      setSubmissions(result.data);
      setFilteredSubmissions(result.data);
    } catch (error) {
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Erro ao buscar submissões',
        severity: 'error',
      });
    }
  };

  const applyFilter = (filterVal: string) => {
    if (!filterVal.trim()) {
      setFilteredSubmissions(submissions);
    } else {
      const filtered = submissions.filter((submission) =>
        Object.values(submission).some((value) =>
          String(value).toLowerCase().includes(filterVal.toLowerCase())
        )
      );
      setFilteredSubmissions(filtered);
    }
  };

  const openDetailsDialog = (submission: SubmissionElement) => {
    setSelectedSubmission(submission);
    setOpenDetailsDialog(true);
  };

  const downloadSubmissionsByApprovalStatus = async (status: boolean) => {
    if (!track) return;

    setDownloading(true);
    try {
      const response =
        await submissionService.readReportSubmissionsByApprovalStatus(
          track._id,
          status
        );
      setDownloading(false);
      // downloadXlsxFile(response, `submissoes-${status ? "aprovadas" : "reprovadas"}`);
    } catch (error) {
      setDownloading(false);
      setSnackbar({
        open: true,
        message: 'Erro ao baixar relatório',
        severity: 'error',
      });
    }
  };

  const sendSubmissionResultByEmail = (status: boolean) => {
    const submissionsList = submissions.map((submission) => ({
      owner: submission.owner,
      submissionId: submission._id,
      event: submission.event,
    }));

    setConfirmDialogData({
      message: `Deseja comunicar o resultado via e-mail para os ${submissionsList.length} participantes envolvidos?`,
      action: () => handleEmailConfirm(submissionsList, status),
    });
    setOpenConfirmDialog(true);
  };

  const handleEmailConfirm = async (
    submissionsList: any[],
    status: boolean
  ) => {
    try {
      await submissionService.reportSubmissionStatusByEmail(
        submissionsList,
        status
      );
      setSnackbar({
        open: true,
        message: 'E-mails enviados com sucesso!',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro ao enviar e-mails',
        severity: 'error',
      });
    }
  };

  const handleRequestSort = (property: keyof SubmissionElement) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedSubmissions = React.useMemo(() => {
    return [...filteredSubmissions].sort((a, b) => {
      const aValue = a[orderBy] || '';
      const bValue = b[orderBy] || '';

      if (order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [filteredSubmissions, order, orderBy]);

  const paginatedSubmissions = sortedSubmissions.slice(
    tablePage * rowsPerPage,
    tablePage * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setTablePage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setTablePage(0);
  };

  return null;
};

export default ReviewStatus;
