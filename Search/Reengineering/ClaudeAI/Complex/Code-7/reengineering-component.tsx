import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Paper,
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Autocomplete,
  Chip,
} from '@mui/material';
import { CloudUpload, Download } from '@mui/icons-material';
import { KnowledgeAreaService } from 'src/app/_services/knowledge-area.service';
import { UserExceptionService } from 'src/app/_services/user-exception.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { SubmissionService } from 'src/app/_services/submission.service';
import { EventService } from 'src/app/_services/event.service';
import { TrackService } from 'src/app/_services/track.service';
import { QuestionService } from 'src/app/_services/question.service';
import { ValidateBrService } from 'angular-validate-br';
import PresentationConstants from 'src/app/_constants/presentation.constants';
import { SUBMISSION_LIFE_CYCLE } from 'src/app/_constants/submissionCycle.constants';
import { SubmissionElement } from 'src/app/_models/submissions';
import { QuestionElement } from 'src/app/_models/question';
import QuestionMain from 'src/app/question/question-main/question-main.component';

interface SubmissionSaveProps {
  authenticationService: AuthenticationService;
  submissionService: SubmissionService;
  eventService: EventService;
  trackService: TrackService;
  areaService: KnowledgeAreaService;
  userExceptionService: UserExceptionService;
  questionService: QuestionService;
  validateBrService: ValidateBrService;
}

const SubmissionSave: React.FC<SubmissionSaveProps> = ({
  authenticationService,
  submissionService,
  eventService,
  trackService,
  areaService,
  userExceptionService,
  questionService,
  validateBrService,
}) => {
  const [questions, setQuestions] = useState<QuestionElement[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionElement[]>([]);
  const [tabIndex, setTabIndex] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fullTrackFormat, setFullTrackFormat] = useState(false);
  const [fileExists, setFileExists] = useState(false);
  const [badFormat, setBadFormat] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [words, setWords] = useState(0);
  const [areas, setAreas] = useState<any[]>([]);
  const [selectedKnowledgeArea, setSelectedKnowledgeArea] = useState<any>(null);
  const [requestEmail, setRequestEmail] = useState(false);
  const [requestAdvisorCpf, setRequestAdvisorCpf] = useState(false);
  const [editByAdvisor, setEditByAdvisor] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [track, setTrack] = useState<any>(null);
  const [event, setEvent] = useState<any>(null);
  const [submission, setSubmission] = useState<any>(null);
  const [virtualEventStatement, setVirtualEventStatement] = useState('');
  const [comment, setComment] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    authors: '',
    keywords: '',
    presentation: '',
    knowledge_area: null,
    institution: '',
    advisor: '',
    submissionFile: null,
    advisorEmail: '',
    supporting_source: '',
    supporting_institution_message: '',
    acceptVirtualEventStatement: false,
    additionalQuestionAnswer: false,
    category: '',
    submission_with_file: false,
    center: '',
    extensive: false,
    questions: null,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
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
  const params = useParams();
  const questionsFormRef = useRef<any>(null);

  const presentationTypes = PresentationConstants.PRESENTATION_TYPES;
  const supportingSources = [
    'CNPq',
    'FAPESB',
    'PROEXT',
    'PET/UFRB',
    'CAPES',
    'UFRB',
    'Outros editais',
    'Outras instituições',
    'Sem financiamento',
  ];
  const centers = [
    'CAHL',
    'CETENS',
    'CCAAB',
    'CCS',
    'CETEC',
    'CECULT',
    'CFP',
    'Outros setores',
  ];

  useEffect(() => {
    authenticationService.isAdminGlobal().then(setIsAdmin);
    fetchSubmissions();
    initializeForm();
  }, []);

  const initializeForm = () => {
    const trackParam = params.track;
    const eventParam = params.event;
    const editByAdvisorParam = params.edit_by_advisor;
    const submissionId = params.id;

    if (trackParam && eventParam) {
      const trackData = JSON.parse(trackParam);
      const eventData = JSON.parse(eventParam);
      setTrack(trackData);
      setEvent(eventData);
      setEditByAdvisor(Boolean(editByAdvisorParam));

      if (trackData.format === 'full') {
        setFullTrackFormat(true);
      }

      if (eventData.virtual && !editByAdvisor) {
        setVirtualEventStatement(
          `Declaro, para todos os fins de direito, que estou ciente que durante as atividades do evento ${eventData.short_name}, poderão ser captadas imagens e vozes da minha participação...`
        );
      }

      setFormData((prev) => ({
        ...prev,
        presentation: PresentationConstants.UNDEFINED_PRESENTATION,
        extensive: eventData.extensive,
      }));

      fetchQuestions(trackData._id);
      fetchDataLists();
    } else if (submissionId) {
      setIsEdit(true);
      loadSubmissionForEdit(submissionId);
    }
  };

  const fetchDataLists = async () => {
    try {
      const result = await areaService.readAll();
      if (result.status === 'success') {
        setAreas(result.data);
      }

      const userExceptionResult = await userExceptionService.readByType(
        'fapesb_oral_presentations'
      );
      if (userExceptionResult.status === 'success') {
        const userCpf = authenticationService.currentUserValue.cpf;
        const hasException = userExceptionResult.data.some(
          (item: any) => item.cpf === userCpf
        );
        if (hasException) {
          setFormData((prev) => ({
            ...prev,
            presentation: PresentationConstants.ORAL_PRESENTATION,
          }));
        }
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro ao buscar dados',
        severity: 'error',
      });
    }
  };

  const fetchSubmissions = async () => {
    if (!isAdmin) {
      try {
        const result = await submissionService.readByUserId(
          authenticationService.userId
        );
        if (result.status === 'success') {
          setSubmissions(result.data);
          setTabIndex(0);
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Erro ao buscar submissões',
          severity: 'error',
        });
      }
    }
  };

  const fetchQuestions = async (trackId: string) => {
    try {
      const response = await trackService.readById(trackId);
      if (response.status === 'success') {
        const trackData = response.data;
        if (trackData.questionsSubmission.length > 0) {
          setQuestions(trackData.questionsSubmission);
        }
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro ao buscar perguntas',
        severity: 'error',
      });
    }
  };

  const loadSubmissionForEdit = async (submissionId: string) => {
    setLoading(true);
    try {
      const result = await submissionService.readById(submissionId);
      if (result.status === 'success') {
        const submissionData = result.data.submissions;
        setSubmission(submissionData);

        if (submissionData.file) {
          setFullTrackFormat(true);
          setFileExists(true);
        }

        if (submissionData.additionalQuestionsAnswers?.length > 0) {
          setQuestions(
            submissionData.additionalQuestionsAnswers.map(
              (data: any) => data.question
            )
          );
          const formattedAnswers =
            submissionData.additionalQuestionsAnswers.map((data: any) => ({
              question_id: data.question._id,
              [data.question._id]: data.answer,
            }));
          setFormData((prev) => ({
            ...prev,
            questions: { questions: formattedAnswers },
          }));
        }

        setFormData((prev) => ({
          ...prev,
          title: submissionData.title,
          abstract: submissionData.abstract?.trim() || '',
          submissionFile: submissionData.file,
          authors: submissionData.authors?.toString() || '',
          keywords: submissionData.keywords?.toString() || '',
          presentation: submissionData.presentation,
          center: submissionData.center,
          institution: submissionData.institution,
          supporting_source: submissionData.supporting_source,
          supporting_institution_message:
            submissionData.supporting_institution_message,
          advisor: submissionData.advisor,
          additionalQuestionAnswer: submissionData.additionalQuestionAnswer,
          extensive: true,
          category: submissionData.category,
        }));

        wordCounter(submissionData.abstract);
        await loadEventAndTrack(
          submissionData.event,
          submissionData.event_track
        );
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro ao carregar submissão',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadEventAndTrack = async (eventId: string, trackId: string) => {
    try {
      const eventResult = await eventService.readById(eventId);
      if (eventResult.status === 'success') {
        setEvent(eventResult.data);

        const trackResult = await trackService.readById(trackId);
        if (trackResult.status === 'success') {
          setTrack(trackResult.data);
        }
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro ao carregar evento e track',
        severity: 'error',
      });
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === 'abstract') {
      wordCounter(value);
    }

    // Validações em tempo real
    validateField(field, value);
  };

  const validateField = (field: string, value: any) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'title':
        if (!value) {
          newErrors.title = 'Título é obrigatório';
        } else if (
          submissions.some(
            (sub) =>
              sub.title === value && (!isEdit || sub._id !== submission?._id)
          )
        ) {
          newErrors.title = 'Você já submeteu este trabalho';
        } else {
          delete newErrors.title;
        }
        break;
      case 'abstract':
        if (!value && !fullTrackFormat) {
          newErrors.abstract = 'Resumo é obrigatório';
        } else if (event) {
          const wordCount = countWords(value);
          if (!fullTrackFormat && wordCount < event.submissionMinWords) {
            newErrors.abstract = `O resumo deve conter um mínimo de ${event.submissionMinWords} palavras`;
          } else if (!fullTrackFormat && wordCount > event.submissionMaxWords) {
            newErrors.abstract = `O resumo deve conter um máximo de ${event.submissionMaxWords} palavras`;
          } else {
            delete newErrors.abstract;
          }
        }
        break;
      case 'authors':
        if (!value) {
          newErrors.authors = 'Autores são obrigatórios';
        } else if (value.includes('.')) {
          newErrors.authors = 'Os nomes dos autores não podem conter pontos';
        } else {
          delete newErrors.authors;
        }
        break;
    }

    setErrors(newErrors);
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10002597) {
        setSnackbar({
          open: true,
          message: 'O tamanho do arquivo deve ser menor que 10MB',
          severity: 'error',
        });
        setBadFormat(true);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const dataFile = String(reader.result);
        const fileData = dataFile.split(';base64,');

        if (!fileData[0] || fileData[0] !== 'data:application/pdf') {
          setSnackbar({
            open: true,
            message: 'Só são aceitos arquivos em formato PDF',
            severity: 'error',
          });
          setBadFormat(true);
        } else {
          setBadFormat(false);
          setFormData((prev) => ({ ...prev, submissionFile: dataFile }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const changeSubmissionFile = () => {
    setFileExists(false);
    setFormData((prev) => ({ ...prev, submissionFile: null }));
  };

  const downloadSubmissionFile = async (submissionData: any) => {
    try {
      const response = await submissionService.getSubmissionFile(
        submissionData
      );
      // downloadPdfFile(response, submissionData._id);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro ao baixar arquivo',
        severity: 'error',
      });
    }
  };

  const wordCounter = (text: string) => {
    setWords(countWords(text));
  };

  const countWords = (text: string) => {
    return text ? text.replace(/<\/?[^>]+(>|$)/g, '').split(' ').length : 0;
  };

  const formattedAddictionQuestionAnswer = (content: Array<any>) => {
    return content.map((response) => ({
      question: response.question_id,
      answer: response[response.question_id],
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title) newErrors.title = 'Título é obrigatório';
    if (!formData.abstract && !fullTrackFormat)
      newErrors.abstract = 'Resumo é obrigatório';
    if (!formData.authors) newErrors.authors = 'Autores são obrigatórios';
    if (!formData.keywords)
      newErrors.keywords = 'Palavras-chave são obrigatórias';
    if (!formData.presentation)
      newErrors.presentation = 'Tipo de apresentação é obrigatório';
    if (!formData.knowledge_area)
      newErrors.knowledge_area = 'Área de conhecimento é obrigatória';
    if (!formData.institution)
      newErrors.institution = 'Instituição é obrigatória';
    if (!formData.supporting_source)
      newErrors.supporting_source = 'Fonte de financiamento é obrigatória';

    if (fullTrackFormat && !formData.submissionFile) {
      newErrors.submissionFile = 'Arquivo é obrigatório';
    }

    if (track?.advisorReviewRequired && !formData.advisor) {
      newErrors.advisor = 'CPF do orientador é obrigatório';
    }

    if (virtualEventStatement && !formData.acceptVirtualEventStatement) {
      newErrors.acceptVirtualEventStatement =
        'Aceite da declaração é obrigatório';
    }

    if (track?.submissionCategory && !formData.category) {
      newErrors.category = 'Categoria é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    setSubmitted(true);

    if (!validateForm() || questionsFormRef.current?.isInvalid()) {
      return;
    }

    const questionsComponent = formData.questions;
    const questionAnswers = formattedAddictionQuestionAnswer(
      questionsComponent?.questions || []
    );

    const dateNow = new Date();
    dateNow.setHours(0, 0, 0, 0);

    if (editByAdvisor && track?.advisor_review_end_date) {
      if (dateNow > new Date(track.advisor_review_end_date)) {
        setSnackbar({
          open: true,
          message: 'O prazo para atualização da submissão não é mais válido',
          severity: 'error',
        });
        return;
      }
    }

    setLoading(true);

    const autores = formData.authors.split(',').map((autor) => autor.trim());
    const palavras_chaves = formData.keywords
      .split(',')
      .map((palavra) => palavra.trim());

    const submissionData = {
      title: formData.title,
      abstract: formData.abstract,
      authors: autores,
      keywords: palavras_chaves,
      presentation: formData.presentation,
      knowledge_area:
        formData.knowledge_area?.sub_area || formData.knowledge_area,
      institution: formData.institution,
      file: formData.submissionFile,
      supporting_source: formData.supporting_source,
      supporting_institution_message: formData.supporting_institution_message,
      owner: authenticationService.currentUserValue._id,
      event_track: track ? track._id : submission.event_track,
      event_track_name: track ? track.name : submission.event_track_name,
      event: track ? track.event : submission.event,
      event_short_name: track
        ? track.event_short_name
        : submission.event_short_name,
      advisor: formData.advisor.replace(/\D/g, ''),
      advisorEmail: formData.advisorEmail,
      additionalQuestionAnswer: formData.additionalQuestionAnswer,
      category: formData.category || null,
      center: formData.center,
      additionalQuestionsAnswers: questionAnswers,
    };

    try {
      let result;
      if (isEdit) {
        const updateData = {
          ...submissionData,
          _id: submission._id,
          approved: submission.approved,
          approval_date: submission.approval_date,
          owner: submission.owner,
          created_at: submission.created_at,
          center: submission.center,
          status:
            editByAdvisor || isAdmin
              ? SUBMISSION_LIFE_CYCLE.PENDING_REVIEWER_APPROVAL
              : SUBMISSION_LIFE_CYCLE.PENDING_ADVISOR_REVIEW,
          advisorState:
            editByAdvisor || isAdmin ? 'advisor_feedback_approved' : undefined,
        };
        result = await submissionService.update(updateData);
      } else {
        result = await submissionService.save(submissionData);
      }

      if (result.status === 'success') {
        const message = track?.advisorReviewRequired
          ? isEdit
            ? 'Submissão atualizada com sucesso.'
            : 'Submissão realizada com sucesso. Enviamos um e-mail ao seu orientador.'
          : isEdit
          ? 'Submissão atualizada com sucesso.'
          : 'Submissão realizada com sucesso.';

        setSnackbar({ open: true, message, severity: 'success' });

        if (editByAdvisor) {
          navigate('/home/advisor');
        } else {
          navigate('/home/submissions');
        }
      } else if (result.status === 'advisor_not_found') {
        setRequestEmail(true);
        setSnackbar({
          open: true,
          message: result.message,
          severity: 'warning',
        });
      } else {
        setSnackbar({ open: true, message: result.message, severity: 'error' });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro ao salvar submissão',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return null;
};

export default SubmissionSave;
