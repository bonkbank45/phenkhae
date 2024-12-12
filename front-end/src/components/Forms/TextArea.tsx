import React from 'react';
import { UseFormRegister } from 'react-hook-form';

const TextArea = ({
  label,
  name,
  placeholder,
  isDisabled,
  error,
  className = '',
  includeRegister,
}: {
  label: string;
  name: string;
  placeholder: string;
  isDisabled?: boolean;
  className?: string;
  error?: string;
  includeRegister: UseFormRegister<any>;
}) => {
  return (
    <div className={className}>
      <label
        className={`mb-3 block text-black dark:text-white ${
          isDisabled ? 'text-gray-500' : 'text-black'
        }`}
      >
        {label}
      </label>
      <textarea
        rows={6}
        disabled={isDisabled}
        placeholder={placeholder}
        name={name}
        {...includeRegister(name)}
        className={`w-full rounded-lg border-[1.5px] ${
          isDisabled
            ? 'border-gray-300 bg-gray-100'
            : error
            ? 'border-red-500 '
            : 'border-primary bg-white'
        } py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white`}
      ></textarea>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default TextArea;
