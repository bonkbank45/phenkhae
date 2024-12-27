import IconFilter3Fill from '../../common/Filter';

interface FilterOption {
  value: number;
  label: string;
}

interface FilterProps {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  placeholder?: string;
  className?: string;
}

const Filter = ({
  value,
  onChange,
  options,
  placeholder = 'เลือกตัวกรอง',
  className = '',
}: FilterProps) => {
  return (
    <div className="flex items-center gap-0">
      <IconFilter3Fill
        width={45}
        height={45}
        className="rounded-l-lg border border-stroke dark:border-strokedark"
      />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`rounded-r-lg border border-stroke bg-white px-4 py-2 focus:border-primary focus:outline-none dark:border-strokedark dark:bg-boxdark font-notoLoopThaiRegular ${className}`}
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
