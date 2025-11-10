import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './../hooks/useAuth'; // Exemplo de hook de autenticação

// --- Interfaces e Constantes ---
const SUBMISSION_LIFE_CYCLE = {
  PENDING_ADVISOR_REVIEW: 'PENDING_ADVISOR_REVIEW',
  PENDING_REVIEWER_APPROVAL: 'PENDING_REVIEWER_APPROVAL',
};

interface QuestionElement {
  _id: string;
  // ... outras propriedades
}

interface SubmissionData {
  title: string;
  abstract: string;
  authors: string;
  keywords: string;
  presentation: string;
  knowledge_area: any[];
  institution: string;
  advisor?: string;
  submissionFile?: string | null;
  advisorEmail?: string;
  supporting_source: string;
  supporting_institution_message?: string;
  acceptVirtualEventStatement?: boolean;
  category?: string;
  center?: string;
  extensive?: boolean;
  questions?: any;
}

// --- Funções de Serviço ---
const apiService = {
  submissions: {
    readById: (id: string) => axios.get(`/api/submissions/${id}`),
    readByUserId: (userId: string) =>
      axios.get(`/api/submissions/user/${userId}`),
    getSubmissionFile: (submission: any) =>
      axios.get(`/api/submissions/file/${submission._id}`),
    update: (submission: any) =>
      axios.put(`/api/submissions/${submission._id}`, submission),
    save: (submission: any) => axios.post('/api/submissions', submission),
    addComment: (id: string, content: any) =>
      axios.post(`/api/submissions/${id}/comment`, content),
    requestCorrection: (id: string, userId: string) =>
      axios.post(`/api/submissions/${id}/correction`, { userId }),
  },
  events: {
    readById: (id: string) => axios.get(`/api/events/${id}`),
  },
  tracks: {
    readById: (id: string) => axios.get(`/api/tracks/${id}`),
  },
  knowledgeArea: {
    readAll: () => axios.get('/api/knowledge-areas'),
  },
};

// --- Componente React ---
const SubmissionSave: React.FC = () => {
  const {
    id,
    track: trackParam,
    event: eventParam,
    edit_by_advisor,
  } = useParams();
  const { isAdmin, currentUser } = useAuth();
  const navigate = useNavigate();
  // const toast = useToast(); // Exemplo de hook de notificação

  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(!!id);
  const [submission, setSubmission] = useState<any>(null);
  const [track, setTrack] = useState<any>(
    trackParam ? JSON.parse(trackParam) : null
  );
  const [event, setEvent] = useState<any>(
    eventParam ? JSON.parse(eventParam) : null
  );
  const [questions, setQuestions] = useState<QuestionElement[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [words, setWords] = useState(0);
  const [fileExists, setFileExists] = useState(false);
  const [comment, setComment] = useState('');

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    trigger,
  } = useForm<SubmissionData>({ mode: 'onChange' });

  const abstractValue = watch('abstract');
  const knowledgeAreaValue = watch('knowledge_area');

  const countWords = (text: string) =>
    text ? text.replace(/<\/?[^>]+(>|$)/g, '').split(' ').length : 0;

  useEffect(() => {
    setWords(countWords(abstractValue || ''));
  }, [abstractValue]);

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      if (id) {
        setIsEdit(true);
        const subResponse = await apiService.submissions.readById(id);
        const subData = subResponse.data.data.submissions;
        setSubmission(subData);
        setFileExists(!!subData.file);

        const [eventResponse, trackResponse, areasResponse] = await Promise.all(
          [
            apiService.events.readById(subData.event),
            apiService.tracks.readById(subData.event_track),
            apiService.knowledgeArea.readAll(),
          ]
        );

        setEvent(eventResponse.data.data);
        setTrack(trackResponse.data.data);
        setAreas(areasResponse.data.data);

        // Preencher formulário
        setValue('title', subData.title);
        setValue('abstract', subData.abstract.trim());
        setValue('authors', subData.authors.toString());
        // ... preencher outros campos
      } else {
        // Lógica para nova submissão
        const areasResponse = await apiService.knowledgeArea.readAll();
        setAreas(areasResponse.data.data);
        if (track) {
          const questionsResponse = await apiService.tracks.readById(track._id);
          setQuestions(questionsResponse.data.data.questionsSubmission || []);
        }
      }
    } catch (err) {
      // toast.error('Erro ao carregar dados da submissão.');
    } finally {
      setLoading(false);
    }
  }, [id, track, setValue]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const onSubmit = async (formData: SubmissionData) => {
    setLoading(true);
    // Validações manuais que dependem de estado externo
    if (
      words < (event?.submissionMinWords || 0) ||
      words > (event?.submissionMaxWords || Infinity)
    ) {
      // toast.error('Número de palavras do resumo inválido.');
      setLoading(false);
      return;
    }

    const authorsArray = formData.authors.split(',').map((a) => a.trim());
    const keywordsArray = formData.keywords.split(',').map((k) => k.trim());

    const payload = {
      title: formData.title,
      abstract: formData.abstract,
      authors: authorsArray,
      keywords: keywordsArray,
      knowledge_area: formData.knowledge_area[0].item_text.split(' - ')[1],
      // ... outros campos do payload
      owner: currentUser._id,
      event_track: track?._id || submission?.event_track,
      event: track?.event || submission?.event,
    };

    try {
      let response;
      if (isEdit) {
        const updatePayload = { ...payload, _id: submission._id };
        if (edit_by_advisor || isAdmin) {
          updatePayload['status'] =
            SUBMISSION_LIFE_CYCLE.PENDING_REVIEWER_APPROVAL;
        } else {
          updatePayload['status'] =
            SUBMISSION_LIFE_CYCLE.PENDING_ADVISOR_REVIEW;
        }
        response = await apiService.submissions.update(updatePayload);
      } else {
        response = await apiService.submissions.save(payload);
      }

      if (response.data.status === 'success') {
        // toast.success('Submissão salva com sucesso!');
        navigate('/home/submissions'); // ou outra rota apropriada
      } else {
        // toast.error(response.data.message || 'Ocorreu um erro.');
      }
    } catch (err) {
      // toast.error('Erro ao salvar submissão.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10002597) {
      // toast.error('Arquivo muito grande (máx 10MB).');
      return;
    }
    if (file.type !== 'application/pdf') {
      // toast.error('Formato de arquivo inválido. Apenas PDF é permitido.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setValue('submissionFile', reader.result as string);
    };
    reader.readAsDataURL(file);
  };
};
