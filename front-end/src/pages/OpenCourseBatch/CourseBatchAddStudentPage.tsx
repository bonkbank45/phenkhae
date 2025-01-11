import React, { useState } from 'react';
import { useCourseBatchDataById } from '../../hooks/api/useCourseBatchData';
import { useParams } from 'react-router-dom';
import Search from '../../components/Search/Search';

const CourseBatchAddStudentPage = () => {
  const { id } = useParams();
  const { data, isLoading } = useCourseBatchDataById(id);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h1 className="text-2xl font-semibold mb-2">
          เพิ่มนักเรียน : {data.data.course.course_name} รุ่นที่{' '}
          {data.data.batch}
        </h1>
        <p className="text-gray-600">
          จำนวนที่รับได้: {data.data.max_students} คน | ลงทะเบียนแล้ว:{' '}
          {data.data.students_enrolled} คน | คงเหลือ:{' '}
          {data.data.max_students - data.data.students_enrolled} คน
        </p>
      </div>

      {/* Main Content */}
      <div className="flex gap-4">
        {/* Left Column */}
        <div className="w-2/3 bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">รายชื่อนักเรียน</h2>
          <Search
            value={''}
            onChange={() => {}}
            placeholder="ค้นหานักเรียนด้วยชื่อ, อีเมลหรือเบอร์โทรศัพท์"
          />
          <div className="h-[calc(100vh-300px)] overflow-y-auto">
            {/* ตัวอย่างรายการนักเรียน */}
            <label className="flex items-center p-2 hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" className="mr-3" />
              <span>นักเรียน 1</span>
            </label>
            <label className="flex items-center p-2 hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" className="mr-3" />
              <span>นักเรียน 2</span>
            </label>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-1/3 bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">
            นักเรียนที่เลือก ({selectedStudents.length})
          </h2>
          <div className="h-[calc(100vh-300px)] overflow-y-auto">
            {/* ตัวอย่างรายการที่เลือก */}
            <div className="flex items-center justify-between p-2">
              <span>นักเรียน 1</span>
              <button className="text-red-500 hover:text-red-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-4">
        <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
          ยกเลิก
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-white
            ${
              selectedStudents.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          disabled={selectedStudents.length === 0}
        >
          เพิ่มนักเรียน
        </button>
      </div>
    </div>
  );
};

export default CourseBatchAddStudentPage;
