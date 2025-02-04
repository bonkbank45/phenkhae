import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  useUpdateCourseBatchScoreCri,
  useResetCourseBatchScoreCri,
} from '../../hooks/api/useCourseBatchData';
import { Button } from '@material-tailwind/react';

interface CourseGroupCriteriaForm {
  id: number;
  theory_cri: number;
  practical_cri: number;
  onSuccess: () => void;
}

const CourseBatchScoreCri = ({
  theory_cri,
  practical_cri,
  onSuccess,
}: CourseGroupCriteriaForm) => {
  const { id } = useParams();
  const { mutate: updateCourseBatchScoreCri, isPending: isUpdatingCriteria } =
    useUpdateCourseBatchScoreCri();
  const { mutate: resetCourseBatchScoreCri, isPending: isResettingCriteria } =
    useResetCourseBatchScoreCri();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseGroupCriteriaForm>({
    defaultValues: {
      id: Number(id),
      theory_cri: theory_cri,
      practical_cri: practical_cri,
    },
  });

  const handleSubmitForm = async (data: CourseGroupCriteriaForm) => {
    updateCourseBatchScoreCri(
      { ...data, id: Number(id) },
      {
        onSuccess: () => {
          setIsEditing(false);
          onSuccess();
        },
        onError: (error) => {
          console.log(error);
        },
      },
    );
  };

  const handleResetScoreCriteria = () => {
    resetCourseBatchScoreCri(Number(id), {
      onSuccess: () => {
        setIsEditing(false);
        onSuccess();
      },
    });
  };

  return (
    <div className="p-2">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-xl mx-auto font-notoLoopThaiRegular">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold font-notoExtraBold">
            เกณฑ์คะแนนจบ
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleResetScoreCriteria}
              className="text-red-500 hover:text-red-700"
            >
              {!isEditing && 'ล้างค่า'}
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-blue-500 hover:text-blue-700"
            >
              {isEditing ? 'ยกเลิก' : 'แก้ไข'}
            </button>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                คะแนนเต็มภาคทฤษฎี
              </label>
              <input
                type="number"
                min="0"
                {...register('theory_cri')}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                คะแนนเต็มภาคปฏิบัติ
              </label>
              <input
                type="number"
                min="0"
                {...register('practical_cri')}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div className="flex justify-end">
              <Button
                color="blue"
                type="submit"
                disabled={isUpdatingCriteria}
                loading={isUpdatingCriteria}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                บันทึก
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
              <span className="font-medium">คะแนนเต็มภาคทฤษฎี</span>
              <span className="text-lg">
                {theory_cri === null
                  ? '0 (ยังไม่ได้กำหนดคะแนน)'
                  : theory_cri + ' %'}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
              <span className="font-medium">คะแนนเต็มภาคปฏิบัติ</span>
              <span className="text-lg">
                {practical_cri === null
                  ? '0 (ยังไม่ได้กำหนดคะแนน)'
                  : practical_cri + ' %'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseBatchScoreCri;
