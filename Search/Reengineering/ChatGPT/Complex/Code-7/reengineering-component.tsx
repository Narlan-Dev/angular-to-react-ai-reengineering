import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SubmissionElement } from 'src/app/_models/submissions';
import { QuestionElement } from 'src/app/_models/question';
import { SUBMISSION_LIFE_CYCLE } from 'src/app/_constants/submissionCycle.constants';
import PresentationConstants from 'src/app/_constants/presentation.constants';
import { Snackbar, Alert, CircularProgress } from '@mui/material';

// Comentário: Substituí ToastrService por Snackbar do MUI

interface SelectOption {
  value: number;
  label: string;
}

interface Props {
  authenticationService: any;
  submissionService: any;
  eventService: any;
  trackService: any;
  areaService: any;
  userExceptionService: any;
  validateBrService: any;
  questionService: any;
}

const SubmissionSave: React.FC<Props> = ({
  authenticationService,
  submissionService,
  eventService,
  trackService,
  areaService,
  userExceptionService,
  validateBrService,
  questionService,
}) => {
  // Estado do formulário
  const [dropdownList, setDropdownList] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [questions, setQuestions] = useState<QuestionElement[]>([]);
  const [submissionForm, setSubmissionForm] = useState<any>({
    title: '',
    abstract: '',
    authors: '',
    keywords: '',
    presentation: '',
    knowledge_area: '',
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
  const [presentationTypes, setPresentationTypes] = useState(
    PresentationConstants.PRESENTATION_TYPES
  );
  const [areas, setAreas] = useState<any[]>([]);
  const [supportingSources] = useState([
    'CNPq',
    'FAPESB',
    'PROEXT',
    'PET/UFRB',
    'CAPES',
    'UFRB',
    'Outros editais',
    'Outras instituições',
    'Sem financiamento',
  ]);
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
  const [centers] = useState([
    'CAHL',
    'CETENS',
    'CCAAB',
    'CCS',
    'CETEC',
    'CECULT',
    'CFP',
    'Outros setores',
  ]);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning';
  }>({ open: false, message: '', severity: 'success' });

  // Simula ActivatedRoute
  const params = useParams();
  const navigate = useNavigate();

  // Inicialização
  useEffect(() => {
    authenticationService.isAdminGlobal().then(setIsAdmin);
    setEditByAdvisor(Boolean(params.edit_by_advisor));
    setLoading(true);

    // Busca submissões do usuário
    submissionService
      .readByUserId(authenticationService.userId)
      .then((result: any) => {
        setLoading(false);
        if (result.status === 'success') {
          setSubmissions(result.data);
          setTabIndex(0);
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

    // Busca dados de track/event
    const t = params.track;
    const e = params.event;
    if (t) {
      const trackObj = JSON.parse(t);
      setTrack(trackObj);
      if (trackObj.format === 'full') {
        setFullTrackFormat(true);
      }
      if (trackObj.advisorReviewRequired) {
        // Adicione validação de CPF se necessário
      }
      const eventObj = JSON.parse(e);
      setEvent(eventObj);
      setPresentationTypes([PresentationConstants.UNDEFINED_PRESENTATION]);
      setSubmissionForm((prev: any) => ({
        ...prev,
        presentation: PresentationConstants.UNDEFINED_PRESENTATION,
        extensive: eventObj.extensive,
      }));
      if (eventObj.virtual && !editByAdvisor) {
        setVirtualEventStatement(
          'Declaro, para todos os fins de direito, que estou ciente que durante as atividades do evento ' +
            eventObj.short_name +
            ', poderão ser captadas imagens e vozes da minha participação ou daqueles que represento como responsável legal. Autorizo a captação e utilização de tais imagens e vozes da minha pessoa ou daqueles que represento pela UNIVERSIDADE FEDERAL DO RECÔNCAVO DA BAHIA (UFRB) desde que tais dados sejam utilizados para fins acadêmicos ou de divulgação científica no contexto dos canais de comunicação, plataformas de disponibilização de vídeos e redes sociais da UFRB, nos termos da Lei nº 13.709/2018 (LGPD – Lei Geral de Proteção de Dados), conforme as finalidades previstas acima, nos termos do artigo 7º, inciso I, da referida norma.'
        );
      }
      // Busca perguntas
      trackService
        .readById(trackObj._id)
        .then((response: any) => {
          if (response.status === 'success') {
            const trackData = response.data;
            if (trackData.questionsSubmission.length > 0) {
              setQuestions(trackData.questionsSubmission);
              setSubmissionForm((prev: any) => ({
                ...prev,
                questions: trackData.questionsSubmission,
              }));
            }
          } else {
            setSnackbar({
              open: true,
              message: response.message,
              severity: 'error',
            });
          }
        })
        .catch((error: any) => {
          setSnackbar({ open: true, message: error, severity: 'error' });
        });
      // Busca áreas de conhecimento
      areaService
        .readAll()
        .then((result: any) => {
          if (result.status === 'success') {
            setAreas(result.data);
            const tmp = result.data.map((area: any, i: number) => ({
              item_id: i,
              item_text: area.area + ' - ' + area.sub_area,
            }));
            setDropdownList(tmp);
          } else {
            setSnackbar({
              open: true,
              message: result.message,
              severity: 'error',
            });
          }
        })
        .catch((error: any) => {
          setSnackbar({ open: true, message: error, severity: 'error' });
        });
      // Busca exceções de usuário
      userExceptionService
        .readByType('fapesb_oral_presentations')
        .then((result: any) => {
          if (result.status === 'success') {
            const index = result.data.findIndex(
              (item: any) =>
                item.cpf === authenticationService.currentUserValue.cpf
            );
            if (index > 0) {
              setPresentationTypes([PresentationConstants.ORAL_PRESENTATION]);
              setSubmissionForm((prev: any) => ({
                ...prev,
                presentation: PresentationConstants.ORAL_PRESENTATION,
              }));
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
          setSnackbar({ open: true, message: error, severity: 'error' });
        });
    } else if (params.id) {
      setIsEdit(true);
      setLoading(true);
      submissionService
        .readById(params.id)
        .then((result: any) => {
          setLoading(false);
          if (result.status === 'success') {
            const sub = result.data.submissions;
            setSubmission(sub);
            // Preenche o formulário com os dados da submissão
            setSubmissionForm({
              ...submissionForm,
              title: sub.title,
              abstract: sub.abstract.trim(),
              submissionFile: sub.file,
              authors: sub.authors.toString(),
              keywords: sub.keywords.toString(),
              presentation: sub.presentation,
              center: sub.center,
              institution: sub.institution,
              supporting_source: sub.supporting_source,
              supporting_institution_message:
                sub.supporting_institution_message,
              advisor: sub.advisor,
              additionalQuestionAnswer: sub.additionalQuestionAnswer,
              extensive: true,
              category: sub.category,
            });
            setFileExists(!!sub.file);
            setFullTrackFormat(!!sub.file);
            setWords(countWords(sub.abstract));
            // Busca evento e track
            eventService
              .readById(sub.event)
              .then((eventResult: any) => {
                if (eventResult.status === 'success') {
                  setEvent(eventResult.data);
                  trackService
                    .readById(sub.event_track)
                    .then((eventTrack: any) => {
                      if (eventTrack.status === 'success') {
                        setTrack(eventTrack.data);
                      } else {
                        setSnackbar({
                          open: true,
                          message: eventTrack.message,
                          severity: 'error',
                        });
                      }
                    })
                    .catch((error: any) => {
                      setSnackbar({
                        open: true,
                        message: error,
                        severity: 'error',
                      });
                    });
                } else {
                  setSnackbar({
                    open: true,
                    message: eventResult.message,
                    severity: 'error',
                  });
                }
              })
              .catch((error: any) => {
                setSnackbar({ open: true, message: error, severity: 'error' });
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
    }
    // eslint-disable-next-line
  }, []);

  // Manipulação de arquivo de submissão
  const onSubmissionFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      let badFileSize = false;
      setBadFormat(false);

      if (file.size > 10002597) {
        setSnackbar({
          open: true,
          message: 'O tamanho do arquivo da submissão deve ser menor que 10MB.',
          severity: 'error',
        });
        setBadFormat(true);
        badFileSize = true;
      }
      reader.readAsDataURL(file);
      reader.onload = () => {
        const dataFile = String(reader.result);
        const fileData = dataFile.split(';base64,');
        if (
          !fileData[0] ||
          (!(fileData[0] === 'data:application/pdf') && !badFileSize)
        ) {
          setSnackbar({
            open: true,
            message:
              'O formato do arquivo informado é inválido. Só são aceitos arquivos em formato PDF para submissão.',
            severity: 'error',
          });
          setBadFormat(true);
        } else if (!badFormat && !badFileSize) {
          setSubmissionForm((prev: any) => ({
            ...prev,
            submissionFile: dataFile,
          }));
        }
      };
    }
  };

  // Contador de palavras
  const wordCounter = () => {
    setWords(countWords(submissionForm.abstract));
  };

  // Função utilitária para contar palavras
  function countWords(text: string) {
    return text ? text.replace(/<\/?[^>]+(>|$)/g, '').split(' ').length : 0;
  }

  // Formatação das respostas das perguntas adicionais
  const formattedAddictionQuestionAnswer = (content: Array<any>) => {
    return content.map((response) => ({
      question: response.question_id,
      answer: response[response.question_id],
    }));
  };

  // Submissão do formulário
  const onSubmit = async () => {
    setSubmitted(true);

    // Validação básica (substitua por validação robusta conforme necessário)
    if (
      !submissionForm.title ||
      !submissionForm.abstract ||
      !submissionForm.authors ||
      !submissionForm.keywords ||
      !submissionForm.presentation ||
      !submissionForm.knowledge_area ||
      !submissionForm.institution ||
      (fullTrackFormat && !submissionForm.submissionFile) ||
      badFormat
    ) {
      setSnackbar({
        open: true,
        message: 'Preencha todos os campos obrigatórios.',
        severity: 'error',
      });
      return;
    }

    // Validação de prazo para advisor
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

    const autores = submissionForm.authors
      .split(',')
      .map((a: string) => a.trim());
    const palavras_chaves = submissionForm.keywords
      .split(',')
      .map((k: string) => k.trim());

    const submissionPayload: any = {
      title: submissionForm.title,
      abstract: submissionForm.abstract,
      authors: autores,
      keywords: palavras_chaves,
      presentation: submissionForm.presentation,
      knowledge_area: selectedItems[0]?.item_text?.split(' - ')[1] || '',
      institution: submissionForm.institution,
      file: submissionForm.submissionFile,
      supporting_source: submissionForm.supporting_source,
      supporting_institution_message:
        submissionForm.supporting_institution_message,
      owner: authenticationService.currentUserValue._id,
      event_track: track ? track._id : submission?.event_track,
      event_track_name: track ? track.name : submission?.event_track_name,
      event: track ? track.event : submission?.event,
      event_short_name: track
        ? track.event_short_name
        : submission?.event_short_name,
      advisor: submissionForm.advisor.replace(/\D/g, ''),
      advisorEmail: submissionForm.advisorEmail,
      additionalQuestionAnswer: submissionForm.additionalQuestionAnswer,
      category: submissionForm.category || null,
      center: submissionForm.center,
      additionalQuestionsAnswers: formattedAddictionQuestionAnswer(
        submissionForm.questions?.questions || []
      ),
    };

    if (isEdit) {
      submissionPayload['_id'] = submission._id;
      submissionPayload['approved'] = submission.approved;
      submissionPayload['approval_date'] = submission.approval_date;
      submissionPayload['owner'] = submission.owner;
      submissionPayload['created_at'] = submission.created_at;
      submissionPayload['center'] = submission.center;
      if (editByAdvisor || isAdmin) {
        submissionPayload['status'] =
          SUBMISSION_LIFE_CYCLE.PENDING_REVIEWER_APPROVAL;
        submissionPayload['advisorState'] = 'advisor_feedback_approved';
      } else {
        submissionPayload['status'] =
          SUBMISSION_LIFE_CYCLE.PENDING_ADVISOR_REVIEW;
      }

      try {
        const data = await submissionService.update(submissionPayload);
        setLoading(false);
        if (data.status === 'success') {
          if (editByAdvisor) {
            navigate('/home', { state: { content: 'advisor' } });
            setSnackbar({
              open: true,
              message: 'Submissão atualizada com sucesso!',
              severity: 'success',
            });
          } else {
            if (comment) {
              addSubmissionComment();
            }
            navigate('/home', { state: { content: 'submissions' } });
            setSnackbar({
              open: true,
              message: 'Submissão atualizada com sucesso.',
              severity: 'success',
            });
          }
        } else if (data.status === 'advisor_not_found' && !editByAdvisor) {
          setRequestEmail(true);
          setSnackbar({
            open: true,
            message: data.message,
            severity: 'warning',
          });
        } else if (data.status === 'advisor_not_found' && editByAdvisor) {
          setRequestAdvisorCpf(true);
          setSnackbar({
            open: true,
            message: data.message,
            severity: 'warning',
          });
        }
      } catch (error: any) {
        setLoading(false);
        setSnackbar({ open: true, message: error, severity: 'error' });
      }
    } else {
      try {
        const data = await submissionService.save(submissionPayload);
        setLoading(false);
        if (data.status === 'success') {
          navigate('/home', { state: { content: 'submissions' } });
          setSnackbar({
            open: true,
            message: 'Submissão realizada com sucesso.',
            severity: 'success',
          });
        } else if (data.status === 'advisor_not_found') {
          setRequestEmail(true);
          setSnackbar({
            open: true,
            message: data.message,
            severity: 'warning',
          });
        } else if (data.status === 'error') {
          setSnackbar({ open: true, message: data.message, severity: 'error' });
        }
      } catch (error: any) {
        setLoading(false);
        setSnackbar({ open: true, message: error, severity: 'error' });
      }
    }
  };

  // Adiciona comentário à submissão
  const addSubmissionComment = async () => {
    if (comment) {
      const content = {
        author: authenticationService.currentUserValue.name,
        message: comment,
        date: Date.now(),
      };
      try {
        const result = await submissionService.addSubmissionComment(
          submission._id,
          content
        );
        if (submission.advisor === authenticationService.currentUserValue.cpf) {
          requestCorrection();
        }
      } catch (error: any) {
        setLoading(false);
        setSnackbar({ open: true, message: error, severity: 'error' });
      }
    } else {
      setSnackbar({
        open: true,
        message:
          'É necessário pelo menos um comentário para solicitar correção.',
        severity: 'warning',
      });
    }
  };

  // Solicita correção
  const requestCorrection = async () => {
    try {
      const result = await submissionService.correctionRequestByAdvisor(
        submission._id,
        authenticationService.currentUserValue._id
      );
      navigate('/home', { state: { content: 'advisor' } });
      setSnackbar({ open: true, message: result.message, severity: 'success' });
    } catch (error: any) {
      setLoading(false);
      setSnackbar({ open: true, message: error, severity: 'error' });
    }
  };

  // Permite apenas números
  const allowOnlyNumbers = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const char = String.fromCharCode(e.keyCode);
    const pattern = '[0-9]';
    if (!char.match(pattern)) {
      e.preventDefault();
    }
  };

  return null; // Substitua por JSX conforme o template Angular original
};

export default SubmissionSave;
