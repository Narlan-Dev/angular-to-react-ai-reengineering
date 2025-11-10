import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useAuth } from './../hooks/useAuth'; // Exemplo de hook de autenticação

const QUESTION_TYPES = {
  TEXT: 'TEXT',
  LONG_TEXT: 'LONG_TEXT',
  SELECT: 'SELECT',
  NUMBER: 'NUMBER',
};

interface QuestionElement {
  _id?: string;
  title: string;
  description?: string;
  weight?: number | null;
  type: string;
  model: string;
  owner?: any;
}

interface QuestionSaveProps {
  onClose: (result?: QuestionElement) => void;
  question?: QuestionElement;
  model: string;
  track?: any;
}

const questionService = {
  readByUserAndTrack: (query: any) =>
    axios.get('/api/questions', { params: query }),
  update: (question: QuestionElement) =>
    axios.put(`/api/questions/${question._id}`, question),
  save: (question: QuestionElement) => axios.post('/api/questions', question),
};

const QuestionSave: React.FC<QuestionSaveProps> = ({
  onClose,
  question: questionToEdit,
  model,
  track,
}) => {
  const [loading, setLoading] = useState(false);
  const [existingQuestions, setExistingQuestions] = useState<QuestionElement[]>(
    []
  );
  const { currentUser } = useAuth();

  const isEdit = !!questionToEdit;
  const types = [
    QUESTION_TYPES.TEXT,
    QUESTION_TYPES.LONG_TEXT,
    QUESTION_TYPES.SELECT,
    QUESTION_TYPES.NUMBER,
  ];

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<QuestionElement>({
    defaultValues: {
      title: questionToEdit?.title || '',
      type: questionToEdit?.type || '',
      weight: questionToEdit?.weight || null,
      description: questionToEdit?.description || '',
    },
  });

  const watchedType = watch('type');

  useEffect(() => {
    const fetchExistingQuestions = async () => {
      if (!currentUser) return;
      try {
        const response = await questionService.readByUserAndTrack({
          user_id: currentUser._id,
          track_id: track?._id ?? null,
          model: model,
        });
        if (response.data.status === 'success') {
          setExistingQuestions(response.data.data);
        }
      } catch (error) {}
    };
    fetchExistingQuestions();
  }, [currentUser, track, model]);

  const validationLimitWeight = (
    currentWeightValue: number | null | undefined
  ) => {
    const totalWeight = existingQuestions.reduce((acc, q) => {
      if (q.weight && (!isEdit || q._id !== questionToEdit?._id)) {
        return acc + q.weight;
      }
      return acc;
    }, 0);

    const currentWeight = Number(currentWeightValue) || 0;
    return totalWeight + currentWeight <= 100;
  };

  const onSubmit = async (formData: QuestionElement) => {
    setLoading(true);

    const isWeightRequired =
      formData.type === QUESTION_TYPES.SELECT ||
      formData.type === QUESTION_TYPES.NUMBER;

    if (isWeightRequired) {
      const weight = Number(formData.weight);
      if (weight <= 0 || weight > 100) {
        setLoading(false);
        return;
      }
    }

    if (!validationLimitWeight(formData.weight)) {
      setLoading(false);
      return;
    }

    const questionPayload: QuestionElement = {
      ...formData,
      weight: isWeightRequired ? formData.weight : null,
      model: model,
      owner: currentUser,
    };

    try {
      let response;
      if (isEdit) {
        questionPayload._id = questionToEdit._id;
        response = await questionService.update(questionPayload);
      } else {
        response = await questionService.save(questionPayload);
      }

      if (response.data.status === 'success') {
        onClose(response.data.data);
      } else {
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
};
