import React from 'react';

interface AttachFileProps {
  label: string;
  onChange: (file: File) => void;
  className?: string;
}

const AttachFile = ({ label, onChange }: AttachFileProps) => {
  return (
    <div className="flex flex-col gap-5.5 p-6.5">
      <div>
        <label className="mb-3 block text-black dark:text-white font-notoRegular">
          {label}
        </label>
        <input
          type="file"
          className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
          onChange={(e) => onChange(e.target.files?.[0])}
        />
      </div>
    </div>
  );
};

export default AttachFile;
