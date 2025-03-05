import React from 'react';
import TextField from '../../components/Forms/TextField';
import { Button } from '@material-tailwind/react';
import { useForm } from 'react-hook-form';
import { AddExamType } from '../../types/exam';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useExamTypeData } from '../../hooks/api/useExamTypeData';
import { useNavigate } from 'react-router-dom';
import { useAddExamType } from '../../hooks/api/useExamTypeData';

const AddExamTypePage = ({ onSuccess }: { onSuccess: () => void }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<AddExamType>({
    resolver: yupResolver(
      yup.object().shape({
        exam_type_name: yup.string().required('กรุณากรอกชื่อประเภทการสอบ'),
      }),
    ),
  });
  const navigate = useNavigate();
  const { data: examTypeData, isLoading: isExamTypeLoading } =
    useExamTypeData();
  const { mutate: addExamType, isPending: isAddExamTypePending } =
    useAddExamType();

  if (isExamTypeLoading) {
    return (
      <div className="flex justify-center items-center">
        <p className="text-sm font-notoLoopThaiRegular">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  console.log(examTypeData);

  return (
    <>
      <div className="p-4 flex flex-col gap-4 rounded-lg bg-gray-50">
        <h1 className="text-md font-notoLoopThaiRegular">
          ประเภทการสอบทั้งหมดที่มีในระบบ
        </h1>
        <div className="max-h-[300px] overflow-y-auto">
          {examTypeData?.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {examTypeData?.data.map((examType) => (
                <div
                  key={examType.id}
                  className="p-4 rounded-lg border border-gray-200 shadow-sm bg-white"
                >
                  <p className="font-notoLoopThaiRegular">
                    {examType.exam_type_name}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm p-1 font-notoLoopThaiRegular text-red-500">
              - ไม่พบข้อมูลประเภทการสอบในระบบ
            </p>
          )}
        </div>
      </div>
      <div className="p-4">
        <TextField
          label="ชื่อประเภทการสอบ"
          name="exam_type_name"
          includeRegister={register}
          placeholder="ทฤษฎีรอบพิเศษ, ปฏิบัติ"
          error={errors.exam_type_name?.message}
          required={true}
        />
        <div className="flex justify-end">
          <Button
            className="mt-4 font-notoLoopThaiRegular"
            color="blue"
            disabled={isAddExamTypePending}
            loading={isAddExamTypePending}
            onClick={handleSubmit((data) => {
              addExamType(data, {
                onSuccess: () => {
                  onSuccess();
                },
                onError: (error) => {
                  setError('exam_type_name', {
                    message: error.response.data.message,
                  });
                },
              });
            })}
          >
            บันทึก
          </Button>
        </div>
      </div>
    </>
  );
};

export default AddExamTypePage;
