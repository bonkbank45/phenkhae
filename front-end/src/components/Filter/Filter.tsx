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
  showIcon?: boolean;
}

const Filter = ({
  value,
  onChange,
  options,
  placeholder = 'เลือกตัวกรอง',
  className = '',
  showIcon = true,
}: FilterProps) => {
  return (
    <div className="flex items-center gap-0">
      {showIcon && (
        <IconFilter3Fill
          width={45}
          height={45}
          className="rounded-l-lg border border-stroke dark:border-strokedark"
        />
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${
          showIcon ? 'rounded-r-lg' : 'rounded-lg'
        } border border-stroke bg-white px-4 py-2 focus:border-primary focus:outline-none dark:border-strokedark dark:bg-boxdark font-notoLoopThaiRegular ${className}`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filter;
