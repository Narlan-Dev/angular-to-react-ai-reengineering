import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './../hooks/useAuth'; // Exemplo de hook de autenticação
import { useLocation } from 'react-router-dom'; // Exemplo para obter a localização da rota

// Sugestão de dependências:
// npm install axios react-router-dom react-toastify file-saver
// ou
// yarn add axios react-router-dom react-toastify file-saver

// A biblioteca file-saver é uma boa opção para recriar a funcionalidade de download.
import { saveAs } from 'file-saver';

interface EventData {
  _id: string;
  // Defina outras propriedades do evento aqui
}

interface TrackData {
  _id: string;
  name: string;
  // Defina outras propriedades do track aqui
}

// Funções de serviço para chamadas de API
const apiService = {
  events: {
    readForSubmission: () => axios.get('/api/events/for-submission'),
  },
  submissions: {
    readReport: (trackId: string) =>
      axios.get(`/api/submissions/report/${trackId}`, { responseType: 'blob' }), // 'blob' para download de arquivo
  },
};

const ReviewMain: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [events, setEvents] = useState<EventData[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<TrackData | null>(null);

  const { isAdmin } = useAuth(); // Hook personalizado para obter o status de admin
  const location = useLocation(); // Hook para acessar a rota atual
  // const toast = useToast(); // Exemplo de hook de notificação

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.events.readForSubmission();
      if (response.data.status === 'success') {
        setEvents(response.data.data);
      } else {
        // toast.error(response.data.message);
      }
    } catch (error) {
      // toast.error('Erro ao buscar eventos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Efeito para recarregar os eventos quando o usuário navega para a página
  useEffect(() => {
    if (location.pathname === '/home/reviews') {
      fetchEvents();
    }
  }, [location, fetchEvents]);

  const handleSelectTrack = (track: TrackData) => {
    setSelectedTrack(track);
  };

  const handleDownloadSubmissions = async () => {
    if (!selectedTrack) return;

    setDownloading(true);
    try {
      const response = await apiService.submissions.readReport(
        selectedTrack._id
      );
      // Recria a lógica de download do arquivo
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, `submissoes-${selectedTrack.name}.xlsx`);
    } catch (error) {
      // toast.error('Erro ao baixar o relatório.');
    } finally {
      setDownloading(false);
    }
  };
};
