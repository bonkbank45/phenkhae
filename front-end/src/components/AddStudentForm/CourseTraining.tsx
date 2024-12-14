import React from 'react';
import { useFormContext } from 'react-hook-form';

const CourseTraining = () => {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext();
  return <div>CourseTraining</div>;
};

export default CourseTraining;
