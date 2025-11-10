import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './../hooks/useAuth'; // Exemplo
import { useNavigate, useLocation } from 'react-router-dom'; // Exemplo

// --- Interfaces e Constantes ---
const SUBMISSION_LIFE_CYCLE = {
  APPROVED: 'APPROVED',
  PENDING_CORRECTION: 'PENDING_CORRECTION',
  PENDING_ADVISOR_REVIEW: 'PENDING_ADVISOR_REVIEW',
  PENDING_REVIEWER_APPROVAL: 'PENDING_REVIEWER_APPROVAL',
  PENDING_ADVISOR_ACCEPTANCE: 'PENDING_ADVISOR_ACCEPTANCE',
  CREATED: 'CREATED',
  DISAPPROVED: 'DISAPPROVED',
  PRESENTED: 'PRESENTED',
};

interface SubmissionElement {
  _id: string;
  title: string;
  // Adicione outras propriedades aqui
}

interface AdminSubmissionElement extends SubmissionElement {
  // Adicione outras propriedades aqui
}

interface EventElement {
  _id: string;
  // Adicione outras propriedades aqui
}

// --- Funções de Serviço (Substituindo os Services do Angular) ---
const submissionService = {
  readByUserId: (userId: string) =>
    axios.get(`/api/submissions/user/${userId}`),
  readByTrackId: (trackId: string, page: number, filter: string) =>
    axios.get(`/api/submissions/track/${trackId}`, {
      params: { page, filter },
    }),
  readUserSubmissions: (page: number, filter: string) =>
    axios.get(`/api/submissions/user-submissions`, {
      params: { page, filter },
    }),
  remove: (submission: SubmissionElement) =>
    axios.delete(`/api/submissions/${submission._id}`),
};

const eventService = {
  readForSubmission: () => axios.get('/api/events/for-submission'),
};

// --- Componente React ---
const SubmissionMain: React.FC = () => {
  // --- State Hooks ---
  const [loading, setLoading] = useState(false);
  const [loadingForAdvisor, setLoadingForAdvisor] = useState(false);
  const [submissions, setSubmissions] = useState<SubmissionElement[]>([]);
  const [adminSubmissions, setAdminSubmissions] = useState<
    AdminSubmissionElement[]
  >([]);
  const [advisorSubmissions, setAdvisorSubmissions] = useState<
    AdminSubmissionElement[]
  >([]);
  const [events, setEvents] = useState<EventElement[]>([]);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pageSize: 10,
  });
  const [advisorPagination, setAdvisorPagination] = useState({
    page: 1,
    total: 0,
    pageSize: 10,
  });
  const [filter, setFilter] = useState({ main: '', advisor: '' });
  const [itemToRemove, setItemToRemove] = useState<SubmissionElement | null>(
    null
  );

  // --- Hooks de bibliotecas externas ---
  const { isAdmin, userId } = useAuth(); // Hook de autenticação personalizado
  const navigate = useNavigate(); // Para navegação programática
  const location = useLocation(); // Para detectar mudanças de rota
  // const toast = useToast(); // Exemplo de hook de notificação

  // --- Funções de busca de dados ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (isAdmin) {
        const response = await eventService.readForSubmission();
        setEvents(response.data.data || []);
      } else {
        const response = await submissionService.readByUserId(userId);
        setSubmissions(response.data.data || []);
      }
    } catch (error) {
      // toast.error('Erro ao buscar dados iniciais');
    } finally {
      setLoading(false);
    }
  }, [isAdmin, userId]);

  const fetchSubmissionsByTrack = useCallback(
    async (trackId: string, page: number, filterValue: string) => {
      setLoading(true);
      try {
        const response = await submissionService.readByTrackId(
          trackId,
          page,
          filterValue
        );
        const {
          submissions: data,
          total,
          currentPage,
          pageSize,
        } = response.data.data;
        setAdminSubmissions(data || []);
        setPagination({ page: currentPage, total, pageSize });
      } catch (error) {
        // toast.error('Erro ao buscar submissões do track');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchSubmissionsForAdvisor = useCallback(
    async (trackId: string, page: number, filterValue: string) => {
      setLoadingForAdvisor(true);
      try {
        const response = await submissionService.readUserSubmissions(
          page,
          filterValue
        );
        const { documents, total, currentPage, pageSize } = response.data.data;
        setAdvisorSubmissions(documents || []);
        setAdvisorPagination({ page: currentPage, total, pageSize });
      } catch (error) {
        // toast.error('Erro ao buscar submissões para o orientador');
      } finally {
        setLoadingForAdvisor(false);
      }
    },
    []
  );

  // --- useEffect para carregar dados ---
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (location.pathname === '/home/submissions') {
      fetchData();
    }
  }, [location, fetchData]);

  // --- Manipuladores de Eventos ---
  const handleLoadSubmissionsByTrack = (track: EventElement) => {
    setSelectedTrackId(track._id);
    setFilter({ main: '', advisor: '' });
    fetchSubmissionsByTrack(track._id, 1, '');
    fetchSubmissionsForAdvisor(track._id, 1, '');
  };

  const handleRemove = async () => {
    if (!itemToRemove) return;
    try {
      await submissionService.remove(itemToRemove);
      // toast.success('Submissão removida com sucesso');
      fetchData(); // Recarrega os dados
    } catch (error) {
      // toast.error('Erro ao remover submissão');
    } finally {
      setItemToRemove(null); // Fecha o modal de confirmação
    }
  };

  // --- Funções Auxiliares ---
  const getSubmissionStatus = (status: string) => {
    const statusMap: { [key: string]: string } = {
      [SUBMISSION_LIFE_CYCLE.APPROVED]: 'Submissão concluída',
      [SUBMISSION_LIFE_CYCLE.PENDING_CORRECTION]: 'Ajuste pendente',
      [SUBMISSION_LIFE_CYCLE.PENDING_ADVISOR_REVIEW]:
        'Aguardando revisão e liberação do orientador',
      [SUBMISSION_LIFE_CYCLE.PENDING_REVIEWER_APPROVAL]: 'Aguardando revisão',
      [SUBMISSION_LIFE_CYCLE.PENDING_ADVISOR_ACCEPTANCE]:
        'Aguardando aceite do orientador',
      [SUBMISSION_LIFE_CYCLE.CREATED]: 'Submissão criada',
      [SUBMISSION_LIFE_CYCLE.DISAPPROVED]: 'Submissão reprovada',
      [SUBMISSION_LIFE_CYCLE.PRESENTED]: 'Submissão apresentada',
    };
    return statusMap[status] || 'Status desconhecido';
  };
};
