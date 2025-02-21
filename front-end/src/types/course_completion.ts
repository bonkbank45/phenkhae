import { Course } from './course';
import { Student } from './student';

interface CourseGroup {
  id: number;
  course_group_id: number;
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

interface CourseCompletion {
  id: number;
  student_id: number;
  course_group_id: number;
  date_start: string;
  date_end: string;
  completion_date: string;
  created_at: string;
  updated_at: string;
  course_group: CourseGroup;
  student: Student;
}

export type { CourseCompletion, CourseGroup, Student };
