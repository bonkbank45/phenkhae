import { Student } from './student';
import { Course } from './course';

export interface LicenseCompleteTable {
  id: number;
  student_id: number;
  course_id: number;
  date_complete: string;
  created_at: string;
  updated_at: string;
  student: Student;
  course: Course;
}
