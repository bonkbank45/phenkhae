import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import StepperForm from '../../components/StepperForm';
import AddCourseBatchForm from './AddCourseBatchForm/AddCourseBatchForm';
import selectCourseSchema from '../../schema/ฺbatchs/addNewBatch/selectCourse';
import infoBatchSchema from '../../schema/ฺbatchs/addNewBatch/infoBatch';
import Modal from '../../components/Modal';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup.js';
import { useAddCourseBatchData } from '../../hooks/api/useCourseBatchData';
import { toast } from 'react-toastify';
import { ErrorResponse } from '../../types/error_response';

interface AddCourseBatchData {
  course_id: string;
  batch: number;
  max_students: number;
  date_start: string;
  date_end: string;
}

const AddCourseBatchIndexPage = () => {
  const schemas = [selectCourseSchema, infoBatchSchema];
  const [activeStep, setActiveStep] = useState(0);
  const [newBatchId, setNewBatchId] = useState<string | null>(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const navigate = useNavigate();
  const methods = useForm<AddCourseBatchData>({
    resolver:
      activeStep < schemas.length
        ? yupResolver(schemas[activeStep])
        : undefined,
  });

  const {
    mutate: addCourseBatchData,
    isPending: isAddCourseBatchDataPending,
    isError: isAddCourseBatchDataError,
    error: addCourseBatchDataError,
  } = useAddCourseBatchData();

  const steps = [
    'เลือกหลักสูตร',
    'กำหนดรายละเอียดรุ่นหลักสูตร',
    'ยืนยันการสร้างรุ่นหลักสูตร',
  ];

  const handleNext = async () => {
    const isLastStep = activeStep === steps.length - 1;

    if (isLastStep) {
      const formData = methods.getValues();

      const parseDateString = (dateStr: string) => {
        const [day, month, year] = dateStr.split('/');
        return new Date(Number(year), Number(month) - 1, Number(day));
      };

      const submissionData: AddCourseBatchData = {
        ...formData,
        batch: Number(formData.batch),
        max_students: Number(formData.max_students),
        date_start: format(
          parseDateString(formData.date_start),
          'yyyy-MM-dd 00:00:00',
        ),
        date_end: format(
          parseDateString(formData.date_end),
          'yyyy-MM-dd 23:59:59',
        ),
      };

      addCourseBatchData(submissionData, {
        onSuccess: (response) => {
          toast.success('เพิ่มข้อมูลรุ่นหลักสูตรสำเร็จ');
          setNewBatchId(response.data.id);
          setShowAddStudentModal(true);
          setActiveStep(0);
        },
        onError: (error: ErrorResponse) => {
          toast.error(
            `เพิ่มข้อมูลรุ่นหลักสูตรไม่สำเร็จ: ${error.response.data.message}`,
          );
        },
      });
      return;
    }

    const isValid = await methods.trigger();
    if (isValid) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrev = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <>
      <FormProvider {...methods}>
        <StepperForm
          Form={<AddCourseBatchForm activeStep={activeStep} />}
          steps={steps}
          isLastStep={activeStep === steps.length - 1}
          isFirstStep={activeStep === 0}
          isLoading={isAddCourseBatchDataPending}
          activeStep={activeStep}
          handleNext={handleNext}
          handlePrev={handlePrev}
        />
      </FormProvider>
      <Modal
        isOpen={showAddStudentModal}
        onClose={() => {
          setShowAddStudentModal(false);
          methods.reset();
          setActiveStep(0);
        }}
        title="เพิ่มนักเรียนในรุ่นหลักสูตรใหม่"
      >
        <div className="p-6 space-y-4">
          <p className="text-lg font-notoLoopThaiRegular">
            คุณต้องการเพิ่มนักเรียนในรุ่นหลักสูตรที่เพิ่งสร้างเลยหรือไม่?
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => {
                setShowAddStudentModal(false);
                methods.reset();
                setActiveStep(0);
              }}
              className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100"
            >
              ไม่, ขอเพิ่มภายหลัง
            </button>
            <button
              onClick={() => {
                navigate(`/courses/batchs/${newBatchId}/add-students`);
              }}
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              ใช่, เพิ่มนักเรียนเลย
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddCourseBatchIndexPage;
