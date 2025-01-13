import React from 'react';
import PersonalInformation from './PersonalInformation';
import AdditionalPersonalInformation from './AdditionalPersonalInformation';
import CurrentAddress from './CurrentAddress';
import MassageExperience from './MassageExperience';
import CourseTraining from './CourseTraining';
import UploadImage from './UploadImage';

interface AddStudentFormProps {
  activeStep: number;
}

const AddStudentForm = ({ activeStep }: AddStudentFormProps) => {
  switch (activeStep) {
    case 0:
      return <PersonalInformation />;
    case 1:
      return <AdditionalPersonalInformation />;
    case 2:
      return <CurrentAddress />;
    case 3:
      return <MassageExperience />;
    case 4:
      return <CourseTraining />;
    case 5:
      return <UploadImage />;
  }
};

export default AddStudentForm;
