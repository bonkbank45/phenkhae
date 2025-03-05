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
    addExam(
      { ...data, course_group_id: Number(id) },
      {
        onSuccess,
        onError: (error) => {
          setError('year', { message: error.response.data.message });
          setError('term', { message: error.response.data.message });
          setError('exam_type_id', { message: error.response.data.message });
          setError('exam_period', { message: error.response.data.message });
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
