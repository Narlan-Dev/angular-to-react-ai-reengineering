import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './../hooks/useAuth'; // Exemplo de hook de autenticação
import { saveAs } from 'file-saver'; // Para a funcionalidade de download

// Sugestão de dependências:
// npm install axios react-hook-form react-router-dom react-toastify file-saver
// ou
// yarn add axios react-hook-form react-router-dom react-toastify file-saver

// --- Interfaces ---
interface QuestionElement {
  _id: string;
  // ... outras propriedades
}

interface ReviewFormData {
  feedback: string;
  status: boolean;
  answerForQuestionTrack: boolean;
  answerForSecondQuestionTrack: boolean;
  questions: any; // A ser gerenciado pelo componente filho QuestionMain
}

// --- Funções de Serviço ---
const apiService = {
  submissions: {
    readById: (id: string) => axios.get(`/api/submissions/${id}`),
    getSubmissionFile: (submission: any) =>
      axios.get(`/api/submissions/file/${submission._id}`, {
        responseType: 'blob',
      }),
  },
  tracks: {
    readById: (id: string) => axios.get(`/api/tracks/${id}`),
  },
  reviews: {
    sendReview: (submissionId: string, reviewData: any) =>
      axios.post(`/api/reviews/send/${submissionId}`, reviewData),
  },
};

// --- Componente React ---
const ReviewSave: React.FC = () => {
  const { submission: submissionParam } = useParams<{ submission: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  // const toast = useToast(); // Exemplo de hook de notificação

  const [loading, setLoading] = useState(true);
  const [submissionReview, setSubmissionReview] = useState<any>(null);
  const [track, setTrack] = useState<any>(null);
  const [questions, setQuestions] = useState<QuestionElement[]>([]);
  const [isQuestionsFormValid, setQuestionsFormValidity] = useState(true);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReviewFormData>({
    defaultValues: {
      feedback: '',
      status: true,
      answerForQuestionTrack: false,
      answerForSecondQuestionTrack: false,
      questions: null,
    },
  });

  const analyzeAndSetReviewData = useCallback(
    (reviewData: any) => {
      const userReview = reviewData?.appraisals?.find(
        (appraisal: any) => appraisal.reviewer_id === currentUser._id
      );

      if (userReview) {
        const { result } = userReview;
        setValue('feedback', result.feedback);
        setValue('status', result.approved);
        setValue('answerForQuestionTrack', result.answerForQuestionTrack);

        if (result.additionalQuestionsAnswers?.answers?.length > 0) {
          const formattedAnswers =
            result.additionalQuestionsAnswers.answers.map((data: any) => ({
              question_id: data.question._id,
              [data.question._id]: data.answer,
            }));
          setValue('questions', { questions: formattedAnswers });
        }
      }
    },
    [currentUser, setValue]
  );

  useEffect(() => {
    if (!submissionParam) return;

    const parsedSubmission = JSON.parse(submissionParam);
    setSubmissionReview(parsedSubmission);

    const fetchData = async () => {
      setLoading(true);
      try {
        const subResponse = await apiService.submissions.readById(
          parsedSubmission.submission._id
        );
        const fullSubmission = subResponse.data.data.submissions;

        const trackResponse = await apiService.tracks.readById(
          fullSubmission.event_track
        );
        const trackData = trackResponse.data.data;

        setTrack(trackData);
        setQuestions(trackData.questionsReviewers || []);

        // Atualiza o submissionReview com os dados mais recentes
        setSubmissionReview((prev: any) => ({
          ...prev,
          submission: { ...prev.submission, abstract: fullSubmission.abstract },
        }));

        if (parsedSubmission.review_realized_user) {
          analyzeAndSetReviewData(parsedSubmission.review_realized_user);
        }
      } catch (error) {
        // toast.error('Erro ao carregar dados da revisão.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [submissionParam, analyzeAndSetReviewData]);

  const handleDownloadFile = async (submission: any) => {
    try {
      const response = await apiService.submissions.getSubmissionFile(
        submission
      );
      const blob = new Blob([response.data], { type: 'application/pdf' });
      saveAs(blob, `${submission._id}.pdf`);
    } catch (e) {
      // toast.error('Ocorreu um erro ao baixar o arquivo.');
    }
  };

  const onSubmit = async (formData: ReviewFormData) => {
    if (!isQuestionsFormValid) {
      // toast.error('Por favor, preencha todas as questões obrigatórias.');
      return;
    }
    setLoading(true);

    const questionAnswers = {
      answers: (formData.questions?.questions || []).map((q: any) => ({
        question: q.question_id,
        answer: q[q.question_id],
      })),
      total: formData.questions?.total || 0,
    };

    const resultReview = {
      reviewer_id: currentUser._id,
      reviewer_name: currentUser.name,
      result: {
        feedback: formData.feedback,
        approved: formData.status,
        answerForQuestionTrack: formData.answerForQuestionTrack,
        answerForSecondQuestionTrack: formData.answerForSecondQuestionTrack,
        additionalQuestionsAnswers: questionAnswers,
      },
    };

    try {
      const response = await apiService.reviews.sendReview(
        submissionReview.submission._id,
        resultReview
      );
      if (response.data.status === 'success') {
        // toast.success('Revisão realizada com sucesso.');
        navigate('/home/reviews');
      } else {
        // toast.error(response.data.message || 'Erro ao enviar revisão.');
      }
    } catch (error) {
      // toast.error('Erro ao enviar revisão.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/home/reviews');
  };
};
