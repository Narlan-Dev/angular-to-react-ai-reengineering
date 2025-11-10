import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './../hooks/useAuth'; // Exemplo de hook de autenticação
import { useParams } from 'react-router-dom'; // Exemplo para obter parâmetros da rota

const QUESTION_MODEL = {
  SUBMISSION: 'SUBMISSION',
  REVIEWER: 'REVIEWER',
};

interface QuestionElement {
  _id: string;
  title: string;
  description: string;
  weight: number;
  type: string;
  model: string;
}

interface Track {
  _id: string;
  // outras propriedades do track
}

interface QuestionManagerProps {
  model?: string;
}

// Funções de serviço extraídas da lógica do componente
const questionService = {
  readByUserAndTrack: (query: {
    user_id: string;
    track_id: string | null;
    model: string;
  }) => {
    return axios.get('/api/questions', { params: query });
  },
  remove: (question: QuestionElement) => {
    return axios.delete(`/api/questions/${question._id}`);
  },
};

const QuestionManager: React.FC<QuestionManagerProps> = ({
  model = QUESTION_MODEL.SUBMISSION,
}) => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionElement[]>([]);
  const [filterText, setFilterText] = useState('');

  // Hooks para substituir dependências do Angular
  const { currentUser } = useAuth(); // Substitui AuthenticationService
  const { track: trackParam } = useParams<{ track: string }>(); // Substitui ActivatedRoute

  // Estado para controle de modais e notificações
  const [isSaveModalOpen, setSaveModalOpen] = useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] =
    useState<QuestionElement | null>(null);
  // const toast = useToast(); // Exemplo de hook de notificação (ex: react-toastify)

  const track: Track | null = trackParam ? JSON.parse(trackParam) : null;

  const fetchQuestions = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const query = {
        user_id: currentUser._id,
        track_id: track?._id ?? null,
        model: model,
      };
      const response = await questionService.readByUserAndTrack(query);
      if (response.data.status === 'success') {
        setQuestions(response.data.data);
      } else {
        setQuestions([]);
      }
    } catch (error) {
      // toast.error('Erro ao buscar perguntas');
    } finally {
      setLoading(false);
    }
  }, [currentUser, track, model]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleOpenSaveModal = (question?: QuestionElement) => {
    setSelectedQuestion(question || null);
    setSaveModalOpen(true);
  };

  const handleCloseSaveModal = () => {
    setSaveModalOpen(false);
    fetchQuestions();
  };

  const handleOpenConfirmModal = (question: QuestionElement) => {
    setSelectedQuestion(question);
    setConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedQuestion) return;
    setLoading(true);
    try {
      const response = await questionService.remove(selectedQuestion);
      if (response.data.status === 'success') {
        // toast.success(response.data.message);
        fetchQuestions();
      } else {
        // toast.error(response.data.message);
      }
    } catch (error) {
      // toast.error('Erro ao apagar pergunta');
    } finally {
      setLoading(false);
      setConfirmModalOpen(false);
      setSelectedQuestion(null);
    }
  };

  const filteredQuestions = questions.filter((q) =>
    q.title.toLowerCase().includes(filterText.toLowerCase())
  );
};
