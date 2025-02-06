import { CourseGroupTable } from './course_group';
import { Student } from './student';

interface Enrollment {
  course_group_id: number;
  student_id: number;
  activity_case_status: number;
  enrollment_date: string;
  date_start: string;
  date_end: string;
  course_price_id: number;
  created_at: string;
  updated_at: string;
  course_group: CourseGroupTable;
}

interface EnrollmentWithStudent extends Student {
  course_group_id: number;
  student_id: number;
  activity_case_status: number;
  enrollment_date: string;
  date_start: string;
  date_end: string;
  course_price_id: number;
}

interface GroupEnrollmentSubmit {
  course_group_id: number;
  student_ids: number[];
}

interface Course {
  id: number;
  course_category_id: number;
  course_category_bill_id: number;
  course_name: string;
  course_description: string;
  created_at: string;
  updated_at: string;
  course_category_bill: {
    id: number;
    category_bill_name: string;
  };
}

interface CourseGroupExtended {
  id: number;
  course_id: number;
  max_students: number;
  batch: number;
  theoretical_score_criteria: number;
  practical_score_criteria: number;
  date_start: string;
  date_end: string;
  created_at: string;
  updated_at: string;
  course: Course;
}

interface EnrollmentExtended {
  course_group_id: number;
  student_id: number;
  activity_case_status: number;
  enrollment_date: string;
  theoretical_score: number | null;
  practical_score: number | null;
  date_start: string;
  date_end: string | null;
  course_price_id: number;
  created_at: string;
  updated_at: string;
  course_group: CourseGroupExtended;
  student: Student;
}

export interface StudentCourseDataTable {
  course_group_id: number;
  student_id: number;
  student_name: string;
  course_name: string;
  batch_name: string;
  course_status?: string;
  enrollment_date: string;
  student_start_date: string;
  student_end_date: string;
  case_status: string;
  theoretical_score: number | null;
  practical_score: number | null;
}

export type {
  Enrollment,
  GroupEnrollmentSubmit,
  EnrollmentWithStudent,
  EnrollmentExtended,
  Course,
  CourseGroupExtended,
};
