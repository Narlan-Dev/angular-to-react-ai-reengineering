import React, { useEffect, useState, useCallback } from 'react';
import { SubmissionElement } from 'src/app/_models/submissions';
import { AdminSubmissionElement } from 'src/app/_models/admin-submissions';
import { SubmissionService } from 'src/app/_services/submission.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { EventService } from 'src/app/_services/event.service';
import { SUBMISSION_LIFE_CYCLE } from 'src/app/_constants/submissionCycle.constants';
import { Snackbar, Alert } from '@mui/material';

// Comentário: Substituí ToastrService por Snackbar do MUI

interface Props {
  submissionService: SubmissionService;
  authenticationService: AuthenticationService;
  eventService: EventService;
}

const displayedColumns = [
  'counter',
  'title',
  'created_at',
  'event_short_name',
  'event_track_name',
  'presentation',
  'button_edit',
  'button_exclude',
];
const adminDisplayedColumns = [
  'counter',
  'cpf',
  'title',
  'created_at',
  'presentation',
  'status',
  'button_edit',
  'button_exclude',
];
const displayedColumnsForAdvisor = [
  'counter',
  'title',
  'created_at',
  'button_edit',
];

const SubmissionMain: React.FC<Props> = ({
  submissionService,
  authenticationService,
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
  const [search, setSearch] = useState<string>('');
  const [searchAdvisor, setSearchAdvisor] = useState<string>('');
  const [filterValue, setFilterValue] = useState<string>('');
  const [tabIndex, setTabIndex] = useState(1);
  const [pageForAdvisor, setPageForAdvisor] = useState(1);
  const [submissionsAdminForAdvisor, setSubmissionsAdminForAdvisor] = useState<
    AdminSubmissionElement[]
  >([]);
  const [filterValueForAdvisor, setFilterValueForAdvisor] =
    useState<string>('');
  const [amountOfSubmissions, setAmountOfSubmissions] = useState<any>(null);
  const [currentPageForAdvisor, setCurrentPageForAdvisor] = useState<any>(null);
  const [pageSizeForAdvisor, setPageSizeForAdvisor] = useState<any>(null);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning';
  }>({ open: false, message: '', severity: 'success' });

  // Inicialização e detecção de admin
  useEffect(() => {
    authenticationService.isAdminGlobal().then(setIsAdmin);
    setSearch('');
    setSearchAdvisor('');
    fetchData();
    // Simula router.events do Angular
    // Adapte para sua lógica de navegação se necessário
    // eslint-disable-next-line
  }, [isAdmin, trackId]);

  // Busca dados iniciais
  const fetchData = useCallback(() => {
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
    // eslint-disable-next-line
  }, [isAdmin, trackId, filterValue]);

  // Busca submissões do usuário
  const fetchSubmissions = useCallback(() => {
    if (!isAdmin) {
      submissionService
        .readByUserId(authenticationService.userId)
        .then((result: any) => {
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
        })
        .catch((error: any) => {
          setLoading(false);
          setSnackbar({ open: true, message: error, severity: 'error' });
        });
    }
  }, [isAdmin, submissionService, authenticationService]);

  // Busca eventos para admin
  const fetchEvents = useCallback(() => {
    if (isAdmin) {
      setEvents([]);
      eventService
        .readForSubmission()
        .then((result: any) => {
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
        })
        .catch((error: any) => {
          setLoading(false);
          setSnackbar({ open: true, message: error, severity: 'error' });
        });
    }
  }, [isAdmin, eventService]);

  // Busca submissões por track para admin
  const fetchSubmissionsByTrack = useCallback(
    (id: any, filter: string) => {
      setLoading(true);
      submissionService
        .readByTrackId(id, page, filter)
        .then((result: any) => {
          setLoading(false);
          setLoadedFirstTime(true);
          if (result.status === 'success') {
            if (result.data.submissions.length === 0) {
              setSnackbar({
                open: true,
                message: 'Nenhuma submissão encontrada',
                severity: 'warning',
              });
              return;
            } else {
              setSubmissionsAdmin(result.data.submissions);
              setFilterValue(filter);
              setAmountUsers(result.total);
              setCurrentPage(result.currentPage);
              setPageSize(result.pageSize);
              setTabIndex(0);
            }
          } else {
            setSnackbar({
              open: true,
              message: result.message,
              severity: 'error',
            });
          }
        })
        .catch((error: any) => {
          setLoading(false);
          setLoadedFirstTime(true);
          setSnackbar({ open: true, message: error, severity: 'error' });
        });
    },
    [submissionService, page]
  );

  // Busca submissões para advisor por track
  const fetchSubmissionsForAdvisorByTrack = useCallback(
    (id: any, filter: string) => {
      setLoadingForAdvisorSubmissions(true);
      submissionService
        .readUserSubmissions(pageForAdvisor, filter)
        .then((result: any) => {
          setLoadingForAdvisorSubmissions(false);
          setLoadedFirstTime(true);
          if (result.status === 'success') {
            if (result.data.documents.length === 0) {
              setSnackbar({
                open: true,
                message: 'Nenhuma submissão encontrada para advisor',
                severity: 'warning',
              });
              return;
            } else {
              setSubmissionsAdminForAdvisor(result.data.documents);
              setFilterValueForAdvisor(filter);
              setAmountOfSubmissions(result.total);
              setCurrentPageForAdvisor(result.currentPage);
              setPageSizeForAdvisor(result.pageSize);
              setTabIndex(0);
            }
          } else {
            setSnackbar({
              open: true,
              message: result.message,
              severity: 'error',
            });
          }
        })
        .catch((error: any) => {
          setLoadingForAdvisorSubmissions(false);
          setLoadedFirstTime(true);
          setSnackbar({ open: true, message: error, severity: 'error' });
        });
    },
    [submissionService, pageForAdvisor]
  );

  // Busca status da submissão
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

  // Busca por submissão
  const handleSearch = () => {
    setPage(1);
    fetchSubmissionsByTrack(trackId, search);
  };

  // Busca por advisor
  const handleSearchAdvisor = () => {
    setPage(1);
    fetchSubmissionsForAdvisorByTrack(trackId, searchAdvisor);
  };

  // Filtro da tabela
  const applyFilter = (filter: string) => {
    setFilterValue(filter.trim().toLowerCase());
  };

  // Navegação para editar submissão
  const navigateToEditSubmission = (submission: SubmissionElement) => {
    // Adapte para sua lógica de navegação
    // Exemplo: useNavigate do react-router-dom
  };

  // Navegação para validar submissão
  const navigateToValidateSubmission = (submission: SubmissionElement) => {
    // Adapte para sua lógica de navegação
  };

  // Remover submissão
  const removeSubmission = (element: SubmissionElement) => {
    submissionService
      .remove(element)
      .then(() => {
        fetchData();
      })
      .catch((error: any) => {
        setSnackbar({ open: true, message: error, severity: 'error' });
      });
  };

  // Diálogo de remoção
  const openRemoveDialog = (submission: SubmissionElement) => {
    // Implemente seu modal de confirmação
    // Se confirmado, chame removeSubmission(submission)
  };

  // Navegação para nova submissão
  const navigateToNewSubmission = () => {
    // Adapte para sua lógica de navegação
  };

  // Carregar submissões por track
  const loadSubmissionsByTrack = (track: any) => {
    setFilterValue('');
    setSearch('');
    setSearchAdvisor('');
    setSubmissionsAdmin([]);
    setPage(1);
    setTrackId(track._id);
    fetchSubmissionsByTrack(track._id, '');
    fetchSubmissionsForAdvisorByTrack(track._id, '');
  };

  // Paginação
  const paginate = (newPage: number) => {
    setPage(newPage);
    fetchSubmissionsByTrack(trackId, filterValue);
  };

  return null; // Substitua por JSX conforme o template Angular original
};

export default SubmissionMain;
