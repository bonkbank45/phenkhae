import React from 'react';
import SelectCourseForm from './SelectCourseForm';
import BatchInformation from './batchInformation';
import ConfirmInfomationOpenBatch from './ConfirmInfomationOpenBatch';
interface AddCourseBatchFormProps {
  activeStep: number;
}

const AddCourseBatchForm = ({ activeStep }: AddCourseBatchFormProps) => {
  switch (activeStep) {
    case 0:
      return <SelectCourseForm />;
    case 1:
      return <BatchInformation />;
    case 2:
      return <ConfirmInfomationOpenBatch />;
  }
};

export default AddCourseBatchForm;
