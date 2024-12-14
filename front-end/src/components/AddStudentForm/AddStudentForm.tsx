import React from 'react';
import PersonalInformation from './PersonalInformation';
import AdditionalPersonalInformation from './AdditionalPersonalInformation';
import CurrentAddress from './CurrentAddress';
import MassageExperience from './MassageExperience';
import CourseTraining from './CourseTraining';
import UploadImage from './UploadImage';

interface AddStudentFormProps {
  activeStep: number;
  formProps: any;
}

const AddStudentForm: React.FC<AddStudentFormProps> = ({
  activeStep,
  formProps,
}) => {
  switch (activeStep) {
    case 0:
      return <PersonalInformation formProps={formProps} />;
    case 1:
      return <AdditionalPersonalInformation formProps={formProps} />;
    case 2:
      return <CurrentAddress formProps={formProps} />;
    case 3:
      return <MassageExperience formProps={formProps} />;
  }
};

export default AddStudentForm;
