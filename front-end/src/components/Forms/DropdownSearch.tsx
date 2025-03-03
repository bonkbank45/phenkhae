import React from 'react';
import { Controller, Control } from 'react-hook-form';
import Select, { components } from 'react-select';

interface DropdownSearchProps {
  label: string;
  name: string;
  placeholder?: string;
  error?: string;
  options: { value: number; label: string }[];
  control: Control<any>;
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

const DropdownSearchWithController = ({
  label,
  name,
  placeholder,
  error,
  options,
  control,
}: DropdownSearchProps) => {
  return (
    <div className="mb-4">
      <label className="mb-2.5 block font-medium text-black dark:text-white">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            onChange={(option) => field.onChange(option?.value)}
            options={options}
            placeholder={placeholder}
            className="rounded-lg"
            classNamePrefix="select"
            styles={{
              control: (base) => ({
                ...base,
                padding: '0.5rem',
                borderRadius: '0.5rem',
                borderColor: error ? '#EF4444' : '#E2E8F0',
                backgroundColor: 'white',
              }),
              input: (base) => ({
                ...base,
                color: 'black',
              }),
              indicatorSeparator: (base) => ({
                ...base,
                display: 'none',
              }),
            }}
            components={{ DropdownIndicator }}
          />
        )}
      />
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default DropdownSearchWithController;
