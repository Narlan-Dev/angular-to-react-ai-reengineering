import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

const QUESTION_TYPES = {
  LONG_TEXT: 'LONG_TEXT',
  TEXT: 'TEXT',
  SELECT: 'SELECT',
  NUMBER: 'NUMBER',
};

interface QuestionElement {
  _id: string;
  type: string;
  weight?: number;
}

interface QuestionFormValue {
  question_id: string;
  [key: string]: any;
}

interface FormState {
  questions: QuestionFormValue[];
  total: number;
}

interface QuestionMainProps {
  questions: QuestionElement[];
  submitted?: boolean;
  value?: FormState;
  onChange: (value: FormState) => void;
  setFormValidity?: (isValid: boolean) => void;
}

const QuestionMain: React.FC<QuestionMainProps> = ({
  questions,
  submitted,
  value,
  onChange,
  setFormValidity,
}) => {
  const {
    control,
    watch,
    formState: { isValid },
  } = useForm<{ questions: QuestionFormValue[] }>({
    mode: 'onChange',
  });

  const { fields, replace } = useFieldArray({
    control,
    name: 'questions',
  });

  const formValues = watch('questions');

  useEffect(() => {
    const initialFormState = questions.map((q) => ({
      question_id: q._id,
      [q._id]:
        value?.questions?.find((v) => v.question_id === q._id)?.[q._id] ?? null,
    }));
    replace(initialFormState);
  }, [questions, replace, value]);

  useEffect(() => {
    if (!formValues) return;

    let total = 0;
    formValues.forEach((formValue, index) => {
      const question = questions[index];
      if (
        question &&
        (question.type === QUESTION_TYPES.SELECT ||
          question.type === QUESTION_TYPES.NUMBER)
      ) {
        const fieldValue = formValue[question._id] || 0;
        total += Number(fieldValue) * (question.weight || 1);
      }
    });

    onChange({ questions: formValues, total });
    setFormValidity?.(isValid);
  }, [formValues, questions, onChange, isValid, setFormValidity]);

  const getValidationRules = (question: QuestionElement) => {
    switch (question.type) {
      case QUESTION_TYPES.LONG_TEXT:
        return { required: true, minLength: 10 };
      case QUESTION_TYPES.TEXT:
        return { required: true, minLength: 1 };
      case QUESTION_TYPES.SELECT:
        return { required: true, min: 1, max: 5 };
      case QUESTION_TYPES.NUMBER:
        return { required: true, min: 0, max: 100 };
      default:
        return { required: true };
    }
  };

  const getMinValue = (type: string): number => {
    return type === QUESTION_TYPES.SELECT ? 1 : 0;
  };

  const getMaxValue = (type: string): number => {
    return type === QUESTION_TYPES.SELECT ? 5 : 100;
  };
};
