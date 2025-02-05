import { UseFormRegister, UseFormRegisterReturn } from 'react-hook-form';

interface TextFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  error?: string;
  includeRegister?:
    | UseFormRegister<any>
    | ((name: string) => UseFormRegisterReturn);
  className?: string;
  required?: boolean;
  defaultValue?: string | number;
  disabled?: boolean;
}

const TextField = ({
  label,
  name,
  type = 'text',
  placeholder,
  error,
  includeRegister,
  className,
  required = false,
  defaultValue,
  disabled = false,
}: TextFieldProps) => {
  return (
    <div className={`${className} mb-6 md:mb-0`}>
      <label className="font-notoLoopThaiRegular mb-1 block font-medium text-gray-500 dark:text-white">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        {...includeRegister(name)}
        defaultValue={defaultValue}
        className={`font-notoLoopThaiRegular w-full rounded-lg border bg-transparent py-2 pl-4 pr-10 bg-white text-black outline-none focus-visible:border-primary dark:bg-form-input dark:text-white ${
          error ? 'border-red-500' : 'border-stroke'
        } ${disabled ? 'bg-gray-100' : ''} ${
          disabled ? 'cursor-not-allowed' : ''
        }`}
        disabled={disabled}
      />
      {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
    </div>
  );
};

export default TextField;
