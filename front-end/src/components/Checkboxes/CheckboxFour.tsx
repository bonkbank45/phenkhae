interface CheckboxFourProps {
  label: string;
  isChecked: boolean;
  name: string;
  onChange: () => void;
}

const CheckboxFour = ({
  label,
  isChecked,
  name,
  onChange,
}: CheckboxFourProps) => {
  return (
    <div>
      <label
        htmlFor={`checkboxLabelFour-${label}`}
        className={`flex cursor-pointer select-none items-center font-notoLoopThaiRegular ${
          isChecked ? 'text-black dark:text-white' : 'text-gray-500'
        }`}
      >
        <div className="relative">
          <input
            type="checkbox"
            name={name}
            id={`checkboxLabelFour-${label}`}
            className="sr-only"
            checked={isChecked}
            onChange={onChange}
          />
          <div
            className={`mr-4 flex h-5 w-5 items-center justify-center rounded-full border ${
              isChecked && 'border-primary'
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-full bg-transparent ${
                isChecked && '!bg-primary'
              }`}
            >
              {' '}
            </span>
          </div>
        </div>
        {label}
      </label>
    </div>
  );
};

export default CheckboxFour;
