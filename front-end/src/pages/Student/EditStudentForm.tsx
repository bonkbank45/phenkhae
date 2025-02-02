import { useParams } from 'react-router-dom';
import PersonalInformation from './AddStudentForm/PersonalInformation';
import AdditionalPersonalInformation from './AddStudentForm/AdditionalPersonalInformation';
import CurrentAddress from './AddStudentForm/CurrentAddress';
import MassageExperience from './AddStudentForm/MassageExperience';
import UploadImage from './AddStudentForm/UploadImage';
import { Student } from '../../types/student';

const EditStudentForm = ({
  stepNames,
  activeStep,
  studentData,
  handleSkip,
}: {
  stepNames: string[];
  activeStep: number;
  studentData: Student;
  handleSkip: (step: number) => void;
}) => {
  const { id } = useParams<{ id: string }>();

  const commonProps = {
    isEditMode: true,
    studentId: id,
    studentData: studentData,
    stepNames: stepNames,
    handleSkip: handleSkip,
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
      return (
        <UploadImage
          {...commonProps}
          haveProfileImage={!!studentData?.profile_image}
        />
      );
  }
};

export default EditStudentForm;
