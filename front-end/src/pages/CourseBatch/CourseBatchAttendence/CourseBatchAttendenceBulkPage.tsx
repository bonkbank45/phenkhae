import React, { useState } from 'react';
import { Button } from '@material-tailwind/react';
import { useCourseAttendenceByCourseGroupId } from '../../../hooks/api/useCourseAttendence';
import { useStudentAttendence } from '../../../hooks/api/useStudentAttendence';
import { useEnrollmentStudentStatusByCourseGroupId } from '../../../hooks/api/useEnrollmentData';
import PaginatedTable from '../../../components/Tables/PaginatedTable';
import Pagination from '../../../components/Pagination';
import Spinner from '../../../common/Spinner';
import { useParams } from 'react-router-dom';
const CourseBatchAttendenceBulkPage = () => {
  const { id } = useParams();
  const { data: courseAttendences, isLoading: isLoadingCourseAttendences } =
    useCourseAttendenceByCourseGroupId(Number(id));
  const { data: studentAttendences, isLoading: isLoadingStudentAttendences } =
    useStudentAttendence(Number(id));
  const [attendance, setAttendance] = useState({});

  const {
    data: enrollmentStudentStatusData,
    isLoading: isLoadingEnrollmentStudentStatus,
  } = useEnrollmentStudentStatusByCourseGroupId(Number(id), 1);

  if (isLoadingCourseAttendences || isLoadingStudentAttendences) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  const handleCheck = (studentId, date) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [date]: !prev[studentId]?.[date],
      },
    }));
  };

  const handleSubmit = () => {
    console.log('Saving attendance:', attendance);
    // TODO: ส่งข้อมูลไปยัง backend
  };

  const studentAttendencesTable = enrollmentStudentStatusData.data.data.map(
    (student) => {
      const attendance = studentAttendences.data.find(
        (studentAttendence) =>
          studentAttendence.student_id === student.student_id,
      );

      return {
        student_id: student.student_id,
        firstname_tha: student.student.firstname_tha,
        lastname_tha: student.student.lastname_tha,
        status: attendance?.status ?? null,
      };
    },
  );

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">เช็คชื่อนักเรียน</h2>
      <div className="overflow-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border p-2">ชื่อ</th>
              {courseAttendences.data.map((day) => (
                <th key={day.attendence_date} className="border p-2">
                  {new Date(day.attendence_date).toLocaleDateString('th-TH')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {studentAttendences.data.map((student) => (
              <tr key={student.id}>
                <td className="border p-2">
                  {student.student.firstname_tha} {student.student.lastname_tha}
                </td>
                {courseAttendences.data.map((day) => (
                  <td
                    key={`${student.id}-${day.attendance_date}`}
                    className="border p-2 text-center"
                  >
                    <input
                      type="checkbox"
                      checked={
                        attendance[student.id]?.[day.attendance_date] || false
                      }
                      onChange={() =>
                        handleCheck(student.id, day.attendance_date)
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button color="green" className="mt-4" onClick={handleSubmit}>
        บันทึกการเช็คชื่อ
      </Button>
    </div>
  );
};

export default CourseBatchAttendenceBulkPage;
