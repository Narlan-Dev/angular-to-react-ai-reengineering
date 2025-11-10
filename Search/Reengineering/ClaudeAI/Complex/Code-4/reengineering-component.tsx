import React, { useEffect, useState, useRef } from 'react';
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
} from '@mui/material';
import { Visibility, Upload } from '@mui/icons-material';
import { Routine } from 'src/app/_models/routine';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { RoutineService } from 'src/app/_services/routine.service';
import { CertificateService } from 'src/app/_services/certificate.service';
import { EventService } from 'src/app/_services/event.service';
import { PresentationService } from 'src/app/_services/presentation.service';
import { ReviewService } from 'src/app/_services/review.service';
import RoutineDetails from '../routine-details/routine-details.component';
import RoutineUpload from '../routine-upload/routine-upload.component';

interface RoutineMainProps {
  authenticationService: AuthenticationService;
  routineService: RoutineService;
  certificateService: CertificateService;
  eventService: EventService;
  presentationService: PresentationService;
  reviewService: ReviewService;
}

const RoutineMain: React.FC<RoutineMainProps> = ({
  authenticationService,
  routineService,
  certificateService,
  eventService,
  presentationService,
  reviewService,
}) => {
  const [loading, setLoading] = useState(false);
  const [loadedFirstTime, setLoadedFirstTime] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [eventId, setEventId] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [currentPage, setCurrentPage] = useState<any>(null);
  const [totalItems, setTotalItems] = useState<any>(null);
  const [pageSize, setPageSize] = useState<any>(null);
  const [searchValue, setSearchValue] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [tabIndex, setTabIndex] = useState(1);
  const [pageForAdvisor, setPageForAdvisor] = useState(1);
  const [amountOfSubmissions, setAmountOfSubmissions] = useState<any>(null);
  const [tablePage, setTablePage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState<keyof Routine>('created_at');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [filteredRoutines, setFilteredRoutines] = useState<Routine[]>([]);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [uploadType, setUploadType] = useState<string>('');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const navigate = useNavigate();

  const displayedColumns = [
    { id: 'counter', label: 'Contador' },
    { id: 'type', label: 'Tipo' },
    { id: 'created_by', label: 'Criado por' },
    { id: 'created_at', label: 'Criado em' },
    { id: 'finished_at', label: 'Finalizado em' },
    { id: 'status', label: 'Status' },
    { id: 'actions', label: 'Ações' },
  ];

  useEffect(() => {
    authenticationService.isAdminGlobal().then(setIsAdmin);
    fetchData();
  }, []);

  useEffect(() => {
    applyFilter(filterValue);
  }, [filterValue, routines]);

  const fetchData = () => {
    setRoutines([]);
    fetchEvents();
  };

  const applyFilter = (filterVal: string) => {
    if (!filterVal.trim()) {
      setFilteredRoutines(routines);
    } else {
      const filtered = routines.filter((routine) =>
        Object.values(routine).some((value) =>
          String(value).toLowerCase().includes(filterVal.toLowerCase())
        )
      );
      setFilteredRoutines(filtered);
    }
  };

  const openRoutineDetailsDialog = (routine: Routine) => {
    setSelectedRoutine(routine);
    setOpenDetailsDialog(true);
  };

  const fetchEvents = async () => {
    if (isAdmin) {
      setEvents([]);
      try {
        const result = await eventService.readOnSubscriptionStarted();
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

  const loadRoutinesByEvent = (event: any) => {
    setFilterValue('');
    setSearchValue('');
    setRoutines([]);
    setPage(1);
    setEventId(event._id);
    setSelectedEvent(event);
    fetchRoutines(event._id, '');
  };

  const fetchRoutines = async (id: string, filterVal: string) => {
    setLoading(true);
    try {
      const result = await routineService.readByEventId(id, page, filterVal);
      setLoading(false);
      setLoadedFirstTime(true);
      if (result.status === 'success') {
        if (result.data.routines.length === 0) {
          return;
        } else {
          setRoutines(result.data.routines);
          setFilteredRoutines(result.data.routines);
          setFilterValue(filterVal);
          setTotalItems(result.total);
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
        message: 'Erro ao buscar rotinas',
        severity: 'error',
      });
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchRoutines(eventId, searchValue);
  };

  const handleGenerateCertificates = async () => {
    setLoading(true);
    try {
      const result = await certificateService.routineCreateCertificates(
        selectedEvent._id,
        authenticationService.currentUserValue._id
      );
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
        setSnackbar({ open: true, message: result.message, severity: 'error' });
      }
    } catch (error) {
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Erro ao gerar certificados',
        severity: 'error',
      });
    }
  };

  const handleImportAssignments = () => {
    setUploadType('atribuições');
    setOpenUploadDialog(true);
  };

  const handleUploadDialogClose = async (uploadedData?: any) => {
    setOpenUploadDialog(false);
    if (uploadedData) {
      setLoading(true);
      try {
        let result;
        if (uploadType === 'atribuições') {
          result = await presentationService.routineImportAssignments(
            selectedEvent._id,
            uploadedData,
            authenticationService.currentUserValue._id
          );
        } else if (uploadType === 'isenções') {
          result = await eventService.routineImportExemptions(
            selectedEvent._id,
            uploadedData,
            authenticationService.currentUserValue._id
          );
        }

        setLoading(false);
        loadRoutinesByEvent(selectedEvent);
        if (result?.status === 'success') {
          setSnackbar({
            open: true,
            message: result.message,
            severity: 'success',
          });
        } else if (result?.status === 'warning') {
          setSnackbar({
            open: true,
            message: result.message,
            severity: 'warning',
          });
        } else {
          setSnackbar({
            open: true,
            message: result?.message || 'Erro',
            severity: 'error',
          });
        }
      } catch (error) {
        setLoading(false);
        setSnackbar({
          open: true,
          message: 'Erro no upload',
          severity: 'error',
        });
      }
    }
  };

  const handleAssignmentReviewers = async () => {
    setLoading(true);
    try {
      const result = await reviewService.routineAssignReviewers(
        selectedEvent._id,
        authenticationService.currentUserValue._id
      );
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
        setSnackbar({ open: true, message: result.message, severity: 'error' });
      }
    } catch (error) {
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Erro ao atribuir revisores',
        severity: 'error',
      });
    }
  };

  const handleImportExemptions = () => {
    setUploadType('isenções');
    setOpenUploadDialog(true);
  };

  const paginate = (newPage: number) => {
    setPage(newPage);
    fetchRoutines(eventId, filterValue);
  };

  const handleRequestSort = (property: keyof Routine) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedRoutines = React.useMemo(() => {
    return [...filteredRoutines].sort((a, b) => {
      const aValue = a[orderBy] || '';
      const bValue = b[orderBy] || '';

      if (order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [filteredRoutines, order, orderBy]);

  const paginatedRoutines = sortedRoutines.slice(
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

export default RoutineMain;
