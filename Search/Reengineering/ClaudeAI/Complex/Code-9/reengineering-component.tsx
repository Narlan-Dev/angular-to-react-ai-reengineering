import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Checkbox,
} from '@mui/material';
import { Download } from '@mui/icons-material';
import { ReviewService } from 'src/app/_services/review.service';
import { SubmissionService } from 'src/app/_services/submission.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { TrackService } from 'src/app/_services/track.service';
import { QuestionElement } from 'src/app/_models/question';
import { User } from 'src/app/_models/user';
import QuestionMain from 'src/app/question/question-main/question-main.component';

interface ReviewSaveProps {
  reviewService: ReviewService;
  submissionService: SubmissionService;
  trackService: TrackService;
  authenticationService: AuthenticationService;
}

const ReviewSave: React.FC<ReviewSaveProps> = ({
  reviewService,
  submissionService,
  trackService,
  authenticationService,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [submissionReview, setSubmissionReview] = useState<any>(null);
  const [questions, setQuestions] = useState<QuestionElement[]>([]);
  const [review, setReview] = useState<any>(null);
  const [userCurrent, setUserCurrent] = useState<User | null>(null);
  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(false);
  const [track, setTrack] = useState<any>(null);
  const [formData, setFormData] = useState({
    feedback: '',
    status: true,
    answerForQuestionTrack: false,
    answerForSecondQuestionTrack: false,
    questions: null,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const navigate = useNavigate();
  const params = useParams();
  const questionMainRef = useRef<any>(null);

  useEffect(() => {
    setUserCurrent(authenticationService.currentUserValue);
    setFormData((prev) => ({ ...prev, status: status }));

    const submission = params.submission;
    if (submission) {
      const submissionData = JSON.parse(submission);
      setSubmissionReview(submissionData);
      loadSubmissionData(submissionData);
    }
  }, []);

  const loadSubmissionData = async (submissionData: any) => {
    setLoading(true);
    try {
      const result = await submissionService.readById(
        submissionData.submission._id
      );
      submissionData.submission.abstract = result.data.submissions.abstract;

      const trackResult = await trackService.readById(
        submissionData.submission.event_track
      );
      setTrack(trackResult.data);
      setQuestions(trackResult.data.questionsReviewers);

      if (
        submissionData.review_realized_user &&
        submissionData.review_realized_user.appraisals.length > 0
      ) {
        setReview(submissionData.review_realized_user);
        analyzeReviewRealized(
          submissionData.review_realized_user,
          trackResult.data
        );
      } else {
        fetchQuestions(trackResult.data);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Erro ao carregar dados da submissão',
        severity: 'error',
      });
    }
  };

  const downloadSubmissionFile = async (submission: any) => {
    try {
      const response = await submissionService.getSubmissionFile(submission);
      // downloadPdfFile(response, submission._id);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Ocorreu um erro ao baixar o arquivo',
        severity: 'error',
      });
    }
  };

  const analyzeReviewRealized = (reviewData: any, trackData: any) => {
    if (reviewData && userCurrent) {
      reviewData.appraisals.forEach((review: any) => {
        if (review.reviewer_id === userCurrent._id) {
          setFormData((prev) => ({
            ...prev,
            feedback: review.result.feedback,
            status: review.result.approved,
            answerForQuestionTrack: review.result.answerForQuestionTrack,
          }));

          if (
            review.result.additionalQuestionsAnswers &&
            review.result.additionalQuestionsAnswers.answers.length > 0
          ) {
            const questionsList =
              review.result.additionalQuestionsAnswers.answers.map(
                (data: any) => data.question
              );
            setQuestions(questionsList);

            const formattedAnswers =
              review.result.additionalQuestionsAnswers.answers.map(
                (data: any) => ({
                  question_id: data.question._id,
                  [data.question._id]: data.answer,
                })
              );

            setFormData((prev) => ({
              ...prev,
              questions: { questions: formattedAnswers },
            }));
          } else if (
            review.result.additionalQuestionsAnswers &&
            review.result.additionalQuestionsAnswers.answers.length <= 0
          ) {
            if (trackData.questionsReviewers.length > 0) {
              setFormData((prev) => ({
                ...prev,
                questions: trackData.questionsReviewers,
              }));
            }
          }
        }
      });
    }
  };

  const fetchQuestions = (trackData: any) => {
    if (
      submissionReview?.review_realized_user &&
      submissionReview.review_realized_user.appraisals.length > 0
    ) {
      setReview(submissionReview.review_realized_user);
      analyzeReviewRealized(submissionReview.review_realized_user, trackData);
    } else {
      if (trackData.questionsReviewers.length > 0) {
        setFormData((prev) => ({
          ...prev,
          questions: trackData.questionsReviewers,
        }));
      }
    }
  };

  const updateSubmission = async () => {
    setLoading(true);

    try {
      let result;
      if (submissionReview.submission.reviews.length === 1) {
        result = await submissionService.updateSubmissionDateReview(
          submissionReview.submission
        );
      } else {
        result = await submissionService.updateSubmissionReviewManyReviewer(
          submissionReview.submission
        );
      }

      setLoading(false);
      if (result.status === 'success') {
        navigate('/home/reviews');
        setSnackbar({
          open: true,
          message: 'Revisão realizada com sucesso.',
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: result.message,
          severity: 'error',
        });
      }
    } catch (error) {
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Erro ao atualizar submissão',
        severity: 'error',
      });
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Validação em tempo real
    if (field === 'feedback' && !value) {
      setErrors((prev) => ({ ...prev, feedback: 'Feedback é obrigatório' }));
    } else if (field === 'feedback') {
      setErrors((prev) => ({ ...prev, feedback: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.feedback) {
      newErrors.feedback = 'Feedback é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    setSubmitted(true);

    if (!validateForm() || questionMainRef.current?.isInvalid()) {
      return;
    }

    setLoading(true);
    setStatus(formData.status);
    submissionReview.submission.approved = formData.status;

    const questionTotal = questionMainRef.current
      ? questionMainRef.current.getTotal()
      : 0;
    const questionAnswers = {
      answers: formattedAddictionQuestionAnswer(
        formData.questions?.questions || []
      ),
      total: questionTotal,
    };

    const resultReview = {
      reviewer_id: userCurrent?._id,
      reviewer_name: userCurrent?.name,
      result: {
        feedback: formData.feedback,
        approved: status,
        answerForQuestionTrack: formData.answerForQuestionTrack,
        answerForSecondQuestionTrack: formData.answerForSecondQuestionTrack,
        additionalQuestionsAnswers: questionAnswers,
      },
    };

    try {
      const result = await reviewService.sendReview(
        submissionReview.submission._id,
        resultReview
      );

      if (result.status === 'success') {
        setLoading(false);
        setReview(result.review);
        setSnackbar({
          open: true,
          message: 'Revisão realizada com sucesso.',
          severity: 'success',
        });
      }
    } catch (error) {
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Erro ao enviar revisão',
        severity: 'error',
      });
    }
  };

  const cancelReview = () => {
    navigate('/home/reviews');
  };

  const formattedAddictionQuestionAnswer = (content: Array<any>) => {
    return content.map((response) => ({
      question: response.question_id,
      answer: response[response.question_id],
    }));
  };

  return null;
};

export default ReviewSave;
