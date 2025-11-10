import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QuestionElement } from 'src/app/_models/question';
import { Snackbar, Alert, CircularProgress } from '@mui/material';

interface Props {
  reviewService: any;
  submissionService: any;
  authenticationService: any;
  trackService: any;
}

const ReviewSave: React.FC<Props> = ({
  reviewService,
  submissionService,
  authenticationService,
  trackService,
}) => {
  const [reviewForm, setReviewForm] = useState({
    feedback: '',
    status: true,
    answerForQuestionTrack: false,
    answerForSecondQuestionTrack: false,
    questions: null,
  });
  const [submitted, setSubmitted] = useState(false);
  const [submissionReview, setSubmissionReview] = useState<any>(null);
  const [questions, setQuestions] = useState<QuestionElement[]>([]);
  const [review, setReview] = useState<any>(null);
  const [userCurrent, setUserCurrent] = useState<any>(null);
  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(false);
  const [track, setTrack] = useState<any>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const questionMainComponentRef = useRef<any>(null);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setUserCurrent(authenticationService.currentUserValue);

    // Simula ActivatedRoute
    const submissionParam = params.submission;
    if (submissionParam) {
      const submissionObj = JSON.parse(submissionParam);
      setSubmissionReview(submissionObj);
      setLoading(true);

      submissionService
        .readById(submissionObj.submission._id)
        .then((result: any) => {
          submissionObj.submission.abstract = result.data.submissions.abstract;
          trackService
            .readById(submissionObj.submission.event_track)
            .then((trackResult: any) => {
              setTrack(trackResult.data);
              setQuestions(trackResult.data.questionsReviewers);
              fetchQuestions(submissionObj, trackResult.data);
              setLoading(false);

              if (
                submissionObj.review_realized_user &&
                submissionObj.review_realized_user.appraisals.length > 0
              ) {
                setReview(submissionObj.review_realized_user);
                analyzeReviewRealized(
                  submissionObj.review_realized_user,
                  trackResult.data
                );
              }
            })
            .catch((error: any) => {
              setLoading(false);
              setSnackbar({ open: true, message: error, severity: 'error' });
            });
        })
        .catch((error: any) => {
          setLoading(false);
          setSnackbar({ open: true, message: error, severity: 'error' });
        });
    }
    // eslint-disable-next-line
  }, []);

  // Analisa review já realizada
  const analyzeReviewRealized = (reviewObj: any, trackObj: any) => {
    if (reviewObj) {
      reviewObj.appraisals.forEach((reviewItem: any) => {
        if (reviewItem.reviewer_id === userCurrent._id) {
          setReviewForm((prev: any) => ({
            ...prev,
            feedback: reviewItem.result.feedback,
            status: reviewItem.result.approved,
            answerForQuestionTrack: reviewItem.result.answerForQuestionTrack,
            answerForSecondQuestionTrack:
              reviewItem.result.answerForSecondQuestionTrack,
            questions:
              reviewItem.result.additionalQuestionsAnswers &&
              reviewItem.result.additionalQuestionsAnswers.answers.length > 0
                ? {
                    questions:
                      reviewItem.result.additionalQuestionsAnswers.answers.map(
                        (data: any) => ({
                          question_id: data.question._id,
                          [data.question._id]: data.answer,
                        })
                      ),
                  }
                : trackObj.questionsReviewers.length > 0
                ? trackObj.questionsReviewers
                : null,
          }));
        }
      });
    }
  };

  // Busca perguntas
  const fetchQuestions = (submissionObj: any, trackObj: any) => {
    if (
      submissionObj.review_realized_user &&
      submissionObj.review_realized_user.appraisals.length > 0
    ) {
      setReview(submissionObj.review_realized_user);
      analyzeReviewRealized(submissionObj.review_realized_user, trackObj);
    } else {
      if (trackObj.questionsReviewers.length > 0) {
        setReviewForm((prev: any) => ({
          ...prev,
          questions: trackObj.questionsReviewers,
        }));
      }
    }
  };

  // Download do arquivo de submissão
  const downloadSubmissionFile = (submission: any) => {
    submissionService
      .getSubmissionFile(submission)
      .then((response: any) => {
        downloadPdfFile(response, submission._id);
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: 'Ocorreu um erro.',
          severity: 'error',
        });
      });
  };

  // Função utilitária para download de PDF
  const downloadPdfFile = (data: any, id: string) => {
    // Implemente a lógica de download conforme necessário
  };

  // Atualiza submissão
  const updateSubmission = () => {
    setLoading(true);
    if (submissionReview.submission.reviews.length === 1) {
      submissionService
        .updateSubmissionDateReview(submissionReview.submission)
        .then((data: any) => {
          setLoading(false);
          if (data.status === 'success') {
            navigate('/home', { state: { content: 'reviews' } });
            setSnackbar({
              open: true,
              message: 'Revisão realizada com sucesso.',
              severity: 'success',
            });
          }
        })
        .catch((error: any) => {
          setLoading(false);
          setSnackbar({ open: true, message: error, severity: 'error' });
        });
    } else {
      submissionService
        .updateSubmissionReviewManyReviewer(submissionReview.submission)
        .then((data: any) => {
          setLoading(false);
          if (data.status === 'success') {
            navigate('/home', { state: { content: 'reviews' } });
            setSnackbar({
              open: true,
              message: 'Revisão realizada com sucesso.',
              severity: 'success',
            });
          } else {
            setSnackbar({
              open: true,
              message: data.message,
              severity: 'error',
            });
          }
        })
        .catch((error: any) => {
          setLoading(false);
          setSnackbar({ open: true, message: error, severity: 'error' });
        });
    }
  };

  // Submissão do review
  const onSubmit = () => {
    setSubmitted(true);
    if (
      !reviewForm.feedback ||
      reviewForm.status === undefined ||
      (questionMainComponentRef.current &&
        questionMainComponentRef.current.isInvalid())
    ) {
      return;
    }
    setLoading(true);

    setStatus(reviewForm.status);
    submissionReview.submission.approved = reviewForm.status;
    const questionsComponent = reviewForm.questions;
    const questionTotal = questionMainComponentRef.current
      ? questionMainComponentRef.current.getTotal()
      : 0;

    const questionAnswers = {
      answers: formattedAddictionQuestionAnswer(
        questionsComponent?.questions || []
      ),
      total: questionTotal,
    };
    const idReview = submissionReview.submission.reviews[0]._id;
    const resultReview = {
      reviewer_id: userCurrent._id,
      reviewer_name: userCurrent.name,
      result: {
        feedback: reviewForm.feedback,
        approved: status,
        answerForQuestionTrack: reviewForm.answerForQuestionTrack,
        answerForSecondQuestionTrack: reviewForm.answerForSecondQuestionTrack,
        additionalQuestionsAnswers: questionAnswers,
      },
    };

    reviewService
      .sendReview(submissionReview.submission._id, resultReview)
      .then((data: any) => {
        if (data.status === 'success') {
          setLoading(false);
          setReview(data.review);
          setSnackbar({
            open: true,
            message: 'Revisão realizada com sucesso.',
            severity: 'success',
          });
        }
      })
      .catch((error: any) => {
        setLoading(false);
        setSnackbar({ open: true, message: error, severity: 'error' });
      });
  };

  // Cancela revisão
  const cancelReview = () => {
    navigate('/home', { state: { content: 'reviews' } });
  };

  // Formata respostas das perguntas adicionais
  const formattedAddictionQuestionAnswer = (content: Array<any>) => {
    return content.map((response) => ({
      question: response.question_id,
      answer: response[response.question_id],
    }));
  };

  return null; // Substitua por JSX conforme o template Angular original
};

export default ReviewSave;
