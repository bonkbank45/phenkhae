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
