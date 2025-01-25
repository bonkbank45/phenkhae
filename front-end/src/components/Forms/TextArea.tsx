import React from 'react';
import { Control, UseFormRegister, useWatch } from 'react-hook-form';

const TextArea = ({
  label,
  name,
  placeholder,
  isDisabled,
  error,
  className = '',
  includeRegister,
  maxLength,
  required = false,
  control,
}: {
  label: string;
  name: string;
  placeholder: string;
  isDisabled?: boolean;
  className?: string;
  error?: string;
  includeRegister: UseFormRegister<any>;
  maxLength?: number;
  required?: boolean;
  control?: any;
}) => {
  let value = '';
  if (control) {
    value = useWatch({ name, control });
  } else {
    value = useWatch({ name });
  }

  return (
    <div className={className}>
      <label
        className={`mb-3 block text-black dark:text-white font-notoLoopThaiRegular ${
          isDisabled ? 'text-gray-300' : 'text-gray-500'
        }`}
      >
        {label}
        {required && <span className="text-red-500"> *</span>}
        <span className={`text-xs ${isDisabled ? 'hidden' : 'text-gray-500'}`}>
          {maxLength && (
            <span>
              &nbsp; จำกัดความยาว {maxLength} ตัวอักษร, เหลือ{' '}
              {maxLength - (value?.length || 0)} ตัวอักษร
            </span>
          )}
        </span>
      </label>
      <textarea
        rows={6}
        disabled={isDisabled}
        placeholder={placeholder}
        maxLength={maxLength}
        name={name}
        {...includeRegister(name)}
        className={`w-full rounded-lg border-[1.5px] font-notoLoopThaiRegular ${
          isDisabled
            ? 'border-gray-300 bg-gray-100'
            : error
            ? 'border-red-500 '
            : 'border-gray-300 bg-white'
        } py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white`}
      ></textarea>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default TextArea;
