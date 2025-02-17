import { Student } from './student';
import { Course } from './course';

export interface LicenseQualTable {
  id: number;
  student_id: number;
  course_id: number;
  date_qualified: string;
  created_at: string;
  updated_at: string;
  is_completed: number;
  student_firstname_tha: string;
  student_lastname_tha: string;
  course_name: string;
}

export interface LicenseQualAddTableInterface {
  id: number;
  student_id: number;
  course_id: number;
  date_qualified: string;
  created_at: string;
  updated_at: string;
  student: Student;
  course: Course;
}
