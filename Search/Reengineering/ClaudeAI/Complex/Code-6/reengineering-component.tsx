import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Tabs,
  Tab,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { Edit, Delete, Add, Visibility } from '@mui/icons-material';
import { SubmissionElement } from 'src/app/_models/submissions';
import { AdminSubmissionElement } from 'src/app/_models/admin-submissions';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { SubmissionService } from 'src/app/_services/submission.service';
import { EventService } from 'src/app/_services/event.service';
import { SUBMISSION_LIFE_CYCLE } from 'src/app/_constants/submissionCycle.constants';
import ConfirmDialog from 'src/app/_shared/confirm-dialog/confirm-dialog.component';

interface SubmissionMainProps {
  authenticationService: AuthenticationService;
  submissionService: SubmissionService;
  eventService: EventService;
}

const SubmissionMain: React.FC<SubmissionMainProps> = ({
  authenticationService,
  submissionService,
  eventService,
}) => {
  const [loading, setLoading] = useState(false);
  const [loadingForAdvisorSubmissions, setLoadingForAdvisorSubmissions] =
    useState(false);
  const [loadedFirstTime, setLoadedFirstTime] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [submissions, setSubmissions] = useState<SubmissionElement[]>([]);
  const [submissionsAdmin, setSubmissionsAdmin] = useState<
    AdminSubmissionElement[]
  >([]);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [trackId, setTrackId] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [amountUsers, setAmountUsers] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<any>(null);
  const [pageSize, setPageSize] = useState<any>(null);
  const [searchValue, setSearchValue] = useState('');
  const [searchAdvisorValue, setSearchAdvisorValue] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [tabIndex, setTabIndex] = useState(1);
  const [pageForAdvisor, setPageForAdvisor] = useState(1);
  const [submissionsAdminForAdvisor, setSubmissionsAdminForAdvisor] = useState<
    AdminSubmissionElement[]
  >([]);
  const [filterValueForAdvisor, setFilterValueForAdvisor] = useState('');
  const [amountOfSubmissions, setAmountOfSubmissions] = useState<any>(null);
  const [currentPageForAdvisor, setCurrentPageForAdvisor] = useState<any>(null);
  const [pageSizeForAdvisor, setPageSizeForAdvisor] = useState<any>(null);
  const [tablePage, setTablePage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState<string>('created_at');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
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

  const displayedColumns = [
    { id: 'counter', label: 'Contador' },
    { id: 'title', label: 'Título' },
    { id: 'created_at', label: 'Criado em' },
    { id: 'event_short_name', label: 'Evento' },
    { id: 'event_track_name', label: 'Track' },
    { id: 'presentation', label: 'Apresentação' },
    { id: 'actions', label: 'Ações' },
  ];

  const adminDisplayedColumns = [
    { id: 'counter', label: 'Contador' },
    { id: 'cpf', label: 'CPF' },
    { id: 'title', label: 'Título' },
    { id: 'created_at', label: 'Criado em' },
    { id: 'presentation', label: 'Apresentação' },
    { id: 'status', label: 'Status' },
    { id: 'actions', label: 'Ações' },
  ];

  const displayedColumnsForAdvisor = [
    { id: 'counter', label: 'Contador' },
    { id: 'title', label: 'Título' },
    { id: 'created_at', label: 'Criado em' },
    { id: 'actions', label: 'Ações' },
  ];

  useEffect(() => {
    authenticationService.isAdminGlobal().then(setIsAdmin);
    fetchData();
  }, []);

  const fetchData = () => {
    if (!isAdmin) {
      setSubmissions([]);
      fetchSubmissions();
    } else {
      setSubmissionsAdmin([]);
      if (trackId) {
        fetchSubmissionsByTrack(trackId, filterValue);
      } else {
        fetchEvents();
      }
    }
  };

  const fetchSubmissions = async () => {
    if (!isAdmin) {
      try {
        const result = await submissionService.readByUserId(
          authenticationService.userId
        );
        setLoading(false);
        if (result.status === 'success') {
          setSubmissions(result.data);
          setTabIndex(0);
        } else {
          setSnackbar({
            open: true,
            message: result.message,
            severity: 'error',
          });
        }
      } catch (error) {
        setLoading(false);
        setSnackbar({
          open: true,
          message: 'Erro ao buscar submissões',
          severity: 'error',
        });
      }
    }
  };

  const getSubmissionStatus = (status: string) => {
    switch (status) {
      case SUBMISSION_LIFE_CYCLE.APPROVED:
        return 'Submissão concluída';
      case SUBMISSION_LIFE_CYCLE.PENDING_CORRECTION:
        return 'Ajuste pendente';
      case SUBMISSION_LIFE_CYCLE.PENDING_ADVISOR_REVIEW:
        return 'Aguardando revisão e liberação do orientador';
      case SUBMISSION_LIFE_CYCLE.PENDING_REVIEWER_APPROVAL:
        return 'Aguardando revisão';
      case SUBMISSION_LIFE_CYCLE.PENDING_ADVISOR_ACCEPTANCE:
        return 'Aguardando aceite do orientador';
      case SUBMISSION_LIFE_CYCLE.CREATED:
        return 'Submissão criada';
      case SUBMISSION_LIFE_CYCLE.DISAPPROVED:
        return 'Submissão reprovada';
      case SUBMISSION_LIFE_CYCLE.PRESENTED:
        return 'Submissão apresentada';
      default:
        return 'Aguardando liberação do orientador';
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchSubmissionsByTrack(trackId, searchValue);
  };

  const handleSearchAdvisor = () => {
    setPage(1);
    fetchSubmissionsForAdvisorByTrack(trackId, searchAdvisorValue);
  };

  const navigateToEditSubmission = (submission: any) => {
    navigate(`/home/submission-save/${submission._id}`);
  };

  const navigateToValidateSubmission = (submission: any) => {
    navigate(`/home/submission-save/${submission._id}`);
  };

  const removeSubmission = async (element: any) => {
    try {
      await submissionService.remove(element);
      fetchData();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro ao remover submissão',
        severity: 'error',
      });
    }
  };

  const handleOpenRemoveDialog = (submission: any) => {
    setSelectedSubmission(submission);
    setOpenRemoveDialog(true);
  };

  const handleRemoveDialogClose = (confirmed?: boolean) => {
    if (confirmed && selectedSubmission) {
      removeSubmission(selectedSubmission);
    }
    setOpenRemoveDialog(false);
    setSelectedSubmission(null);
  };

  const navigateToNewSubmission = () => {
    navigate('/home/choose-track', {
      state: {
        destinationRoute: 'submission-save',
        title: 'Nova submissão',
        eventServiceRoute: 'on_submission',
      },
    });
  };

  const fetchEvents = async () => {
    if (isAdmin) {
      setEvents([]);
      try {
        const result = await eventService.readForSubmission();
        setLoading(false);
        if (result.status === 'success') {
          setEvents(result.data);
        } else {
          setSnackbar({
            open: true,
            message: result.message,
            severity: 'error',
          });
        }
      } catch (error) {
        setLoading(false);
        setSnackbar({
          open: true,
          message: 'Erro ao buscar eventos',
          severity: 'error',
        });
      }
    }
  };

  const loadSubmissionsByTrack = (track: any) => {
    setFilterValue('');
    setSearchValue('');
    setSearchAdvisorValue('');
    setSubmissionsAdmin([]);
    setPage(1);
    setTrackId(track._id);
    fetchSubmissionsByTrack(track._id, filterValue);
    fetchSubmissionsForAdvisorByTrack(track._id, filterValue);
  };

  const fetchSubmissionsForAdvisorByTrack = async (
    id: string,
    filterVal: string
  ) => {
    setLoadingForAdvisorSubmissions(true);
    try {
      const result = await submissionService.readUserSubmissions(
        pageForAdvisor,
        filterVal
      );
      setLoadingForAdvisorSubmissions(false);
      setLoadedFirstTime(true);
      if (result.status === 'success') {
        if (result.data.documents.length === 0) {
          return;
        } else {
          setSubmissionsAdminForAdvisor(result.data.documents);
          setFilterValueForAdvisor(filterVal);
          setAmountOfSubmissions(result.total);
          setCurrentPageForAdvisor(result.currentPage);
          setPageSizeForAdvisor(result.pageSize);
          setTabIndex(0);
        }
      } else {
        setSnackbar({ open: true, message: result.message, severity: 'error' });
      }
    } catch (error) {
      setLoadingForAdvisorSubmissions(false);
      setLoadedFirstTime(true);
      setSnackbar({
        open: true,
        message: 'Erro ao buscar submissões',
        severity: 'error',
      });
    }
  };

  const fetchSubmissionsByTrack = async (id: string, filterVal: string) => {
    setLoading(true);
    try {
      const result = await submissionService.readByTrackId(id, page, filterVal);
      setLoading(false);
      setLoadedFirstTime(true);
      if (result.status === 'success') {
        if (result.data.submissions.length === 0) {
          return;
        } else {
          setSubmissionsAdmin(result.data.submissions);
          setFilterValue(filterVal);
          setAmountUsers(result.total);
          setCurrentPage(result.currentPage);
          setPageSize(result.pageSize);
          setTabIndex(0);
        }
      } else {
        setSnackbar({ open: true, message: result.message, severity: 'error' });
      }
    } catch (error) {
      setLoading(false);
      setLoadedFirstTime(true);
      setSnackbar({
        open: true,
        message: 'Erro ao buscar submissões',
        severity: 'error',
      });
    }
  };

  const paginate = (newPage: number) => {
    setPage(newPage);
    fetchSubmissionsByTrack(trackId, filterValue);
  };

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

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

export default SubmissionMain;
