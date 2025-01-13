interface Enrollment {
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

export type { Enrollment, GroupEnrollmentSubmit };
