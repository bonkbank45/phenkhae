import { useState } from 'react';
import { UseFormRegister } from 'react-hook-form';

const CheckboxOne = ({
  label = 'Checkbox Text',
  checked = false,
  name = '',
  onChange,
  className,
  id,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  className?: string;
  id?: string;
  name?: string;
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className={`flex cursor-pointer select-none items-center ${className} ${
          checked && 'text-black'
        }`}
      >
        <div className="relative">
          <input
            type="checkbox"
            id={id}
            name={name}
            className="sr-only"
            checked={checked}
            onChange={onChange}
          />
          <div
            className={`mr-4 flex h-5 w-5 bg-white items-center justify-center rounded border ${
              checked && 'border-primary bg-gray dark:bg-transparent'
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-sm ${checked && 'bg-primary'}`}
            ></span>
          </div>
        </div>
        {label}
      </label>
    </div>
  );
};

export default CheckboxOne;
