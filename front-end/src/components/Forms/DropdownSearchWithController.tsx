import { Controller, Control } from 'react-hook-form';
import Select, { components } from 'react-select';

interface DropdownSearchOption<Type> {
  value: Type;
  label: string;
}

interface DropdownSearchProps<Type> {
  label: string;
  name: string;
  placeholder?: string;
  error?: string;
  options: DropdownSearchOption<Type>[];
  control: Control<any>;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  isLoading?: boolean;
}

const DropdownIndicator = (props: any) => {
  return (
    <components.DropdownIndicator {...props}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.8">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
            fill="#637381"
          ></path>
        </g>
      </svg>
    </components.DropdownIndicator>
  );
};

const DropdownSearchWithController = <Type,>({
  label = '',
  name,
  placeholder,
  error,
  options,
  control,
  className,
  required = false,
  disabled = false,
  isLoading = false,
}: DropdownSearchProps<Type>) => {
  return (
    <div className={`${className} mb-6 md:mb-0`}>
      <label className="font-notoLoopThaiRegular mb-1 block font-medium text-gray-500 dark:text-white">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            menuPlacement="auto"
            onChange={(option: DropdownSearchOption<Type> | null) => {
              field.onChange(option?.value || '');
            }}
            value={
              options.find((option) => option.value === field.value) || null
            }
            options={options}
            placeholder={placeholder}
            className={`
              ${disabled ? 'opacity-50' : ''} 
              font-notoLoopThaiRegular
            `}
            classNames={{
              control: (state) => `
                !min-h-[40px] !p-1 !rounded-lg
                !border
                ${error && '!border-red-500'}
                !bg-white dark:!bg-gray-800
                ${
                  state.isFocused
                    ? '!border-blue-500 !border-2 !shadow-none'
                    : ''
                }
                ${state.isDisabled ? 'opacity-50' : ''}
              `,
              valueContainer: () => '!px-2',
              dropdownIndicator: () => '!px-2',
              singleValue: () => 'text-gray-900 dark:text-white',
              placeholder: () => 'text-gray-400',
              menu: () =>
                '!bg-white dark:!bg-gray-800 !border !border-gray-200 !rounded-md !shadow-lg',
              menuList: () => '!max-h-[150px] overflow-y-auto',
              option: (state) => `
                py-2 px-3
                ${state.isFocused ? 'bg-blue-100 dark:bg-gray-700' : ''}
                ${state.isSelected ? 'bg-gray-100 text-gray-500' : ''}
              `,
            }}
            components={{ DropdownIndicator }}
            unstyled
          />
        )}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default DropdownSearchWithController;
