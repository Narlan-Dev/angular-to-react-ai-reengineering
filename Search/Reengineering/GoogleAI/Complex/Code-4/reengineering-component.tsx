import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './../hooks/useAuth'; // Exemplo de hook de autenticação
import { useLocation } from 'react-router-dom'; // Exemplo para obter dados da rota

// Interfaces para os modelos de dados
interface Routine {
  // Defina as propriedades do modelo Routine aqui
  _id: string;
}

interface Event {
  _id: string;
  // Defina as propriedades do modelo Event aqui
}

const apiService = {
  event: {
    readOnSubscriptionStarted: () =>
      axios.get('/api/events/subscription-started'),
    routineImportExemptions: (
      eventId: string,
      exemptions: any,
      userId: string
    ) =>
      axios.post(`/api/events/${eventId}/import-exemptions`, {
        exemptions,
        userId,
      }),
  },
  routine: {
    readByEventId: (id: string, page: number, filter: string) =>
      axios.get(`/api/routines/event/${id}`, { params: { page, filter } }),
  },
  certificate: {
    routineCreateCertificates: (eventId: string, userId: string) =>
      axios.post(`/api/certificates/routine`, { eventId, userId }),
  },
  presentation: {
    routineImportAssignments: (
      eventId: string,
      assignments: any,
      userId: string
    ) =>
      axios.post(`/api/presentations/routine-import`, {
        eventId,
        assignments,
        userId,
      }),
  },
  review: {
    routineAssignReviewers: (eventId: string, userId: string) =>
      axios.post(`/api/reviews/routine-assign`, { eventId, userId }),
  },
};

const RoutineMain: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalItems: 0,
    pageSize: 10,
  });
  const [searchValue, setSearchValue] = useState('');
  const [filterValue, setFilterValue] = useState('');

  const { isAdmin, currentUser } = useAuth(); // Hook de autenticação personalizado
  const location = useLocation(); // Para detectar mudanças de rota

  const fetchRoutines = useCallback(
    async (eventId: string, page: number, filter: string) => {
      setLoading(true);
      try {
        const response = await apiService.routine.readByEventId(
          eventId,
          page,
          filter
        );
        if (response.data.status === 'success') {
          const {
            routines: newRoutines,
            total,
            currentPage,
            pageSize,
          } = response.data;
          setRoutines(newRoutines);
          setPagination({ page: currentPage, totalItems: total, pageSize });
        } else {
          // toast.error(response.data.message);
        }
      } catch (error) {
        // toast.error('Erro ao buscar rotinas');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchEvents = useCallback(async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      const response = await apiService.event.readOnSubscriptionStarted();
      if (response.data.status === 'success') {
        setEvents(response.data.data);
      } else {
        // toast.error(response.data.message);
      }
    } catch (error) {
      // toast.error('Erro ao buscar eventos');
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    // Recarrega os dados se a rota mudar para a página principal de rotinas
    if (location.pathname === '/home/routine-main') {
      fetchEvents();
    }
  }, [location, fetchEvents]);

  const handleSearch = () => {
    if (!selectedEvent) return;
    setPagination((prev) => ({ ...prev, page: 1 }));
    setFilterValue(searchValue);
    fetchRoutines(selectedEvent._id, 1, searchValue);
  };

  const handleLoadRoutinesByEvent = (event: Event) => {
    setSelectedEvent(event);
    setSearchValue('');
    setFilterValue('');
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchRoutines(event._id, 1, '');
  };

  const handlePaginate = (newPage: number) => {
    if (!selectedEvent) return;
    setPagination((prev) => ({ ...prev, page: newPage }));
    fetchRoutines(selectedEvent._id, newPage, filterValue);
  };

  const createRoutineHandler =
    (apiCall: (eventId: string, userId: string) => Promise<any>) =>
    async () => {
      if (!selectedEvent || !currentUser) return;
      setLoading(true);
      try {
        const response = await apiCall(selectedEvent._id, currentUser._id);
        // Lógica de notificação (sucesso, aviso, erro)
      } catch (error) {
        // toast.error('Erro ao executar a rotina');
      } finally {
        setLoading(false);
        handleLoadRoutinesByEvent(selectedEvent);
      }
    };

  const createUploadHandler =
    (apiCall: (eventId: string, data: any, userId: string) => Promise<any>) =>
    async (uploadedData: any) => {
      if (!selectedEvent || !currentUser || !uploadedData) return;
      setLoading(true);
      try {
        const response = await apiCall(
          selectedEvent._id,
          uploadedData,
          currentUser._id
        );
        // Lógica de notificação
      } catch (error) {
        // toast.error('Erro ao importar dados');
      } finally {
        setLoading(false);
        handleLoadRoutinesByEvent(selectedEvent);
      }
    };

  const handleGenerateCertificates = createRoutineHandler(
    apiService.certificate.routineCreateCertificates
  );
  const handleAssignmentReviewers = createRoutineHandler(
    apiService.review.routineAssignReviewers
  );
  const handleImportAssignments = createUploadHandler(
    apiService.presentation.routineImportAssignments
  );
  const handleImportExemptions = createUploadHandler(
    apiService.event.routineImportExemptions
  );
};
