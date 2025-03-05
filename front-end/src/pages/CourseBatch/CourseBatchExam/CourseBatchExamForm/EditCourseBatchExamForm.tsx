import React from 'react';
import { useUpdateExam } from '../../../../hooks/api/useExamData';
import { ExamTable } from '../../../../types/exam';
import { ErrorResponse } from '../../../../types/error_response';
import CourseBatchExamForm from './CourseBatchExamForm';
import { UseFormSetError } from 'react-hook-form';
import { format } from 'date-fns';

interface EditCourseBatchExamFormProps {
  exam: ExamTable;
  onSuccess?: () => void;
  onError?: (error: ErrorResponse) => void;
}

const EditCourseBatchExamForm = ({
  exam,
  onSuccess,
  onError,
}: EditCourseBatchExamFormProps) => {
  const { mutate: updateExam, isPending: updateExamLoading } = useUpdateExam(
    exam.id,
  );

  const handleSubmit = (
    data: ExamTable,
    setError: UseFormSetError<ExamTable>,
  ) => {
    updateExam(data, {
      onSuccess,
      onError: (error) => {
        setError('year', { message: error.response.data.message });
        setError('term', { message: error.response.data.message });
        setError('exam_type_id', { message: error.response.data.message });
        setError('exam_period', { message: error.response.data.message });
        onError?.(error);
      },
    });
  };

  const defaultValues = {
    ...exam,
    date_start_exam: format(exam.date_start_exam, 'dd/MM/yyyy'),
  };

  return (
    <CourseBatchExamForm
      onSubmit={handleSubmit}
      isLoading={updateExamLoading}
      buttonText="บันทึกการแก้ไข"
      defaultValues={defaultValues}
    />
  );
};

export default EditCourseBatchExamForm;
