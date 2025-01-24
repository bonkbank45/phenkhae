import React from 'react';
import { format } from 'date-fns';
import { CourseGroup, Status } from '../types/course_group';

interface Props {
  batch: CourseGroup;
  getStatusColor: (status: Status) => string;
  getStatusText: (date_start: string, date_end: string) => string;
  isSelected: boolean;
  onSelect: (id: number) => void;
  disabled?: boolean;
}

export const SelectableCourseBatchCard = ({
  batch,
  getStatusColor,
  getStatusText,
  isSelected,
  onSelect,
  disabled = false,
}: Props) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-4 dark:bg-boxdark border 
        ${isSelected ? 'border-primary-500' : 'border-gray-100'} 
        dark:border-gray-700 hover:shadow-md transition-all duration-200 
        font-notoLoopThaiRegular relative
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={() => !disabled && onSelect(batch.id)}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => !disabled && onSelect(batch.id)}
          disabled={disabled}
          className="mt-1 h-5 w-5 rounded border-gray-300 text-primary-600 
            focus:ring-primary-500 cursor-pointer"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">
            {batch.course.course_name}
          </h3>
          <div className="space-y-2 text-sm">
            <p>
              รุ่นที่ {batch.batch} / {batch.date_start.split('-')[0]}
            </p>
            <p>
              วันที่: {format(new Date(batch.date_start), 'dd/MM/yyyy')} ถึง{' '}
              {format(new Date(batch.date_end), 'dd/MM/yyyy')}
            </p>
            <p>
              จำนวนการลงทะเบียน: {batch.students_enrolled}/{batch.max_students}
            </p>
            <span
              className={`inline-block px-2 py-1 rounded-full text-sm ${getStatusColor(
                getStatusText(batch.date_start, batch.date_end) as Status,
              )}`}
            >
              {getStatusText(batch.date_start, batch.date_end)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
