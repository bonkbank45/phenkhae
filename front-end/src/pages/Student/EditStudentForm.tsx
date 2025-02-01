import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PersonalInformation from './AddStudentForm/PersonalInformation';
import AdditionalPersonalInformation from './AddStudentForm/AdditionalPersonalInformation';
import CurrentAddress from './AddStudentForm/CurrentAddress';
import MassageExperience from './AddStudentForm/MassageExperience';
import CourseTraining from './AddStudentForm/CourseTraining';
import UploadImage from './AddStudentForm/UploadImage';
import { fetchStudentById } from '../../services/api';

const EditStudentForm = ({ activeStep }: { activeStep: number }) => {
  const { id } = useParams<{ id: string }>();
  const [studentData, setStudentData] = useState<any>(null);

  const commonProps = {
    isEditMode: true,
    studentId: id,
  };

  switch (activeStep) {
    case 0:
      return <PersonalInformation {...commonProps} />;
    case 1:
      return <AdditionalPersonalInformation />;
    case 2:
      return <CurrentAddress {...commonProps} />;
    case 3:
      return <MassageExperience />;
    case 4:
      return <UploadImage {...commonProps} />;
  }
};

export default EditStudentForm;
