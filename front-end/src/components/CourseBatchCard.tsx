import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FiEdit, FiEye, FiX } from 'react-icons/fi';
import { format } from 'date-fns';
import { removeTime } from '../utils/datetime';
import { CourseGroup, Status } from '../types/course_group';

interface Props {
  batch: CourseGroup;
  getStatusColor: (status: Status) => string;
  getStatusText: (date_start: string, date_end: string) => string;
  onViewDetails?: (id: number) => void;
  onCloseBatch?: (id: number) => void;
  onEditBatch?: (id: number) => void;
  onDeleteBatch?: (id: number) => void;
}

export const CourseBatchCard = ({
  batch,
  getStatusColor,
  getStatusText,
  onViewDetails,
  onCloseBatch,
  onEditBatch,
  onDeleteBatch,
}: Props) => {
  const { user } = useAuth();
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 dark:bg-boxdark border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 font-notoLoopThaiRegular">
      <h3 className="text-lg font-semibold mb-2">{batch.course.course_name}</h3>
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
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          className="flex items-center gap-1 px-3 py-1 border rounded-lg hover:bg-gray-50"
          onClick={() => onViewDetails?.(batch.id)}
        >
          <FiEye /> ดูรายละเอียด
        </button>
        <button
          className="flex items-center gap-1 px-3 py-1 border rounded-lg hover:bg-gray-50"
          onClick={() => onEditBatch?.(batch.id)}
        >
          <FiEdit /> แก้ไข
        </button>
        {/* {getStatusText(batch.date_start, batch.date_end) ===
          'กำลังเปิดรับสมัคร' && (
          <button
            className="flex items-center gap-1 px-3 py-1 border rounded-lg text-red-600 hover:bg-red-50"
            onClick={() => onDeleteBatch?.(batch.id)}
          >
            <FiX /> ลบ
          </button>
        )} */}
        {user?.role === 'admin' && (
          <button
            className="flex items-center gap-1 px-3 py-1 border rounded-lg text-red-600 hover:bg-red-50"
            onClick={() => onDeleteBatch?.(batch.id)}
          >
            <FiX /> ลบ
          </button>
        )}
      </div>
    </div>
  );
};
