import IconFilter3Fill from '../../common/Filter';

interface FilterOption {
  value: string | number;
  label: string;
}

interface FilterProps {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  placeholder?: string;
  className?: string;
  classNameIcon?: string;
  showIcon?: boolean;
  disablePlaceholder?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
}

const Filter = ({
  value,
  onChange,
  options,
  placeholder = 'เลือกตัวกรอง',
  className = '',
  classNameIcon = '',
  showIcon = true,
  disablePlaceholder = false,
  isDisabled = false,
  isLoading = false,
}: FilterProps) => {
  return (
    <div className="flex items-center gap-0">
      {showIcon && (
        <IconFilter3Fill
          width={41}
          height={41}
          className={`rounded-l-lg border border-stroke dark:border-strokedark ${classNameIcon}`}
        />
      )}
      <div className="relative w-full">
        <select
          disabled={isDisabled || isLoading}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${
            showIcon ? 'rounded-r-lg' : 'rounded-lg'
          } h-full w-full border border-stroke bg-white px-4 py-2 focus:border-primary focus:outline-none dark:border-strokedark dark:bg-boxdark font-notoLoopThaiRegular text-sm ${
            isLoading ? 'cursor-not-allowed opacity-70' : ''
          } ${className}`}
        >
          <option value="all" disabled>
            {isLoading ? 'กำลังโหลด...' : placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-transparent"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Filter;
