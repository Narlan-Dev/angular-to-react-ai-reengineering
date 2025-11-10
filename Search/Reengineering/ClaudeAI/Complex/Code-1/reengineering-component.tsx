import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { QUESTION_TYPES } from 'src/app/_constants/questionTypes.constants';
import { QuestionElement } from 'src/app/_models/question';

interface QuestionMainProps {
  questions: QuestionElement[];
  submitted?: boolean;
  value?: any;
  onChange?: (value: any) => void;
}

interface QuestionMainRef {
  getTotal: () => number;
  isInvalid: () => boolean;
}

const QuestionMain = forwardRef<QuestionMainRef, QuestionMainProps>(
  ({ questions = [], submitted = false, value, onChange }, ref) => {
    const [formData, setFormData] = useState<{ [key: string]: any }>({});
    const [total, setTotal] = useState<number>(0);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
      if (questions && questions.length > 0) {
        initializeQuestionControls();
      }
    }, [questions]);

    useEffect(() => {
      if (value) {
        if (value.questions) {
          const formattedData: { [key: string]: any } = {};
          value.questions.forEach((q: any) => {
            formattedData[q.question_id] = q[q.question_id];
          });
          setFormData(formattedData);
        } else {
          setFormData(value);
        }
      }
    }, [value]);

    useEffect(() => {
      calculateTotal();
      if (onChange) {
        const questionsArray = questions.map((question) => ({
          question_id: question._id,
          [question._id]:
            formData[question._id] || getDefaultValue(question.type),
        }));
        onChange({
          questions: questionsArray,
          total,
        });
      }
    }, [formData]);

    const initializeQuestionControls = () => {
      const initialData: { [key: string]: any } = {};
      questions.forEach((question) => {
        initialData[question._id] = getDefaultValue(question.type);
      });
      setFormData(initialData);
    };

    const getDefaultValue = (type: string) => {
      switch (type) {
        case QUESTION_TYPES.LONG_TEXT:
        case QUESTION_TYPES.TEXT:
          return '';
        case QUESTION_TYPES.SELECT:
        case QUESTION_TYPES.NUMBER:
          return null;
        default:
          return '';
      }
    };

    const validateQuestion = (
      question: QuestionElement,
      value: any
    ): string => {
      switch (question.type) {
        case QUESTION_TYPES.LONG_TEXT:
          if (!value || value.length < 10) return 'Mínimo de 10 caracteres';
          break;
        case QUESTION_TYPES.TEXT:
          if (!value || value.length < 1) return 'Campo obrigatório';
          break;
        case QUESTION_TYPES.SELECT:
          if (value === null || value < 1 || value > 5)
            return 'Selecione um valor entre 1 e 5';
          break;
        case QUESTION_TYPES.NUMBER:
          if (value === null || value < 0 || value > 100)
            return 'Digite um valor entre 0 e 100';
          break;
        default:
          if (!value) return 'Campo obrigatório';
      }
      return '';
    };

    const handleInputChange = (questionId: string, newValue: any) => {
      const question = questions.find((q) => q._id === questionId);
      if (!question) return;

      setFormData((prev) => ({
        ...prev,
        [questionId]: newValue,
      }));

      const error = validateQuestion(question, newValue);
      setErrors((prev) => ({
        ...prev,
        [questionId]: error,
      }));
    };

    const getMinValue = (type: string): number => {
      switch (type) {
        case QUESTION_TYPES.SELECT:
          return 1;
        case QUESTION_TYPES.NUMBER:
          return 0;
        default:
          return 0;
      }
    };

    const getMaxValue = (type: string): number => {
      switch (type) {
        case QUESTION_TYPES.SELECT:
          return 5;
        case QUESTION_TYPES.NUMBER:
          return 100;
        default:
          return 0;
      }
    };

    const calculateTotal = () => {
      let newTotal = 0;
      questions.forEach((question) => {
        if (
          question.type === QUESTION_TYPES.SELECT ||
          question.type === QUESTION_TYPES.NUMBER
        ) {
          const value = formData[question._id] || 0;
          newTotal += value * (question.weight || 1);
        }
      });
      setTotal(newTotal);
    };

    const hasWeightQuestions = (): boolean => {
      return questions.some(
        (q) =>
          q.type === QUESTION_TYPES.SELECT || q.type === QUESTION_TYPES.NUMBER
      );
    };

    const isInvalid = (): boolean => {
      return questions.some((question) => {
        const value = formData[question._id];
        const error = validateQuestion(question, value);
        return error !== '';
      });
    };

    useImperativeHandle(ref, () => ({
      getTotal: () => total,
      isInvalid,
    }));

    return null;
  }
);

QuestionMain.displayName = 'QuestionMain';

export default QuestionMain;
