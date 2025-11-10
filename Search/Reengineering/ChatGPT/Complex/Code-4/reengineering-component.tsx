import React, { useEffect, useState, useCallback } from 'react';
import { Routine } from 'src/app/_models/routine';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { CertificateService } from 'src/app/_services/certificate.service';
import { EventService } from 'src/app/_services/event.service';
import { RoutineService } from 'src/app/_services/routine.service';
import { PresentationService } from 'src/app/_services/presentation.service';
import { ReviewService } from 'src/app/_services/review.service';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  TextField,
  Tabs,
  Tab,
} from '@mui/material';

// Comentário: Substituí ToastrService por Snackbar do MUI

interface Props {
  authenticationService: AuthenticationService;
  routineService: RoutineService;
  reviewService: ReviewService;
  certificateService: CertificateService;
  presentationService: PresentationService;
  eventService: EventService;
}

const displayedColumns = [
  'counter',
  'type',
  'created_by',
  'created_at',
  'finished_at',
  'status',
  'button_details',
];

const RoutineMain: React.FC<Props> = ({
  authenticationService,
  routineService,
  reviewService,
  certificateService,
  presentationService,
  eventService,
}) => {
  const [loading, setLoading] = useState(false);
  const [loadedFirstTime, setLoadedFirstTime] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [eventId, setEventId] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [filterValue, setFilterValue] = useState<string>('');
  const [tabIndex, setTabIndex] = useState(1);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning';
  }>({ open: false, message: '', severity: 'success' });
  const [search, setSearch] = useState<string>('');

  // Simula Observable do Angular
  useEffect(() => {
    authenticationService.isAdminGlobal().then(setIsAdmin);
    fetchData();
    // eslint-disable-next-line
  }, []);

  // Busca eventos e rotinas
  const fetchData = useCallback(() => {
    setRoutines([]);
    fetchEvents();
    // eslint-disable-next-line
  }, [isAdmin]);

  // Busca eventos
  const fetchEvents = useCallback(() => {
    if (isAdmin) {
      setEvents([]);
      eventService
        .readOnSubscriptionStarted()
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

  // Busca rotinas por evento
  const fetchRoutines = useCallback(
    (id: string, filter: string) => {
      setLoading(true);
      routineService
        .readByEventId(id, page, filter)
        .then((result: any) => {
          setLoading(false);
          setLoadedFirstTime(true);
          if (result.status === 'success') {
            if (result.data.routines.length === 0) {
              return;
            } else {
              setRoutines(result.data.routines);
              setFilterValue(filter);
              setTotalItems(result.total);
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
    [routineService, page]
  );

  // Filtro de busca
  const handleSearch = () => {
    setPage(1);
    fetchRoutines(eventId, search);
  };

  // Filtro da tabela
  const applyFilter = (filter: string) => {
    setFilterValue(filter.trim().toLowerCase());
  };

  // Seleciona evento e carrega rotinas
  const loadRoutinesByEvent = (event: any) => {
    setFilterValue('');
    setSearch('');
    setRoutines([]);
    setPage(1);
    setEventId(event._id);
    setSelectedEvent(event);
    fetchRoutines(event._id, '');
  };

  // Paginação
  const handlePaginate = (_: any, newPage: number) => {
    setPage(newPage + 1);
    fetchRoutines(eventId, filterValue);
  };

  // Diálogo de detalhes (substitua pelo seu componente visual)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);

  const openRoutineDetailsDialog = (routine: Routine) => {
    setSelectedRoutine(routine);
    setDetailsDialogOpen(true);
  };

  const closeRoutineDetailsDialog = () => {
    setDetailsDialogOpen(false);
    setSelectedRoutine(null);
  };

  // Geração de certificados
  const handleGenerateCertificates = () => {
    setLoading(true);
    certificateService
      .routineCreateCertificates(
        selectedEvent._id,
        authenticationService.currentUserValue._id
      )
      .then((result: any) => {
        setLoading(false);
        loadRoutinesByEvent(selectedEvent);
        if (result.status === 'success') {
          setSnackbar({
            open: true,
            message: result.message,
            severity: 'success',
          });
        } else if (result.status === 'warning') {
          setSnackbar({
            open: true,
            message: result.message,
            severity: 'warning',
          });
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
  };

  // Importação de atribuições
  const handleImportAssignments = async (uploadedAssignments: any) => {
    setLoading(true);
    presentationService
      .routineImportAssignments(
        selectedEvent._id,
        uploadedAssignments,
        authenticationService.currentUserValue._id
      )
      .then((result: any) => {
        setLoading(false);
        loadRoutinesByEvent(selectedEvent);
        if (result.status === 'success') {
          setSnackbar({
            open: true,
            message: result.message,
            severity: 'success',
          });
        } else if (result.status === 'warning') {
          setSnackbar({
            open: true,
            message: result.message,
            severity: 'warning',
          });
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
  };

  // Atribuição de revisores
  const handleAssignmentReviewers = () => {
    setLoading(true);
    reviewService
      .routineAssignReviewers(
        selectedEvent._id,
        authenticationService.currentUserValue._id
      )
      .then((result: any) => {
        setLoading(false);
        loadRoutinesByEvent(selectedEvent);
        if (result.status === 'success') {
          setSnackbar({
            open: true,
            message: result.message,
            severity: 'success',
          });
        } else if (result.status === 'warning') {
          setSnackbar({
            open: true,
            message: result.message,
            severity: 'warning',
          });
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
  };

  // Importação de isenções
  const handleImportExemptions = async (uploadedExemptions: any) => {
    setLoading(true);
    eventService
      .routineImportExemptions(
        selectedEvent._id,
        uploadedExemptions,
        authenticationService.currentUserValue._id
      )
      .then((result: any) => {
        setLoading(false);
        loadRoutinesByEvent(selectedEvent);
        if (result.status === 'success') {
          setSnackbar({
            open: true,
            message: result.message,
            severity: 'success',
          });
        } else if (result.status === 'warning') {
          setSnackbar({
            open: true,
            message: result.message,
            severity: 'warning',
          });
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
  };

  return null;
};

export default RoutineMain;
