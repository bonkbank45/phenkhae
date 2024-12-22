import { useState } from 'react';

import { Stepper, Step, Button } from '@material-tailwind/react';
import Spinner from '../common/Spinner';

interface StepperFormProps {
  Form: React.ReactNode;
  steps: string[];
  activeStep: number;
  isLastStep: boolean;
  isFirstStep: boolean;
  isLoading: boolean;
  handleNext: () => void;
  handlePrev: () => void;
}

const StepperForm: React.FC<StepperFormProps> = ({
  Form,
  steps,
  activeStep,
  isLastStep,
  isFirstStep,
  isLoading,
  handleNext,
  handlePrev,
}) => {
  return (
    <div className="py-1 px-8">
      <form>
        <Stepper
          lineClassName="bg-zinc-300 dark:bg-zinc-700"
          activeLineClassName="bg-black dark:bg-white"
          activeStep={activeStep}
        >
          {steps.map((label, index) => (
            <Step
              key={index}
              className="h-7 w-7 pt-0.5 bg-zinc-300 cursor-pointer text-center dark:bg-zinc-700"
              activeClassName="!bg-black text-white dark:!bg-white dark:!text-black"
              completedClassName="bg-black text-white dark:bg-white dark:text-black"
            >
              {index + 1}
            </Step>
          ))}
        </Stepper>

        {Form}

        <div className="mt-7 flex justify-between">
          <Button
            className={`${
              isFirstStep
                ? 'bg-gray-500'
                : 'bg-black dark:bg-white dark:text-black'
            } font-notoRegular`}
            onClick={handlePrev}
            disabled={isFirstStep}
          >
            ย้อนกลับ
          </Button>
          <Button
            type="button"
            className="font-notoRegular bg-black dark:bg-white dark:text-black"
            onClick={handleNext}
          >
            {isLastStep ? 'บันทึก' : 'ถัดไป'}
            {isLoading && <Spinner className="w-2 h-2" />}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StepperForm;
