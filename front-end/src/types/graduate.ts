interface CourseCategoryBill {
  course_category_bill_id: number;
  course_category_bill_name: string;
}

interface CourseGroup {
  course_group_id: number;
  batch: number;
  date_start: string;
  date_end: string;
  theoretical_score_criteria: number;
  practical_score_criteria: number;
}

interface Enrollment {
  course_group_id: number;
  student_id: number;
  firstname_tha: string;
  lastname_tha: string;
  activity_case_status: number;
  theoretical_score: number;
  practical_score: number;
  enrollment_date: string;
  enrollment_date_start: string;
  enrollment_date_end: string | null;
  created_at: string;
  updated_at: string;
}

interface BillInfo {
  vol: number | null;
  no: number | null;
  date_submit: string | null;
  created_at: string | null;
  updated_at: string | null;
  course_price: string;
}

interface StudentAttendance {
  total_classes: number;
  present_count: string;
  absent_count: string;
}

interface CourseCompletion {
  course_completion_id: number;
  course_completion_date_start: string;
  course_completion_date_end: string;
  course_completion_completed_date: string;
}

export interface GraduateStudent {
  course_id: number;
  course_name: string;
  course_category: CourseCategoryBill;
  course_group: CourseGroup;
  enrollment: Enrollment;
  bill_infos: BillInfo;
  student_attendance: StudentAttendance;
  course_completion: CourseCompletion;
}
