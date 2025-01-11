import IconSearch from '../../common/Search';

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const Search = ({
  value,
  onChange,
  placeholder = 'ค้นหา...',
  className = '',
}: SearchProps) => {
  return (
    <>
      <div className="flex justify-start gap-0 w-full">
        <IconSearch
          width={40}
          height={50}
          className="rounded-l-lg border border-stroke dark:border-strokedark gap-0 px-1"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full mb-0 rounded-r-lg border border-stroke bg-white px-4 py-2 focus:border-primary focus:outline-none dark:border-strokedark dark:bg-boxdark font-notoLoopThaiRegular ${className}`}
        />
      </div>
    </>
  );
};

export default Search;
