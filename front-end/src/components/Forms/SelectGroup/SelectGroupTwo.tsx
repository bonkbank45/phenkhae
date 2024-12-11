import React, { useState } from 'react';

interface SelectGroupTwoProps {
  label: string;
  name: string;
  includeRegister: any;
  placeholder: string;
  error: string;
  options: { id: number; name: string }[];
}

const SelectGroupTwo: React.FC<SelectGroupTwoProps> = ({
  label = '',
  name = '',
  includeRegister,
  placeholder = '',
  error = '',
  options = [],
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);

  const changeTextColor = () => {
    setIsOptionSelected(true);
  };

  return (
    <div className="mb-4">
      <label className="mb-2.5 block font-medium text-gray-500 dark:text-white">
        {label}
      </label>

      <div className="w-full rounded-lg relative z-20 bg-white dark:bg-form-input">
        <select
          {...(includeRegister && includeRegister(name))}
          name={name}
          value={selectedOption}
          onChange={(e) => {
            setSelectedOption(e.target.value);
            changeTextColor();
          }}
          className={`w-full rounded-lg border bg-transparent py-4 pl-6 pr-10 bg-white text-black outline-none focus-visible:border-primary dark:bg-form-input dark:text-white ${
            error ? 'border-red-500' : 'border-stroke'
          } appearance-none`}
        >
          <option value="" disabled className="text-body dark:text-bodydark">
            {placeholder}
          </option>
          {options.map((option) => (
            <option
              key={option.id}
              value={option.id}
              className="text-body dark:text-bodydark"
            >
              {option.name}
            </option>
          ))}
        </select>

        <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2 pointer-events-none">
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
        </span>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default SelectGroupTwo;
