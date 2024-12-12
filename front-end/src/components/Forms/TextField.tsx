import React from 'react';

interface TextFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  error?: string;
  includeRegister?: any;
  className?: string;
}

const TextField = ({
  label,
  name,
  type = 'text',
  placeholder,
  error,
  includeRegister = {},
  className,
}: TextFieldProps) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="mb-2.5 block font-medium text-gray-500 dark:text-white">
        {label}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        {...includeRegister(name)}
        className={`w-full rounded-lg border bg-transparent py-4 pl-6 pr-10 bg-white text-black outline-none focus-visible:border-primary dark:bg-form-input dark:text-white ${
          error ? 'border-red-500' : 'border-stroke'
        }`}
      />
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default TextField;
