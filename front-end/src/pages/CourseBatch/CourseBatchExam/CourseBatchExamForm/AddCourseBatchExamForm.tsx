import React from 'react';
import { useAddExam } from '../../../../hooks/api/useExamData';
import { useParams } from 'react-router-dom';
import { ExamTable } from '../../../../types/exam';
import { ErrorResponse } from '../../../../types/error_response';
import CourseBatchExamForm from './CourseBatchExamForm';
import { UseFormSetError } from 'react-hook-form';

interface AddCourseBatchExamProps {
  onSuccess?: () => void;
  onError?: (error: ErrorResponse) => void;
}

const AddCourseBatchExam = ({
  onSuccess,
  onError,
}: AddCourseBatchExamProps) => {
  const { id } = useParams();
  const { mutate: addExam, isPending: addExamLoading } = useAddExam(Number(id));

  const handleSubmit = (
    data: ExamTable,
    setError: UseFormSetError<ExamTable>,
  ) => {
    console.log(data);
    addExam(
      { ...data, course_group_id: Number(id) },
      {
        onSuccess,
        onError: (error) => {
          if (error.response.data.errors) {
            Object.entries(error.response.data.errors).forEach(
              ([field, messages]) => {
                if (field === 'course_group_id') {
                  setError('year', {
                    message: Array.isArray(messages) ? messages[0] : messages,
                  });
                  setError('term', {
                    message: Array.isArray(messages) ? messages[0] : messages,
                  });
                } else {
                  setError(field as keyof ExamTable, {
                    message: Array.isArray(messages) ? messages[0] : messages,
                  });
                }
              },
            );
          } else {
            setError('score_pass', { message: error.response.data.message });
          }
          onError?.(error);
        },
      },
    );
  };

  return (
    <CourseBatchExamForm
      onSubmit={handleSubmit}
      isLoading={addExamLoading}
      buttonText="บันทึก"
    />
  );
};

export default AddCourseBatchExam;
