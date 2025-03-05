import { CourseGroup } from './course_group';
import { Course } from './course';

export interface ExamType {
  id: number;
  exam_type_name: string;
}

export interface ExamTable {
  id: number;
  course_group_id: number;
  year: number;
  term: number;
  exam_type_id: number;
  exam_period: number;
  score_pass: number;
  date_start_exam: string;
  course_group: CourseGroup;
  exam_type: ExamType;
}

export interface AddExamType {
  exam_type_name: string;
}
