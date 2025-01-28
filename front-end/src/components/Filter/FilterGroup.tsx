import React from 'react';
import Select, { StylesConfig } from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

interface Option {
  label: string;
  value: string | number;
}

interface FilterGroupProps {
  options: Option[];
  placeholder: string;
  onChange: (selectedOption: any) => void;
  error?: string;
}

const getColourStyles = (error?: string): StylesConfig => ({
  control: (styles) => ({
    ...styles,
    backgroundColor: 'white dark:bg-boxdark',
    height: '100%',
    minHeight: '100%',
    borderRadius: '0.5rem',
    fontFamily: '"Noto Sans Thai Looped Regular"',
    borderColor: error ? '#FF0000' : styles.borderColor,
    '&:hover': {
      borderColor: error ? '#FF0000' : styles.borderColor,
    },
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = '#a1b8ff';
    return {
      ...styles,
      backgroundColor: isDisabled
        ? undefined
        : isSelected
        ? '#a1b8ff'
        : isFocused
        ? '#f0f5ff'
        : undefined,
      color: isDisabled ? '#ccc' : isSelected ? '#bfbfbf' : '#737373',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      fontFamily: '"Noto Sans Thai Looped Regular"',
      ':active': {
        ...styles[':active'],
        backgroundColor: !isDisabled
          ? isSelected
            ? '#a1b8ff'
            : '#a1b8ff'
          : undefined,
      },
    };
  },
  input: (styles) => ({
    ...styles,
    fontFamily: '"Noto Sans Thai Looped Regular"',
  }),
  placeholder: (styles) => ({
    ...styles,
    fontFamily: '"Noto Sans Thai Looped Regular"',
  }),
  singleValue: (styles) => ({
    ...styles,
    fontFamily: '"Noto Sans Thai Looped Regular"',
  }),
  noOptionsMessage: (styles) => ({
    ...styles,
    fontFamily: '"Noto Sans Thai Looped Regular"',
  }),
});

export default function FilterGroup({
  placeholder,
  options,
  onChange,
  error,
}: FilterGroupProps) {
  const [selectedValues, setSelectedValues] = React.useState<Option[]>([]);

  const handleChange = (selected: Option[]) => {
    setSelectedValues(selected || []);
    onChange(selected);
  };
  return (
    <div className="w-full">
      <Select
        onChange={handleChange}
        closeMenuOnSelect={false}
        components={animatedComponents}
        isMulti
        styles={getColourStyles(error)}
        options={options}
        placeholder={placeholder}
        menuPlacement="auto"
        noOptionsMessage={() => 'ไม่พบข้อมูล'}
        isOptionDisabled={(option: Option) =>
          (option.value === 'all' &&
            selectedValues.length > 0 &&
            !selectedValues.some((opt) => opt.value === 'all')) ||
          (option.value !== 'all' &&
            selectedValues.some((opt) => opt.value === 'all'))
        }
      />
      {error && (
        <p className="ml-2 text-[12px] text-[#FF0000] font-notoLoopThaiRegular">
          {error}
        </p>
      )}
    </div>
  );
}
