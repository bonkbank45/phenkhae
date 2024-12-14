import React from 'react';
import { useFormContext } from 'react-hook-form';

const CourseTraining = () => {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext();
  return (
    <>
      <div className="mt-4">
        <h1 className="mt-6 mb-6 text-4xl font-bold text-black font-notoExtraBold">
          การอบรมหลักสูตร
        </h1>
      </div>
    </>
  );
};

export default CourseTraining;
