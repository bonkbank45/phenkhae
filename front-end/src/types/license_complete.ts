import { Student } from './student';
import { CourseGroup } from './course_group';

export interface LicenseCompleteTable {
  id: number;
  student_id: number;
  course_group_id: number;
  date_complete: string;
  created_at: string;
  updated_at: string;
  student: Student;
  course_group: CourseGroup;
}
