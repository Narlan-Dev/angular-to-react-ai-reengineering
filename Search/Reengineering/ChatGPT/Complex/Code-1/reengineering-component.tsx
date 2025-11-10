import React, { useEffect, useState, useCallback } from 'react';
import { QUESTION_TYPES } from 'src/app/_constants/questionTypes.constants';
import { QuestionElement } from 'src/app/_models/question';

type QuestionValue = string | number | null;

interface QuestionFormValue {
  [questionId: string]: QuestionValue;
}

interface Props {
  questions: QuestionElement[];
  submitted?: boolean;
  onChange?: (value: { questions: QuestionFormValue[]; total: number }) => void;
}

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

// Validação dos campos, substituindo Validators do Angular
const validate = (type: string, value: QuestionValue): string | null => {
  switch (type) {
    case QUESTION_TYPES.LONG_TEXT:
      if (!value || typeof value !== 'string' || value.length < 10)
        return 'Mínimo 10 caracteres';
      break;
    case QUESTION_TYPES.TEXT:
      if (!value || typeof value !== 'string' || value.length < 1)
        return 'Campo obrigatório';
      break;
    case QUESTION_TYPES.SELECT:
      if (value === null || typeof value !== 'number' || value < 1 || value > 5)
        return 'Selecione entre 1 e 5';
      break;
    case QUESTION_TYPES.NUMBER:
      if (
        value === null ||
        typeof value !== 'number' ||
        value < 0 ||
        value > 100
      )
        return 'Número entre 0 e 100';
      break;
    default:
      if (!value) return 'Campo obrigatório';
  }
  return null;
};

const QuestionMain: React.FC<Props> = ({
  questions,
  submitted = false,
  onChange,
}) => {
  // Estado para os valores das perguntas
  const [questionValues, setQuestionValues] = useState<QuestionFormValue[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [errors, setErrors] = useState<{
    [index: number]: { [questionId: string]: string | null };
  }>({});

  // Inicializa os controles das perguntas
  useEffect(() => {
    if (questions && questions.length > 0) {
      const initialValues = questions.map((q) => ({
        question_id: q._id,
        [q._id]:
          q.type === QUESTION_TYPES.SELECT || q.type === QUESTION_TYPES.NUMBER
            ? null
            : '',
      }));
      setQuestionValues(initialValues);
      setErrors({});
    }
  }, [questions]);

  // Calcula o total sempre que os valores mudam
  useEffect(() => {
    let newTotal = 0;
    questionValues.forEach((control, idx) => {
      const questionId = control.question_id;
      const question = questions.find((q) => q._id === questionId);
      if (
        question &&
        (question.type === QUESTION_TYPES.SELECT ||
          question.type === QUESTION_TYPES.NUMBER)
      ) {
        const value = control[questionId] ?? 0;
        newTotal += Number(value) * (question.weight || 1);
      }
    });
    setTotal(newTotal);

    // Notifica o pai (equivalente ao onChange do Angular)
    if (onChange) {
      onChange({ questions: questionValues, total: newTotal });
    }
  }, [questionValues, questions, onChange]);

  // Manipula mudança de valor de uma pergunta
  const handleChange = useCallback(
    (index: number, questionId: string, value: QuestionValue, type: string) => {
      setQuestionValues((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [questionId]: value };
        return updated;
      });
      setErrors((prev) => {
        const updated = { ...prev };
        updated[index] = {
          ...updated[index],
          [questionId]: validate(type, value),
        };
        return updated;
      });
    },
    []
  );

  // Verifica se há perguntas com peso
  const hasWeightQuestions = useCallback(() => {
    return questions.some(
      (q) =>
        q.type === QUESTION_TYPES.SELECT || q.type === QUESTION_TYPES.NUMBER
    );
  }, [questions]);

  // Verifica se o formulário é inválido
  const isInvalid = useCallback(() => {
    return Object.values(errors).some((errObj) =>
      Object.values(errObj).some((err) => err !== null)
    );
  }, [errors]);

  return null; // Substitua por JSX conforme o template Angular
};

export default QuestionMain;
