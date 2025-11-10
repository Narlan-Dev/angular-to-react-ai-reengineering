import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { saveAs } from 'file-saver';

// Sugestão de dependências:
// npm install axios react-router-dom file-saver react-toastify
// ou
// yarn add axios react-router-dom file-saver react-toastify

interface SubmissionElement {
  _id: string;
  title: string;
  knowledge_area: string;
  authors: string[];
  reviewers: any[];
  owner: any;
  event: any;
}

interface Track {
  _id: string;
  name: string;
}

// Funções de serviço para chamadas de API
const submissionService = {
  readByStatusTrack: (track: Track, status: boolean) =>
    axios.get(`/api/submissions/status-track`, {
      params: { trackId: track._id, status },
    }),
  readReportSubmissionsByApprovalStatus: (trackId: string, status: boolean) =>
    axios.get(`/api/submissions/report-by-status`, {
      params: { trackId, status },
      responseType: 'blob',
    }),
  reportSubmissionStatusByEmail: (submissions: any[], status: boolean) =>
    axios.post('/api/submissions/report-by-email', { submissions, status }),
};

const ReviewStatus: React.FC = () => {
  const { statusReview: statusParam, track: trackParam } = useParams<{
    statusReview: string;
    track: string;
  }>();
  const location = useLocation();
  // const toast = useToast(); // Exemplo de hook de notificação

  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [submissions, setSubmissions] = useState<SubmissionElement[]>([]);
  const [filterText, setFilterText] = useState('');
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<SubmissionElement | null>(null);

  const statusReview = statusParam ? JSON.parse(statusParam) : false;
  const track: Track | null = trackParam ? JSON.parse(trackParam) : null;

  const fetchSubmissions = useCallback(async () => {
    if (!track) return;
    setLoading(true);
    try {
      const response = await submissionService.readByStatusTrack(
        track,
        statusReview
      );
      setSubmissions(response.data.data || []);
    } catch (error) {
      // toast.error('Erro ao buscar submissões.');
    } finally {
      setLoading(false);
    }
  }, [track, statusReview]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  useEffect(() => {
    // Recarrega os dados se a rota for acessada novamente
    if (location.pathname.includes('/review-status')) {
      fetchSubmissions();
    }
  }, [location, fetchSubmissions]);

  const handleOpenDetails = (submission: SubmissionElement) => {
    setSelectedSubmission(submission);
    setDetailsModalOpen(true);
  };

  const handleDownloadReport = async () => {
    if (!track) return;
    setDownloading(true);
    try {
      const response =
        await submissionService.readReportSubmissionsByApprovalStatus(
          track._id,
          statusReview
        );
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(
        blob,
        `submissoes-${statusReview ? 'aprovadas' : 'reprovadas'}.xlsx`
      );
    } catch (error) {
      // toast.error('Erro ao baixar o relatório.');
    } finally {
      setDownloading(false);
    }
  };

  const handleSendEmails = async () => {
    setConfirmModalOpen(false); // Fecha o modal de confirmação
    const emailPayload = submissions.map((sub) => ({
      owner: sub.owner,
      submissionId: sub._id,
      event: sub.event,
    }));

    try {
      await submissionService.reportSubmissionStatusByEmail(
        emailPayload,
        statusReview
      );
      // toast.success('E-mails enviados com sucesso!');
    } catch (error) {
      // toast.error('Erro ao enviar os e-mails.');
    }
  };

  const filteredSubmissions = submissions.filter((sub) =>
    Object.values(sub).some((val) =>
      String(val).toLowerCase().includes(filterText.toLowerCase())
    )
  );
};
