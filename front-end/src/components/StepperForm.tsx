import { useState } from 'react';

import { Stepper, Step, Button } from '@material-tailwind/react';

interface StepperFormProps {
  Form: React.ReactNode;
  steps: string[];
  activeStep: number;
  isLastStep: boolean;
  isFirstStep: boolean;
  handleNext: () => void;
  handlePrev: () => void;
}

const StepperForm: React.FC<StepperFormProps> = ({
  Form,
  steps,
  activeStep,
  isLastStep,
  isFirstStep,
  handleNext,
  handlePrev,
}) => {
  return (
    <div className="py-1 px-8">
      <form>
        <Stepper
          lineClassName="bg-zinc-300"
          activeLineClassName="bg-black"
          activeStep={activeStep}
        >
          {steps.map((label, index) => (
            <Step
              key={index}
              className="h-7 w-7 pt-0.5 bg-zinc-300 cursor-pointer text-center"
              activeClassName="!bg-black text-white"
              completedClassName="bg-black text-white"
            >
              {index + 1}
            </Step>
          ))}
        </Stepper>

        {Form}

        <div className="mt-7 flex justify-between">
          <Button
            className={`${
              isFirstStep ? 'bg-gray-500' : 'bg-black'
            } font-notoRegular`}
            onClick={handlePrev}
            disabled={isFirstStep}
          >
            ย้อนกลับ
          </Button>
          <Button
            type="button"
            className={`${
              isLastStep ? 'bg-gray-500' : 'bg-black'
            } font-notoRegular`}
            onClick={handleNext}
            disabled={isLastStep}
          >
            ถัดไป
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StepperForm;
