import {
  EnrollmentExtended,
  StudentCourseDataTable,
} from '../types/enrollment';
import { GraduateStudent } from '../types/graduate';
import { getCourseStatus } from './student';
import { format } from 'date-fns';
export const transformToStudentCourseDataTable = (
  enrollment: EnrollmentExtended,
): StudentCourseDataTable => {
  if (!enrollment) return null;
  return {
    course_group_id: enrollment.course_group_id,
    student_id: enrollment.student_id,
    student_name: `${enrollment.student.firstname_tha} ${enrollment.student.lastname_tha}`,
    course_name: enrollment.course_group.course.course_name,
    batch_name: `${enrollment.course_group.batch}`,
    enrollment_date: enrollment.enrollment_date
      ? format(enrollment.enrollment_date, 'dd/MM/yyyy')
      : '-',
    student_start_date: enrollment.date_start
      ? format(enrollment.date_start, 'dd/MM/yyyy')
      : '-',
    student_end_date: enrollment.date_end
      ? format(enrollment.date_end, 'dd/MM/yyyy')
      : '-',
    case_status:
      enrollment.activity_case_status === 0 ? 'ยังไม่ส่งเคส' : 'ส่งเคสแล้ว',
    theoretical_score: enrollment.theoretical_score,
    practical_score: enrollment.practical_score,
  };
};

export const isStudentGraduate = (graduate: GraduateStudent): boolean => {
  // ตรวจสอบว่ามีข้อมูลใบเสร็จครบถ้วน
  if (graduate.bill_infos.vol === null || graduate.bill_infos.no === null) {
    return false;
  }

  // คำนวณเปอร์เซ็นต์การเข้าเรียน
  const percentage =
    (Number(graduate.student_attendance.present_count) /
      graduate.student_attendance.total_classes) *
    100;

  // ตรวจสอบการเข้าเรียนต้องไม่ต่ำกว่า 80%
  if (percentage < 80) {
    return false;
  }

  // ตรวจสอบสถานะการส่งเคส
  if (graduate.enrollment.activity_case_status === 0) {
    return false;
  }

  // ตรวจสอบคะแนนภาคปฏิบัติ
  if (
    graduate.enrollment.practical_score <
    graduate.course_group.practical_score_criteria
  ) {
    return false;
  }

  // ตรวจสอบคะแนนภาคทฤษฎี
  if (
    graduate.enrollment.theoretical_score <
    graduate.course_group.theoretical_score_criteria
  ) {
    return false;
  }

  // ถ้าผ่านทุกเงื่อนไข
  return true;
};
