import React from 'react';
import { FiEye, FiX } from 'react-icons/fi';
import { removeTime } from '../utils/datetime';
import { CourseGroup, Status } from '../types/course_group';
interface Props {
  batch: CourseGroup;
  getStatusColor: (status: Status) => string;
  getStatusText: (date_start: string, date_end: string) => string;
  onViewDetails?: (id: number) => void;
  onCloseBatch?: (id: number) => void;
}

export const CourseBatchCard = ({
  batch,
  getStatusColor,
  getStatusText,
  onViewDetails,
  onCloseBatch,
}: Props) => {
  console.log(batch);
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 dark:bg-boxdark border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 font-notoLoopThaiRegular">
      <h3 className="text-lg font-semibold mb-2">{batch.course.course_name}</h3>
      <div className="space-y-2 text-sm">
        <p>
          รุ่นที่ {batch.batch} / {batch.date_start.split('-')[0]}
        </p>
        <p>
          วันที่: {removeTime(batch.date_start)} - {removeTime(batch.date_end)}
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
      <div className="mt-4 flex gap-2">
        <button
          className="flex items-center gap-1 px-3 py-1 border rounded-lg hover:bg-gray-50"
          onClick={() => onViewDetails?.(batch.id)}
        >
          <FiEye /> ดูรายละเอียด
        </button>
        {getStatusText(batch.date_start, batch.date_end) === 'enrolling' && (
          <button
            className="flex items-center gap-1 px-3 py-1 border rounded-lg text-red-600 hover:bg-red-50"
            onClick={() => onCloseBatch?.(batch.id)}
          >
            <FiX /> ปิดรุ่น
          </button>
        )}
      </div>
    </div>
  );
};
