import {
  EnrollmentExtended,
  StudentCourseDataTable,
} from '../types/enrollment';
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
